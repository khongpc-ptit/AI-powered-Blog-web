import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Moment from "moment";
import { blog_data, assets, comments_data } from "../assets/assets";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const getCommentStorageKey = (blogId) => `ptitblog_comments_${blogId}`;

const readLocalComments = (blogId) => {
  try {
    const value = localStorage.getItem(getCommentStorageKey(blogId));
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error("Cannot read comments from localStorage", error);
    return [];
  }
};

const writeLocalComments = (blogId, comments) => {
  localStorage.setItem(getCommentStorageKey(blogId), JSON.stringify(comments));
};

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const fetchBlogData = async () => {
    const blog = blog_data.find((item) => item._id === id);
    setData(blog);
  };

  const fetchComments = async () => {
    const mockComments = comments_data.filter((comment) => {
      if (!comment.blog) return true;
      if (typeof comment.blog === "string") return comment.blog === id;
      return comment.blog?._id === id;
    });

    const localComments = readLocalComments(id);
    setComments([...localComments, ...mockComments]);
  };

  const addComment = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/blogs/${id}`)}`);
      return;
    }

    const newComment = {
      _id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      blog: id,
      name: user.name,
      email: user.email,
      content: content.trim(),
      isApproved: false,
      createdAt: new Date().toISOString(),
    };

    const localComments = readLocalComments(id);
    const nextLocalComments = [newComment, ...localComments];
    writeLocalComments(id, nextLocalComments);

    setComments((prev) => [newComment, ...prev]);
    setContent("");
    setMessage("Bình luận của bạn đã được ghi nhận và đang chờ duyệt.");
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  return data ? (
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
            Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
          </p>
          <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
            {data.title}
          </h1>
          <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>
          <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
            S.PTIT Team
          </p>
        </div>

        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          <img src={data.image} alt="" className="rounded-3xl mb-5" />
          <div
            className="rich-text max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>

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
            {comments.length > 0 ? (
              comments.map((item) => (
                <div
                  key={item._id || `${item.name}-${item.createdAt}`}
                  className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={assets.user_icon} alt="" className="w-6" />
                    <p className="font-medium">{item.name}</p>
                    {item.isApproved === false && (
                      <span className="text-[11px] border border-orange-200 bg-orange-50 text-orange-600 rounded-full px-2 py-0.5">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-sm max-w-md ml-8">{item.content}</p>
                  <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                    {Moment(item.createdAt).fromNow()}
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

            {isAuthenticated ? (
              <>
                <p className="mb-4 text-sm text-gray-500">
                  Commenting as{" "}
                  <span className="font-medium text-primary">{user.name}</span>
                </p>
                <form
                  onSubmit={addComment}
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
                    className="bg-primary text-white rounded-lg p-2.5 px-8 hover:scale-102 transition-all cursor-pointer"
                  >
                    Submit Comment
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
            <img src={assets.facebook_icon} alt="" width={50} />
            <img src={assets.twitter_icon} alt="" width={50} />
            <img src={assets.googleplus_icon} alt="" width={50} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  ) : (
    <Loader />
  );
};

export default Blog;
