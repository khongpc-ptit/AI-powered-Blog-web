import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

// Helper functions outside component ( không bị tạo lại mỗi render )
const getDescription = (htmlContent) => {
  if (!htmlContent) return "";
  const text = htmlContent.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.slice(0, 80) + (text.length > 80 ? "..." : "");
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const BlogCard = React.memo(({ blog }) => {
  const { title, content, description, image, _id, category, created_at } = blog;
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleClick = useCallback(() => {
    navigate(`/blogs/${_id}`);
  }, [navigate, _id]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const displayImage = imageError ? assets.blog_pic_1 : (image || assets.blog_pic_1);
  const displayCategory = category || "General";
  const displayContent = content || description || "";

  return (
    <div
      onClick={handleClick}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      <img
        src={displayImage}
        alt={title}
        className="aspect-video object-cover"
        onError={handleImageError}
      />
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {displayCategory}
      </span>
      <div>
        <h5 className="mb-2 font-medium text-gray-900 px-5">{title}</h5>
        <p className="mb-3 text-xs text-gray-600 px-5">
          {getDescription(displayContent)}
        </p>
        {created_at && (
          <p className="mb-3 text-xs text-gray-400 px-5">{formatDate(created_at)}</p>
        )}
      </div>
    </div>
  );
});

BlogCard.displayName = "BlogCard";

export default BlogCard;
