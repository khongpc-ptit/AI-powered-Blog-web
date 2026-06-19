import React, { useEffect, useState, useCallback } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../services/admin.api";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const navigate = useNavigate();

  const fetchBlogs = useCallback(async ({ search = "", pageNum = 1 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBlogs({
        page: pageNum,
        limit: 10,
        search,
      });
      setBlogs(data.result || []);
      setPagination(data.pagination || null);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs({ pageNum: 1 });
  }, [fetchBlogs]);

  const handleSearch = (searchQuery) => {
    fetchBlogs({ search: searchQuery, pageNum: 1 });
  };

  const handlePageChange = (newPage) => {
    fetchBlogs({ pageNum: newPage });
  };

  const handlePublishToggle = async (blog) => {
    try {
      await adminApi.toggleBlogPublish(blog._id);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, isPublished: !b.isPublished } : b
        )
      );
    } catch (err) {
      console.error("Failed to toggle publish:", err);
      alert(err.message || "Failed to toggle publish status");
    }
  };

  const handleDelete = async (blog) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${blog.title}"?`
    );
    if (!confirmDelete) return;

    try {
      await adminApi.deleteBlog(blog._id);
      setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
    } catch (err) {
      console.error("Failed to delete blog:", err);
      alert(err.message || "Failed to delete blog");
    }
  };

  const columns = [
    {
      field: "index",
      header: "#",
      sortable: false,
      headerClassName: "w-12",
      render: (item) => item.index,
    },
    {
      field: "title",
      header: "Blog Title",
      sortable: true,
      render: (item) => (
        <div className="max-w-xs truncate font-medium text-gray-800" title={item.title}>
          {item.title}
        </div>
      ),
    },
    {
      field: "subtitle",
      header: "Subtitle",
      sortable: true,
      render: (item) => (
        <div className="max-w-xs truncate text-gray-500 text-xs" title={item.subtitle}>
          {item.subtitle || "-"}
        </div>
      ),
    },
    {
      field: "category_name",
      header: "Category",
      sortable: false,
      render: (item) => (
        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
          {item.category_name || "-"}
        </span>
      ),
    },
    {
      field: "created_at",
      header: "Date",
      sortable: true,
      render: (item) => {
        const BlogDate = new Date(item.created_at);
        return (
          <span className="text-gray-600">
            {BlogDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      field: "isPublished",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span
          className={`${
            item.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {item.isPublished ? "Published" : "Unpublished"}
        </span>
      ),
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/admin/addBlog?id=${item._id}`)}
            className="border px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-gray-100 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handlePublishToggle(item)}
            className="border px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {item.isPublished ? "Unpublish" : "Publish"}
          </button>
          <img
            src={assets.cross_icon}
            onClick={() => handleDelete(item)}
            className="w-5 hover:scale-110 transition-all cursor-pointer"
            alt="Delete"
          />
        </div>
      ),
    },
  ];

  const tableData = blogs.map((blog, index) => ({
    ...blog,
    index: (page - 1) * 10 + index + 1,
  }));

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-1 bg-blue-50/50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Blogs</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and view all blog posts with search, sort, and filter options.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchBlogs({ pageNum: 1 })}
            className="text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search blogs by title or subtitle..."
        searchableFields={["title", "subtitle"]}
        filterLabel="Status"
        filterOptions={[
          { value: "published", label: "Published", filterFn: (data) => data.filter((item) => item.isPublished) },
          { value: "unpublished", label: "Unpublished", filterFn: (data) => data.filter((item) => !item.isPublished) },
        ]}
        defaultSortField="created_at"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage="No blogs found."
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ListBlog;
