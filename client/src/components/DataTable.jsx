import { useState, useMemo } from "react";

const DataTable = ({
  data = [],
  columns = [],
  searchPlaceholder = "Search...",
  searchableFields = [],
  filterOptions = [],
  filterLabel = "",
  defaultSortField = "",
  defaultSortOrder = "asc",
  itemsPerPageOptions = [5, 10, 20, 50],
  emptyMessage = "No data available",
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState("all");
  const [customFilter, setCustomFilter] = useState("all");

  const getDateRange = (filter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case "today":
        return { start: today, end: new Date(today.getTime() + 86400000) };
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        return { start: weekStart, end: weekEnd };
      }
      case "month": {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return { start: monthStart, end: monthEnd };
      }
      default:
        return null;
    }
  };

  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery && searchableFields.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) =>
        searchableFields.some((field) => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(query);
        })
      );
    }

    if (dateFilter !== "all") {
      const range = getDateRange(dateFilter);
      if (range) {
        result = result.filter((item) => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= range.start && itemDate < range.end;
        });
      }
    }

    if (customFilter !== "all" && filterOptions.length > 0) {
      const filterConfig = filterOptions.find((opt) => opt.value === customFilter);
      if (filterConfig && filterConfig.filterFn) {
        result = filterConfig.filterFn(result, customFilter);
      }
    }

    return result;
  }, [data, searchQuery, dateFilter, customFilter, searchableFields, filterOptions]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal === bVal) return 0;

      let comparison;
      if (typeof aVal === "string") {
        comparison = aVal.localeCompare(bVal);
      } else if (aVal instanceof Date || !isNaN(Date.parse(aVal))) {
        comparison = new Date(aVal) - new Date(bVal);
      } else {
        comparison = aVal - bVal;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredData, sortField, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setDateFilter("all");
    setCustomFilter("all");
    setSortField(defaultSortField);
    setSortOrder(defaultSortOrder);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || dateFilter !== "all" || customFilter !== "all";

  return (
    <div className="w-full">
      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        {/* Custom Filter */}
        {filterOptions.length > 0 && (
          <select
            value={customFilter}
            onChange={(e) => {
              setCustomFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
          >
            <option value="all">All {filterLabel}</option>
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full text-sm text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  scope="col"
                  className={`px-4 py-3 ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100 select-none" : ""
                  } ${column.headerClassName || ""}`}
                  onClick={() => column.sortable && handleSort(column.field)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <span className="inline-flex flex-col">
                        <svg
                          className={`w-3 h-3 ${sortField === column.field && sortOrder === "asc" ? "text-primary" : "text-gray-400"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 5l-7 7h14l-7-7z" />
                        </svg>
                        <svg
                          className={`w-3 h-3 -mt-1 ${sortField === column.field && sortOrder === "desc" ? "text-primary" : "text-gray-400"}`}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 19l7-7H5l7 7z" />
                        </svg>
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item._id || item.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.field}
                      className={`px-4 py-3 ${column.cellClassName || ""}`}
                    >
                      {column.render ? column.render(item) : item[column.field]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} of{" "}
            {sortedData.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 text-sm border rounded ${
                  currentPage === pageNum
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
