import React from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Moment from "moment";
import { useState } from "react";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import { blogService } from "../services/api";

const Blog = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    setLoading(true);
    try {
      const response = await blogService.getById(id);
      const blog = response.data.data || response.data;
      setData(blog);
    } catch (error) {
      console.error("Error fetching blog data:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await blogService.getComments(id);
      const data = response.data.data?.comments || response.data.data || [];
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
  };

  const addComment = async (e) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      alert("Please enter your name and comment.");
      return;
    }

    try {
      await blogService.addComment(id, { name, content });
      setName("");
      setContent("");
      // Refresh comments
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

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
          <h2 className="my-5 max--w-lg truncate mx-auto">{data.subTitle}</h2>
          <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
            S.PTIT Team
          </p>
        </div>
        <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
          {data.image && <img src={data.image} alt="" className="rounded-3xl mb-5" />}
          <div
            className="rich-text max-w-3xl mx-auto"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
        {/*comment section*/}
        <div className="mt-14 mb-10 max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Comments ({comments.length})</p>
          <div className="flex flex-col gap-4">
            {comments.length > 0 ? (
              comments.map((item, index) => (
                <div
                  key={item._id || index}
                  className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={assets.user_icon} alt="" className="w-6" />
                    <p className="font-medium">{item.name}</p>
                  </div>
                  <p className="text-sm max-w-md ml-8">{item.content}</p>
                  <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                    {Moment(item.createdAt).fromNow()}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
        {/*add comment form*/}
        <div className="max-w-3xl mx-auto">
          <p className="font-semibold mb-4">Add your comment</p>
          <form
            onSubmit={addComment}
            className="flex flex-col items-start gap-4 max-w-lg"
          >
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Your name"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none"
            />
            <textarea
              onChange={(e) => setContent(e.target.value)}
              value={content}
              placeholder="Your comment"
              required
              className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            ></textarea>
            <button
              type="submit"
              className="bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer"
            >
              Submit Comment
            </button>
          </form>
        </div>
        {/*share buttons*/}
        <div className="my-24 max-w-3xl mx-auto">
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
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Blog not found.</p>
    </div>
  );
};

export default Blog;
