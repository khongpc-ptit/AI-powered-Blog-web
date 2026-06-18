import React, { useState, useEffect, useRef } from "react";
import { assets } from "../../assets/assets";
import Quill from "quill";
import { useNavigate, useSearchParams } from "react-router-dom";
import { adminBlogService } from "../../services/blog.service";
import { categoryService } from "../../services/category.service";

const AddBlog = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blogId = searchParams.get("id");
  const isEditMode = !!blogId;

  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response.data) {
          setCategories(response.data);
          if (response.data.length > 0 && !category) {
            setCategory(response.data[0].name || response.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

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
      const fetchBlog = async () => {
        try {
          const response = await adminBlogService.getAll();
          const blog = response.data?.find((b) => b._id === blogId);
          if (blog) {
            setTitle(blog.title || "");
            setSubTitle(blog.subTitle || "");
            setCategory(blog.category?.name || blog.category || "");
            setIsPublished(blog.isPublished || false);
            setDescription(blog.description || "");

            if (blog.image) {
              setImagePreview(blog.image);
            }

            if (quillRef.current) {
              quillRef.current.root.innerHTML = blog.description || "";
            }
          }
        } catch (error) {
          console.error("Failed to fetch blog:", error);
        }
      };
      fetchBlog();
    }
  }, [isEditMode, blogId]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subTitle", subTitle);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("isPublished", String(isPublished));

      if (image) {
        formData.append("image", image);
      }

      if (isEditMode) {
        await adminBlogService.update(blogId, formData);
      } else {
        await adminBlogService.create(formData);
      }

      navigate("/admin/listBlog");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save blog");
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    if (!title && !subTitle) {
      setError("Please enter a title first");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const response = await adminBlogService.generateContent(title + " " + subTitle);
      if (response.data?.content) {
        if (quillRef.current) {
          quillRef.current.root.innerHTML = response.data.content;
        }
        setDescription(response.data.content);
      }
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto"
    >
      <div className="bg-white w-full max-w-2xl p-4 md:p-8 sm:m-8 shadow rounded">
        {error && (
          <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

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

        <p className="mt-4 mb-2">Blog Description</p>

        <div className="w-full max-w-lg relative">
          <div ref={editorRef} className="bg-white"></div>

          <button
            type="button"
            onClick={generateContent}
            disabled={generating}
            className="mt-3 text-xs text-white bg-black/70 px-4 py-2 rounded hover:bg-black/80 cursor-pointer disabled:opacity-50"
          >
            {generating ? "Generating..." : "Generate with AI"}
          </button>
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name || cat._id}>
              {cat.name}
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
          disabled={loading}
          className="mt-8 w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm disabled:opacity-60"
        >
          {loading ? "Saving..." : isEditMode ? "Update Blog" : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
