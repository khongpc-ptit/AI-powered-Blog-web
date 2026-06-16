import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { adminBlogService } from "../../services/api";

const ListBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await adminBlogService.getAll();
      const data = response.data.data?.blogs || response.data.data || [];
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handlePublishToggle = async (blog) => {
    try {
      await adminBlogService.togglePublish(blog._id);
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog._id ? { ...b, isPublished: !b.isPublished } : b
        )
      );
    } catch (error) {
      console.error("Error toggling publish status:", error);
    }
  };

  const handleDelete = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
      try {
        await adminBlogService.delete(blog._id);
        setBlogs((prev) => prev.filter((b) => b._id !== blog._id));
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
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
      field: "category",
      header: "Category",
      sortable: true,
      render: (item) => (
        <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
          {item.category}
        </span>
      ),
    },
    {
      field: "createdAt",
      header: "Date",
      sortable: true,
      render: (item) => {
        const BlogDate = new Date(item.createdAt);
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
        <p
          className={`${
            item.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {item.isPublished ? "Published" : "Unpublished"}
        </p>
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
    index: index + 1,
  }));

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-1 bg-blue-50/50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">All Blogs</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage and view all blog posts with search, sort, and filter options.
        </p>
      </div>
      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search blogs..."
        searchableFields={["title", "category", "subTitle"]}
        filterLabel="Status"
        filterOptions={[
          { value: "published", label: "Published", filterFn: (data) => data.filter((item) => item.isPublished) },
          { value: "unpublished", label: "Unpublished", filterFn: (data) => data.filter((item) => !item.isPublished) },
        ]}
        defaultSortField="createdAt"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage="No blogs found."
      />
    </div>
  );
};

export default ListBlog;
