import React, { useState, useEffect, useRef, useCallback } from "react";
import { assets } from "../../assets/assets";
import { useSearchParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../services/admin.api";
import QuillEditor from "../../components/QuillEditor";

const AddBlog = () => {
  const [editorKey, setEditorKey] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const blogId = searchParams.get("id");
  const isEditMode = !!blogId;

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await adminApi.getCategories();
      setCategories(data.result || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  }, []);

  const fetchBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBlogById(id);
      const blog = data.result;

      if (blog) {
        setTitle(blog.title || "");
        setSubTitle(blog.subtitle || "");
        setCategoryId(blog.category_id || "");
        setIsPublished(blog.isPublished || false);
        setDescription(blog.description || "");

        if (blog.image) {
          setImagePreview(blog.image);
          setImage(null);
        }
      } else {
        setError("Blog not found");
      }
    } catch (err) {
      console.error("Failed to fetch blog:", err);
      setError(err.message || "Failed to load blog");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDescriptionChange = useCallback((content) => {
    setDescription(content);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (isEditMode && blogId) {
      fetchBlogById(blogId);
    }
  }, [isEditMode, blogId, fetchBlogById]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      setSubmitting(false);
      return;
    }

    if (!categoryId) {
      setError("Category is required");
      setSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (subTitle.trim()) {
        formData.append("subtitle", subTitle.trim());
      }
      if (description) {
        formData.append("description", description);
      }
      formData.append("category_id", categoryId);
      if (image) {
        formData.append("image", image);
      }
      formData.append("isPublished", isPublished ? "true" : "false");

      if (isEditMode) {
        await adminApi.updateBlog(blogId, formData);
        alert("Blog updated successfully!");
      } else {
        await adminApi.createBlog(formData);
        alert("Blog created successfully!");
      }

      navigate("/admin/listBlog");
    } catch (err) {
      console.error("Failed to save blog:", err);
      setError(err.message || `Failed to ${isEditMode ? "update" : "create"} blog`);
    } finally {
      setSubmitting(false);
    }
  };

  const generateContent = async () => {
    if (!title.trim()) {
      setError("Please enter a title first before generating content with AI");
      return;
    }

    setAiGenerating(true);
    setError(null);

    try {
      const prompt = `Write a blog post about: "${title}". ${subTitle ? `Subtitle: "${subTitle}".` : ""} Write content that is engaging and informative.`;
      const data = await adminApi.generateBlogContent(prompt);

      if (data.result) {
        setDescription(data.result);
      }
    } catch (err) {
      console.error("Failed to generate content:", err);
      setError(err.message || "Failed to generate content with AI");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find((c) => c._id === catId);
    return cat ? cat.name : catId;
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-y-auto"
    >
      <div className="bg-white w-full max-w-2xl p-4 md:p-8 sm:m-8 shadow rounded">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {isEditMode ? "Edit Blog" : "Add New Blog"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <p className="font-medium mb-2">Upload thumbnail</p>
            <label htmlFor="image" className="cursor-pointer block">
              <img
                src={imagePreview || assets.upload_area}
                alt=""
                className="mt-2 h-14 rounded object-cover"
              />
              <input
                onChange={handleImageChange}
                type="file"
                id="image"
                accept="image/*"
                hidden
              />
            </label>
            {imagePreview && image && (
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                Remove image
              </button>
            )}

            <p className="mt-4 font-medium">Blog Title *</p>
            <input
              type="text"
              placeholder="Type here..."
              required
              className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded focus:border-primary"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />

            <p className="mt-4 font-medium">Sub Title</p>
            <input
              type="text"
              placeholder="Type here..."
              className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded focus:border-primary"
              onChange={(e) => setSubTitle(e.target.value)}
              value={subTitle}
            />

            <p className="mt-4 font-medium">Blog Description</p>
            <div className="w-full max-w-lg relative">
              <QuillEditor
                key={editorKey}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Write blog description here..."
              />

              <button
                type="button"
                onClick={generateContent}
                disabled={aiGenerating}
                className="mt-3 text-xs text-white bg-black/70 px-4 py-2 rounded hover:bg-black/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {aiGenerating ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></span>
                    Generating...
                  </>
                ) : (
                  "Generate with AI"
                )}
              </button>
            </div>

            <p className="mt-4 font-medium">Blog Category *</p>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              name="category"
              required
              className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded focus:border-primary bg-white w-full max-w-lg"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <div className="flex gap-2 mt-4 items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                className="scale-125 cursor-pointer"
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              <label htmlFor="isPublished" className="cursor-pointer">
                Publish Now
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/admin/listBlog")}
                className="w-40 h-10 border border-gray-300 text-gray-600 rounded cursor-pointer text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-40 h-10 bg-primary text-white rounded cursor-pointer text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    Saving...
                  </>
                ) : isEditMode ? (
                  "Update Blog"
                ) : (
                  "Add Blog"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </form>
  );
};

export default AddBlog;
