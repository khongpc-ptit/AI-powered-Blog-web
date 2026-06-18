import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import { assets } from "../../assets/assets";
import { commentService } from "../../services/comment.service";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [approvalFilter, setApprovalFilter] = useState("pending");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await commentService.getAll();
      if (response.data) {
        setComments(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      await commentService.approve(commentId);
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId ? { ...c, isApproved: true } : c
        )
      );
    } catch (error) {
      console.error("Failed to approve comment:", error);
      alert("Failed to approve comment");
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      await commentService.delete(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
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
      field: "blogTitle",
      header: "Blog Title",
      sortable: true,
      render: (item) => (
        <div className="max-w-xs truncate font-medium text-gray-800" title={item.comment?.blog?.title}>
          {item.comment?.blog?.title || item.blog?.title || "N/A"}
        </div>
      ),
    },
    {
      field: "name",
      header: "Name",
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-700">
          {item.comment?.name || item.user?.name || "Anonymous"}
        </span>
      ),
    },
    {
      field: "content",
      header: "Comment",
      sortable: false,
      render: (item) => (
        <div className="max-w-md truncate text-gray-600" title={item.comment?.content}>
          {item.comment?.content || item.content}
        </div>
      ),
    },
    {
      field: "createdAt",
      header: "Date",
      sortable: true,
      render: (item) => {
        const commentDate = new Date(item.comment?.createdAt || item.createdAt);
        return (
          <span className="text-gray-600 whitespace-nowrap">
            {commentDate.toLocaleDateString()}
          </span>
        );
      },
    },
    {
      field: "isApproved",
      header: "Status",
      sortable: true,
      render: (item) => {
        const isApproved = item.comment?.isApproved ?? item.isApproved;
        return isApproved ? (
          <span className="px-2 py-1 text-xs border border-green-600 bg-green-100 text-green-600 rounded-full whitespace-nowrap">
            Approved
          </span>
        ) : (
          <span className="px-2 py-1 text-xs border border-orange-600 bg-orange-100 text-orange-600 rounded-full whitespace-nowrap">
            Pending
          </span>
        );
      },
    },
    {
      field: "actions",
      header: "Actions",
      sortable: false,
      render: (item) => {
        const isApproved = item.comment?.isApproved ?? item.isApproved;
        const commentId = item.comment?._id || item._id;
        
        return (
          <div className="flex items-center gap-3">
            {!isApproved && (
              <img
                src={assets.tick_icon}
                onClick={() => handleApprove(commentId)}
                className="w-5 hover:scale-110 transition-all cursor-pointer"
                alt="Approve"
                title="Approve"
              />
            )}
            <img
              src={assets.bin_icon}
              onClick={() => handleDelete(commentId)}
              alt="Delete"
              title="Delete"
              className="w-5 hover:scale-110 transition-all cursor-pointer"
            />
          </div>
        );
      },
    },
  ];

  const getCommentContent = (item) => item.comment?.content || item.content;
  const getCommentId = (item) => item.comment?._id || item._id;
  const getCommentIsApproved = (item) => item.comment?.isApproved ?? item.isApproved;
  const getCommentCreatedAt = (item) => item.comment?.createdAt || item.createdAt;
  const getCommentName = (item) => item.comment?.name || item.user?.name || "Anonymous";
  const getBlogTitle = (item) => item.comment?.blog?.title || item.blog?.title || "N/A";

  const tableData = comments
    .filter((comment) => {
      const isApproved = getCommentIsApproved(comment);
      if (approvalFilter === "approved") {
        return isApproved === true;
      }
      if (approvalFilter === "pending") {
        return isApproved === false;
      }
      return true;
    })
    .map((comment, index) => ({
      comment,
      index: index + 1,
      content: getCommentContent(comment),
      _id: getCommentId(comment),
      isApproved: getCommentIsApproved(comment),
      createdAt: getCommentCreatedAt(comment),
      name: getCommentName(comment),
      blogTitle: getBlogTitle(comment),
    }));

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Comments</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and view all comments with search, sort, and filter options.
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setApprovalFilter("approved")}
            className={`shadow-custom-sm border rounded-full px-4 py-2 cursor-pointer text-sm transition-colors ${
              approvalFilter === "approved"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setApprovalFilter("pending")}
            className={`shadow-custom-sm border rounded-full px-4 py-2 cursor-pointer text-sm transition-colors ${
              approvalFilter === "pending"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setApprovalFilter("all")}
            className={`shadow-custom-sm border rounded-full px-4 py-2 cursor-pointer text-sm transition-colors ${
              approvalFilter === "all"
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
        </div>
      </div>
      <DataTable
        data={tableData}
        columns={columns}
        searchPlaceholder="Search comments..."
        searchableFields={["name", "content", "blogTitle"]}
        filterLabel="Approval"
        filterOptions={[
          { value: "approved", label: "Approved", filterFn: (data) => data.filter((item) => item.isApproved) },
          { value: "pending", label: "Pending", filterFn: (data) => data.filter((item) => !item.isApproved) },
        ]}
        defaultSortField="createdAt"
        defaultSortOrder="desc"
        loading={loading}
        emptyMessage={approvalFilter === "pending" ? "No pending comments." : "No comments found."}
      />
    </div>
  );
};

export default Comments;
