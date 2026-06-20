import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { PERMISSIONS } from "../../constants/rbac";
import { getCurrentUser, hasPermission } from "../../utils/permission";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const { title, createdAt } = blog;
  const BlogDate = new Date(createdAt);

  const canUpdatePost = hasPermission(currentUser, PERMISSIONS.UPDATE_POST);
  const canDeletePost = hasPermission(currentUser, PERMISSIONS.DELETE_POST);
  const canChangePostStatus = hasPermission(
    currentUser,
    PERMISSIONS.CHANGE_POST_STATUS,
  );

  const handleEdit = () => {
    navigate(`/admin/addBlog?id=${blog._id}`);
  };

  const handleChangeStatus = () => {
    alert(blog.isPublished ? "Unpublish blog" : "Publish blog");
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    alert("Delete blog");

    if (fetchBlogs) {
      fetchBlogs();
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <th className="px-2 py-4">{index}</th>

      <td className="px-2 py-4">{title}</td>

      <td className="px-2 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-2 py-4 max-sm:hidden">
        <p
          className={`${
            blog.isPublished ? "text-green-600" : "text-orange-700"
          }`}
        >
          {blog.isPublished ? "Published" : "Unpublished"}
        </p>
      </td>

      <td className="px-2 py-4">
        <div className="flex text-xs gap-3 items-center">
          {canUpdatePost && (
            <button
              type="button"
              onClick={handleEdit}
              className="border px-2 py-0.5 mt-1 rounded cursor-pointer hover:bg-gray-100"
            >
              Edit
            </button>
          )}

          {canChangePostStatus && (
            <button
              type="button"
              onClick={handleChangeStatus}
              className="border px-2 py-0.5 mt-1 rounded cursor-pointer hover:bg-gray-100"
            >
              {blog.isPublished ? "Unpublish" : "Publish"}
            </button>
          )}

          {canDeletePost && (
            <img
              onClick={handleDelete}
              src={assets.cross_icon}
              className="w-8 hover:scale-110 transition-all cursor-pointer"
              alt="Delete"
            />
          )}

          {!canUpdatePost && !canChangePostStatus && !canDeletePost && (
            <span className="text-gray-400">No action</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
