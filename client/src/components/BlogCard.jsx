import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const BlogCard = ({ blog }) => {
  const { title, content, image, _id, category, created_at } = blog;
  const navigate = useNavigate();

  // Strip HTML tags from content for description
  const getDescription = (htmlContent) => {
    if (!htmlContent) return "";
    const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    return text.slice(0, 80) + (text.length > 80 ? "..." : "");
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div
      onClick={() => navigate(`/blogs/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      <img
        src={image || assets.blog_pic_1}
        alt={title}
        className="aspect-video object-cover"
        onError={(e) => {
          e.target.src = assets.blog_pic_1;
        }}
      />
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category || "General"}
      </span>
      <div>
        <h5 className="mb-2 font-medium text-gray-900 px-5">{title}</h5>
        <p className="mb-3 text-xs text-gray-600 px-5">
          {getDescription(content)}
        </p>
        {created_at && (
          <p className="mb-3 text-xs text-gray-400 px-5">{formatDate(created_at)}</p>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
