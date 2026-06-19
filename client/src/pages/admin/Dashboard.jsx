import React, { useEffect, useState, useCallback } from "react";
import { assets } from "../../assets/assets";
import { adminApi } from "../../services/admin.api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    published_blogs_count: 0,
    draft_blogs_count: 0,
    total_comments: 0,
    latest_blogs: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getDashboardStats();
      setDashboardData({
        published_blogs_count: data.result.published_blogs_count || 0,
        draft_blogs_count: data.result.draft_blogs_count || 0,
        total_comments: data.result.total_comments || 0,
        latest_blogs: data.result.latest_blogs || [],
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleBlogClick = (blogId) => {
    navigate(`/admin/addBlog?id=${blogId}`);
  };

  const handlePublishToggle = async (blog, e) => {
    e.stopPropagation();
    try {
      await adminApi.toggleBlogPublish(blog._id);
      fetchDashboardData();
    } catch (err) {
      console.error("Failed to toggle publish:", err);
      alert(err.message || "Failed to toggle publish status");
    }
  };

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {error}
          <button
            onClick={fetchDashboardData}
            className="ml-4 text-sm underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p className="text-xl font-bold text-gray-800">
              {dashboardData.published_blogs_count + dashboardData.draft_blogs_count}
            </p>
            <p className="text-gray-400 font-light text-sm">Total Blogs</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p className="text-xl font-bold text-gray-800">
              {dashboardData.total_comments}
            </p>
            <p className="text-gray-400 font-light text-sm">Comments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p className="text-xl font-bold text-gray-800">
              {dashboardData.draft_blogs_count}
            </p>
            <p className="text-gray-400 font-light text-sm">Drafts</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Latest Blogs</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : dashboardData.latest_blogs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
            No blogs found.
          </div>
        ) : (
          <div className="relative max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
            <table className="w-full text-sm text-gray-500">
              <thead className="text-xs text-gray-600 text-left uppercase">
                <tr>
                  <th scope="col" className="px-2 py-4 px-6">
                    #
                  </th>
                  <th scope="col" className="px-2 py-4">
                    Blog Title
                  </th>
                  <th scope="col" className="px-2 py-4 max-sm:hidden">
                    Date
                  </th>
                  <th scope="col" className="px-2 py-4 max-sm:hidden">
                    Status
                  </th>
                  <th scope="col" className="px-2 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.latest_blogs.map((blog, index) => {
                  const blogDate = new Date(blog.created_at);
                  return (
                    <tr
                      key={blog._id}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleBlogClick(blog._id)}
                    >
                      <td className="px-2 py-4 px-6 text-gray-400">
                        {index + 1}
                      </td>
                      <td className="px-2 py-4">
                        <div className="max-w-xs truncate font-medium text-gray-800" title={blog.title}>
                          {blog.title}
                        </div>
                      </td>
                      <td className="px-2 py-4 max-sm:hidden text-gray-600">
                        {blogDate.toLocaleDateString()}
                      </td>
                      <td className="px-2 py-4 max-sm:hidden">
                        <span
                          className={`${
                            blog.isPublished ? "text-green-600" : "text-orange-700"
                          }`}
                        >
                          {blog.isPublished ? "Published" : "Unpublished"}
                        </span>
                      </td>
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={(e) => handlePublishToggle(blog, e)}
                            className="border px-2 py-0.5 text-xs rounded cursor-pointer hover:bg-gray-100 transition-colors"
                          >
                            {blog.isPublished ? "Unpublish" : "Publish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
