import React, { useEffect, useRef, useState } from "react";
import { assets, blogCategories, blog_data } from "../../assets/assets";
import Quill from "quill";
import { useSearchParams } from "react-router-dom";
import "quill/dist/quill.snow.css";

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

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write blog description here...",
      });

      quillRef.current.on("text-change", () => {
        setDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  useEffect(() => {
    if (isEditMode) {
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

        if (quillRef.current) {
          quillRef.current.root.innerHTML = blog.description || "";
        }
      }
    }
  }, [isEditMode, blogId]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto"
    >
      <div className="bg-white w-full max-w-2xl p-4 md:p-8 sm:m-8 shadow rounded">
        <p>Upload thumbnail</p>

        <label htmlFor="image">
          <img
            src={imagePreview || assets.upload_area}
            alt=""
            className="mt-2 h-14 rounded cursor-pointer object-cover"
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

        <p className="mt-4 mb-2">Blog Description</p>

        <div className="w-full max-w-lg relative">
          <div ref={editorRef} className="bg-white"></div>

          <button
            type="button"
            onClick={generateContent}
            className="mt-3 text-xs text-white bg-black/70 px-4 py-2 rounded hover:bg-black/80 cursor-pointer"
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
          {blogCategories.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
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
