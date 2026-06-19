import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import Loader from "./Loader";
import { blogApi } from "../services/blog.api";

const BlogList = () => {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState("All");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync search from URL on mount
  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const data = await blogApi.getCategories();
      setCategories(["All", ...data.result]);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setCategories(["All", "Technology", "Life Style", "Education"]);
    }
  }, []);

  // Fetch blogs with filters and pagination
  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const category = menu === "All" ? "" : menu;
      const sortField = sortBy === "newest" ? "created_at" : sortBy === "oldest" ? "created_at" : sortBy;
      const sortOrder = sortBy === "oldest" ? "asc" : order;

      const data = await blogApi.getBlogs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category,
        sort_by: sortField,
        order: sortOrder,
      });

      setBlogs(data.result);
      if (data.pagination) {
        setTotalPages(data.pagination.total_pages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchQuery, menu, sortBy, order]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchBlogs();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCategoryChange = (cat) => {
    setMenu(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    if (value === "newest") {
      setSortBy("created_at");
      setOrder("desc");
    } else if (value === "oldest") {
      setSortBy("created_at");
      setOrder("asc");
    } else if (value === "title-asc") {
      setSortBy("title");
      setOrder("asc");
    } else if (value === "title-desc") {
      setSortBy("title");
      setOrder("desc");
    }
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setMenu("All");
    setSortBy("created_at");
    setOrder("desc");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || menu !== "All" || sortBy !== "created_at" || order !== "desc";

  return (
    <div>
      {/* Category Filter */}
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {categories.map((item) => (
          <div key={item} className="relative">
            <button
              onClick={() => handleCategoryChange(item)}
              className={`cursor-pointer text-gray-500 ${
                menu === item && "text-white px-4 pt-0.5"
              }`}
            >
              {item}
              {menu === item && (
                <motion.div
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                ></motion.div>
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center bg-white p-4 rounded-lg shadow-sm">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearchChange}
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

          {/* Sort Dropdown */}
          <select
            value={sortBy === "title" ? (order === "asc" ? "title-asc" : "title-desc") : (order === "asc" ? "oldest" : "newest")}
            onChange={handleSortChange}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {blogs.length} blog{blogs.length !== 1 ? "s" : ""}
          {menu !== "All" && ` in ${menu}`}
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={fetchBlogs}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : blogs.length > 0 ? (
        <>
          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-8 mx-8 sm:mx-16 xl:mx-40">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-2 mb-24 px-4">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                « First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                ‹ Prev
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
                    className={`px-3 py-1.5 text-sm border rounded ${
                      currentPage === pageNum
                        ? "bg-primary text-white border-primary"
                        : "border-gray-300 hover:bg-gray-100 bg-white"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Next ›
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
              >
                Last »
              </button>

              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white"
                >
                  {[4, 8, 12, 16, 20].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No blogs found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
