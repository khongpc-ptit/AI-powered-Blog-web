import React from "react";
import { assets, blogCategories, blog_data } from "../../assets/assets";
import { useState } from "react";
import Quill from "quill";
import { useRef } from "react";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [searchParams] = useSearchParams();
  const blogId = searchParams.get("id");
  const isEditMode = !!blogId;

  const [image, setImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);
  const [description, setDescription] = useState("");
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    // TODO: Backend sẽ xử lý logic submit
    // Khi backend ready, gọi API tương ứng:
    // - Nếu isEditMode: PUT /api/admin/blogs/:id
    // - Nếu không: POST /api/admin/blogs
    console.log("Form submitted:", {
      title,
      subTitle,
      category,
      isPublished,
      description,
      image,
    });
  };

  const generateContent = () => {
    // TODO: Backend sẽ implement AI content generation
  };

  // Init Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      // Listen to text change to update description state
      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          setDescription(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  // Load blog data khi ở chế độ sửa
  useEffect(() => {
    if (isEditMode) {
      // TODO: Khi backend ready, gọi API GET /api/admin/blogs/:id
      // Hiện tại dùng mock data để demo
      const blog = blog_data.find((b) => b._id === blogId);
      if (blog) {
        setTitle(blog.title || "");
        setSubTitle(blog.subTitle || "");
        setCategory(blog.category || "Startup");
        setIsPublished(blog.isPublished || false);
        setDescription(blog.description || "");

        if (blog.image) {
          setImagePreview(blog.image);
        }

        // Set content cho Quill editor
        if (quillRef.current) {
          quillRef.current.root.innerHTML = blog.description || "";
        }
      }
    }
  }, [isEditMode, blogId]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p> Upload thumbnail</p>
        <label htmlFor="image">
          <img
            src={imagePreview || assets.upload_area}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setImage(file);
                setImagePreview(URL.createObjectURL(file));
              }
            }}
            type="file"
            id="image"
            hidden
          />
        </label>
        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type here..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <p className="mt-4">Sub Title</p>
        <input
          type="text"
          placeholder="Type here..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />
        <p className="mt-4">Blog Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          <button
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor--pointer"
          >
            Generate with AI
          </button>
        </div>
        <p className="mt-4">Blog Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>
        <button
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm"
        >
          {isEditMode ? "Update Blog" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
