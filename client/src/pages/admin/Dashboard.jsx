import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import BlogTableItem from "../../components/admin/BlogTableItem";
import { dashboardService } from "../../services/admin.service";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    blogs: 0,
    comments: 0,
    drafts: 0,
    users: 0,
    recentBlogs: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getStats();
      if (response.data) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-10 bg-blue-50/50">
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_1} alt="" />
          <div>
            <p>{loading ? "..." : dashboardData.blogs}</p>
            <p className="text-gray-400 font-light">Blogs</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_2} alt="" />
          <div>
            <p>{loading ? "..." : dashboardData.comments}</p>
            <p className="text-gray-400 font-light">Comments</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.dashboard_icon_3} alt="" />
          <div>
            <p>{loading ? "..." : dashboardData.drafts}</p>
            <p className="text-gray-400 font-light">Drafts</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 min-w-58 rounded shadow cursor-pointer hover:scale-105 transition-all">
          <img src={assets.user_icon} alt="" className="w-8 h-8" />
          <div>
            <p>{loading ? "..." : dashboardData.users}</p>
            <p className="text-gray-400 font-light">Users</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 m-4 mt-6 text-gray-600">
          <img src={assets.dashboard_icon_4} alt="" />
          <p>Latest Blogs</p>
        </div>
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : dashboardData.recentBlogs && dashboardData.recentBlogs.length > 0 ? (
                dashboardData.recentBlogs.map((blog, index) => (
                  <BlogTableItem
                    key={blog._id}
                    blog={blog}
                    fetchBlogs={fetchDashboardData}
                    index={index + 1}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No blogs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
