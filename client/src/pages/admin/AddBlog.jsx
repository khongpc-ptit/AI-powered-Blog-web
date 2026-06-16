import React from "react";
import { assets, blogCategories } from "../../assets/assets";
import { useState } from "react";
import Quill from "quill";
import { useRef } from "react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { adminBlogService, blogService } from "../../services/api";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blogId = searchParams.get("id");
  const isEditMode = !!blogId;

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await blogService.getCategories();
        const cats = response.data.data?.categories || response.data.data || [];
        if (cats.length > 0) {
          setCategories(["Startup", "Technology", ...cats.map((c) => c.name || c)]);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories(blogCategories.filter((c) => c !== "All"));
      }
    };
    fetchCategories();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subTitle", subTitle);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("isPublished", String(isPublished));

    if (image) {
      formData.append("image", image);
    }

    try {
      if (isEditMode) {
        await adminBlogService.update(blogId, formData);
      } else {
        await adminBlogService.create(formData);
      }
      navigate("/admin/listBlog");
    } catch (error) {
      console.error("Error submitting blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!title && !subTitle) {
      alert("Please enter a title or subtitle first.");
      return;
    }

    const prompt = subTitle || title;
    if (!window.confirm(`Generate content for "${prompt}"?`)) return;

    setLoading(true);
    try {
      const response = await adminBlogService.generateContent({ prompt });
      const generatedContent = response.data.data?.content || response.data.content;

      if (generatedContent && quillRef.current) {
        quillRef.current.root.innerHTML = generatedContent;
        setDescription(generatedContent);
      }
    } catch (error) {
      console.error("Error generating content:", error);
      alert("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Init Quill editor
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      quillRef.current.on("text-change", () => {
        if (quillRef.current) {
          setDescription(quillRef.current.root.innerHTML);
        }
      });
    }
  }, []);

  // Load blog data when editing
  useEffect(() => {
    const fetchBlogData = async () => {
      if (isEditMode) {
        try {
          const response = await blogService.getById(blogId);
          const blog = response.data.data || response.data;

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
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      }
    };

    fetchBlogData();
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
            accept="image/*"
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
            disabled={loading}
            className="absolute bottom-1 right-2 ml-2 text-xs text-white bg-black/70 px-4 py-1.5 rounded hover:underline cursor-pointer disabled:opacity-50"
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
          {categories.length > 0 ? (
            categories.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))
          ) : (
            blogCategories
              .filter((c) => c !== "All")
              .map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))
          )}
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
          disabled={loading}
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditMode ? "Update Blog" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
