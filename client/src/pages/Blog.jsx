import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "moment";
import { assets } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { blogApi } from "../services/blog.api";

// Validate MongoDB ObjectId (24 character hex string)
const isValidObjectId = (id) => {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
};

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch blog detail
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!isValidObjectId(id)) {
        setError("Invalid blog ID");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await blogApi.getBlogById(id);
        setBlog(data.result);
      } catch (err) {
        console.error("Failed to fetch blog:", err);
        setError(err.message || "Blog not found");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlogData();
    }
  }, [id]);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!isValidObjectId(id)) return;
      setCommentsLoading(true);
      try {
        const data = await blogApi.getComments(id);
        setComments(data.result || []);
      } catch (err) {
        console.error("Failed to fetch comments:", err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    if (id) {
      fetchComments();
    }
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/blogs/${id}`)}`);
      return;
    }

    if (!content.trim()) {
      setError("Nội dung bình luận không được để trống.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await blogApi.addComment(id, content.trim());
      setComments((prev) => [data.result, ...prev]);
      setContent("");
      setMessage("Bình luận của bạn đã được ghi nhận.");
    } catch (err) {
      if (err.errors && err.errors.content) {
        setError(err.errors.content.msg);
      } else {
        setError(err.message || "Không thể thêm bình luận. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen">
          <Loader />
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div>
        <div className="relative">
          <img
            src={assets.gradientBackground}
            alt=""
            className="absolute -top-50 -z-1 opacity-50"
          />
          <Navbar />
          <div className="text-center mt-40">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Blog not found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary/90"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <img
          src={assets.gradientBackground}
          alt=""
          className="absolute -top-50 -z-1 opacity-50"
        />
        <Navbar />

        <div className="text-center mt-20 text-gray-600">
          <p className="text-primary py-4 font-medium">
            Published on {Moment(blog.created_at).format("MMMM Do YYYY")}
          </p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
            {blog.title}
          </h1>
          {blog.subTitle && (
            <h2 className="my-5 max-w-lg truncate mx-auto">{blog.subTitle}</h2>
          )}
          {blog.category && (
            <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
              {blog.category}
            </p>
          )}
        </div>

        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          {blog.image && (
            <img src={blog.image} alt={blog.title} className="rounded-3xl mb-5" />
          )}
          <div
            className="rich-text max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: blog.content || blog.description }}
          />
        </div>

        {blog.views && (
          <div className="text-center text-gray-500 text-sm mb-8">
            {blog.views} views
          </div>
        )}

        {/* comment section */}
        <div className="mt-14 mb-10 max-w-3xl mx-5 md:mx-auto">
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-semibold">Comments ({comments.length})</p>
            {!isAuthenticated && (
              <Link
                to={`/login?redirect=${encodeURIComponent(`/blogs/${id}`)}`}
                className="text-sm text-primary hover:underline"
              >
                Login to comment
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {commentsLoading ? (
              <div className="text-center py-8">
                <Loader />
              </div>
            ) : comments.length > 0 ? (
              comments.map((item) => (
                <div
                  key={item._id}
                  className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {item.name ? item.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <p className="text-sm max-w-md ml-8">{item.content}</p>
                  <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs text-gray-400">
                    {Moment(item.created_at).fromNow()}
                  </div>
                </div>
              ))
            ) : (
              <div className="max-w-xl rounded-lg border border-primary/10 bg-white p-5 text-sm text-gray-500 shadow-sm">
                There are no comments yet. Be the first to leave a comment on
                this post.
              </div>
            )}
          </div>
        </div>

        {/* add comment form */}
        <div className="max-w-3xl mx-5 md:mx-auto">
          <div className="max-w-lg rounded-2xl border border-primary/15 bg-white p-5 shadow shadow-primary/5">
            <p className="font-semibold mb-2">Add your comment</p>
            {message && (
              <p className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-600">
                {message}
              </p>
            )}
            {error && (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            {isAuthenticated ? (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  Commenting as{" "}
                  <span className="font-medium text-primary">{user.name}</span>
                </p>
                <form
                  onSubmit={handleAddComment}
                  className="flex flex-col items-start gap-4"
                >
                  <textarea
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    placeholder="Write your comment..."
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none h-36 focus:border-primary"
                  ></textarea>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary text-white rounded-lg p-2.5 px-8 hover:scale-102 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Comment"}
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-5 text-gray-600">
                <p className="mb-4 text-sm">
                  You need to log in to your user account to add a comment under
                  the post.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        `/login?redirect=${encodeURIComponent(`/blogs/${id}`)}`,
                      )
                    }
                    className="rounded-full bg-primary px-6 py-2.5 text-sm text-white cursor-pointer hover:bg-primary/90 transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="rounded-full border border-primary/30 px-6 py-2.5 text-sm text-primary cursor-pointer hover:bg-primary/5 transition-all"
                  >
                    Register
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* share buttons */}
        <div className="my-24 max-w-3xl mx-5 md:mx-auto">
          <p className="font-semibold my-4">
            Share this article on social media
          </p>
          <div className="flex">
            <img src={assets.facebook_icon} alt="Facebook" width={50} />
            <img src={assets.twitter_icon} alt="Twitter" width={50} />
            <img src={assets.googleplus_icon} alt="Google+" width={50} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
