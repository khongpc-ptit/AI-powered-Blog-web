import { useState, useMemo, useEffect, useCallback } from "react";

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
  onSearch,
  pagination,
  onPageChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(
    pagination?.limit || 10
  );
  const [dateFilter, setDateFilter] = useState("all");
  const [customFilter, setCustomFilter] = useState("all");

  const isServerPagination = Boolean(pagination && onPageChange);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateFilter, customFilter]);

  useEffect(() => {
    if (pagination) {
      setCurrentPage(pagination.page || 1);
      setItemsPerPage(pagination.limit || 10);
    }
  }, [pagination]);

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

  const paginatedData = useMemo(() => {
    if (isServerPagination) {
      // Server-side pagination: data đã được phân trang từ server
      return sortedData;
    }
    // Client-side pagination: cần slice data
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, isServerPagination, currentPage, itemsPerPage]);

  const totalPages = isServerPagination
    ? (pagination?.total_pages || 1)
    : Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handlePageChange = (page) => {
    const maxPage = isServerPagination 
      ? (pagination?.total_pages || 1) 
      : totalPages;
    const newPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const handleInternalPageChange = (page) => {
    const maxPage = isServerPagination 
      ? (pagination?.total_pages || 1) 
      : totalPages;
    const newPage = Math.max(1, Math.min(page, maxPage));
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setDateFilter("all");
    setCustomFilter("all");
    setSortField(defaultSortField);
    setSortOrder(defaultSortOrder);
    setCurrentPage(1);
  }, [defaultSortField, defaultSortOrder]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (isServerPagination) {
      setCurrentPage(1);
    }
  }, [isServerPagination]);

  const handleDateFilterChange = useCallback((value) => {
    setDateFilter(value);
    if (isServerPagination) {
      setCurrentPage(1);
    }
  }, [isServerPagination]);

  const handleCustomFilterChange = useCallback((value) => {
    setCustomFilter(value);
    if (isServerPagination) {
      setCurrentPage(1);
    }
  }, [isServerPagination]);

  const hasActiveFilters = searchQuery || dateFilter !== "all" || customFilter !== "all";

  const effectiveTotalPages = isServerPagination
    ? (pagination?.total_pages || 1)
    : totalPages;

  const effectiveTotalItems = isServerPagination
    ? (pagination?.total_items || data.length)
    : sortedData.length;

  const effectiveStartIndex = isServerPagination
    ? ((pagination?.page || 1) - 1) * (pagination?.limit || 10)
    : (currentPage - 1) * itemsPerPage;

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
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
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
          {(searchQuery || isServerPagination) && (
            <button
              onClick={() => {
                handleSearchChange("");
                if (onSearch) onSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Button for server pagination */}
        {isServerPagination && (
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Search
          </button>
        )}

        {/* Date Filter */}
        <select
          value={dateFilter}
          onChange={(e) => handleDateFilterChange(e.target.value)}
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
            onChange={(e) => handleCustomFilterChange(e.target.value)}
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
        {hasActiveFilters && !isServerPagination && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Reset
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full min-w-[600px] text-xs sm:text-sm text-gray-600">
          <thead className="text-[10px] sm:text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.field}
                  scope="col"
                  className={`px-2 sm:px-4 py-2 sm:py-3 ${
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
                <td colSpan={columns.length} className="px-2 sm:px-4 py-6 sm:py-8 text-center">
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
                      className={`px-2 sm:px-4 py-2 sm:py-3 ${column.cellClassName || ""}`}
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
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center mt-3 sm:mt-4 gap-2 px-1">
        <div className="flex items-center gap-1 sm:gap-2 order-2 sm:order-1">
          <span className="text-xs sm:text-sm text-gray-600">Rows:</span>
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
            {isServerPagination
              ? `Showing ${effectiveStartIndex + 1}-${Math.min(effectiveStartIndex + (pagination?.limit || 10), effectiveTotalItems)} of ${effectiveTotalItems}`
              : `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, sortedData.length)} of ${sortedData.length}`
            }
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleInternalPageChange(1)}
            disabled={currentPage === 1}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => handleInternalPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          {Array.from({ length: Math.min(5, effectiveTotalPages) }, (_, i) => {
            let pageNum;
            if (effectiveTotalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= effectiveTotalPages - 2) {
              pageNum = effectiveTotalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => handleInternalPageChange(pageNum)}
                className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs border rounded ${
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
            onClick={() => handleInternalPageChange(currentPage + 1)}
            disabled={currentPage === effectiveTotalPages}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => handleInternalPageChange(effectiveTotalPages)}
            disabled={currentPage === effectiveTotalPages}
            className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
