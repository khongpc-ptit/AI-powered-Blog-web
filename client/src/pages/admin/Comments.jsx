import React, { useState, useEffect, useCallback } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { adminApi } from "../../services/admin.api";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [approvalFilter, setApprovalFilter] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchComments = useCallback(async ({ approval = "pending", pageNum = 1 } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const isApprovedParam = approval === "all" ? "" : approval === "approved" ? "true" : "false";
      const data = await adminApi.getComments({
        page: pageNum,
        limit: 10,
        is_approved: isApprovedParam,
      });
      setComments(data.result || []);
      setPagination(data.pagination || null);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError(err.message || "Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments({ approval: approvalFilter, pageNum: 1 });
  }, [approvalFilter, fetchComments]);

  const handleFilterChange = (newFilter) => {
    setApprovalFilter(newFilter);
  };

  const handleSearch = (searchQuery) => {
    const isApprovedParam = approvalFilter === "all" ? "" : approvalFilter === "approved" ? "true" : "false";
    fetchComments({ approval: approvalFilter, pageNum: 1 });
  };

  const handlePageChange = (newPage) => {
    fetchComments({ approval: approvalFilter, pageNum: newPage });
  };

  const handleApprove = async (commentId) => {
    setActionLoading(commentId);
    try {
      await adminApi.approveComment(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, is_approved: true } : c
        )
      );
    } catch (err) {
      console.error("Failed to approve comment:", err);
      alert(err.message || "Failed to approve comment");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (comment) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this comment by "${comment.name}"?`
    );
    if (!confirmDelete) return;

    setActionLoading(comment._id);
    try {
      await adminApi.deleteComment(comment._id);
      setComments((prev) => prev.filter((c) => c._id !== comment._id));
    } catch (err) {
      console.error("Failed to delete comment:", err);
      alert(err.message || "Failed to delete comment");
    } finally {
      setActionLoading(null);
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
      field: "blog_id",
      header: "Blog Title",
      sortable: false,
      render: (item) => (
        <div className="max-w-xs truncate font-medium text-gray-800" title={item.blog_id || "N/A"}>
          {item.blog_id || "N/A"}
        </div>
      ),
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-700">{item.name}</span>
      ),
    },
    {
      field: "content",
      header: "Comment",
      sortable: false,
      render: (item) => (
        <div className="max-w-md truncate text-gray-600" title={item.content}>
          {item.content}
        </div>
      ),
    },
    {
      field: "created_at",
      header: "Date",
      sortable: true,
      render: (item) => {
        const commentDate = new Date(item.created_at);
        return (
          <span className="text-gray-600 whitespace-nowrap">
            {commentDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      field: "is_approved",
      header: "Status",
      sortable: true,
      render: (item) => (
        item.is_approved ? (
          <span className="px-2 py-1 text-xs border border-green-600 bg-green-100 text-green-600 rounded-full whitespace-nowrap">
            Approved
          </span>
        ) : (
          <span className="px-2 py-1 text-xs border border-orange-600 bg-orange-100 text-orange-600 rounded-full whitespace-nowrap">
            Pending
          </span>
        )
      ),
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => (
        <div className="flex items-center gap-3">
          {!item.is_approved && (
            <button
              onClick={() => handleApprove(item._id)}
              disabled={actionLoading === item._id}
              className="border border-green-500 text-green-600 px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              title="Approve"
            >
              {actionLoading === item._id ? (
                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></span>
              ) : (
                <img src={assets.tick_icon} alt="Approve" className="w-4 h-4" />
              )}
              Approve
            </button>
          )}
          <button
            onClick={() => handleDelete(item)}
            disabled={actionLoading === item._id}
            className="border border-red-400 text-red-500 px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            title="Delete"
          >
            {actionLoading === item._id ? (
              <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-500"></span>
            ) : (
              <img src={assets.bin_icon} alt="Delete" className="w-4 h-4" />
            )}
            Delete
          </button>
        </div>
      ),
    },
  ];

  const tableData = comments.map((comment, index) => ({
    ...comment,
    index: (page - 1) * 10 + index + 1,
  }));

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Comments</h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Manage and view all comments with search, sort, and filter options.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <button
            onClick={() => handleFilterChange("approved")}
            className={`shadow-custom-sm border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer text-xs sm:text-sm transition-colors ${
              approvalFilter === "approved"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => handleFilterChange("pending")}
            className={`shadow-custom-sm border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer text-xs sm:text-sm transition-colors ${
              approvalFilter === "pending"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleFilterChange("all")}
            className={`shadow-custom-sm border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer text-xs sm:text-sm transition-colors ${
              approvalFilter === "all"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => fetchComments({ approval: approvalFilter, pageNum: 1 })}
            className="text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search comments by name or content..."
        searchableFields={["name", "content"]}
        filterLabel="Approval"
        filterOptions={[
          { value: "approved", label: "Approved", filterFn: (data) => data.filter((item) => item.is_approved) },
          { value: "pending", label: "Pending", filterFn: (data) => data.filter((item) => !item.is_approved) },
        ]}
        defaultSortField="created_at"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage={approvalFilter === "pending" ? "No pending comments." : "No comments found."}
        onSearch={handleSearch}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Comments;
