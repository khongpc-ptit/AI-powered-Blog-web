import React from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id } = blog;
  const navigate = useNavigate();
  
  const getCategoryName = () => {
    if (!category) return "Uncategorized";
    return typeof category === 'object' ? category.name : category;
  };

  return (
    <div
      onClick={() => navigate(`/blogs/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      {image && (
        <img 
          src={image} 
          alt={title || "Blog image"} 
          className="aspect-video w-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {getCategoryName()}
      </span>
      <div>
        <h5 className="mb-2 font-medium text-gray-900 px-5">{title}</h5>
        <p
          className="mb-3 text-xs text-gray-600 px-5"
          dangerouslySetInnerHTML={{ "__html": description ? description.slice(0, 80) : "" }}
        />
      </div>
    </div>
  );
};

export default BlogCard;
