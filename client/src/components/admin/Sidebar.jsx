import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { PERMISSIONS } from "../../constants/rbac";
import { canAccessAny, getCurrentUser } from "../../utils/permission";

const Sidebar = () => {
  const currentUser = getCurrentUser();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: assets.home_icon,
      end: true,
      permissions: [],
    },
    {
      name: "Add Blogs",
      path: "/admin/addBlog",
      icon: assets.add_icon,
      permissions: [PERMISSIONS.CREATE_POST],
    },
    {
      name: "Blog Lists",
      path: "/admin/listBlog",
      icon: assets.list_icon,
      permissions: [
        PERMISSIONS.UPDATE_POST,
        PERMISSIONS.DELETE_POST,
        PERMISSIONS.CHANGE_POST_STATUS,
      ],
    },
    {
      name: "Comments",
      path: "/admin/comments",
      icon: assets.comment_icon,
      permissions: [PERMISSIONS.DELETE_COMMENT],
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: assets.category_icon || assets.list_icon,
      permissions: [
        PERMISSIONS.CREATE_CATEGORY,
        PERMISSIONS.UPDATE_CATEGORY,
        PERMISSIONS.DELETE_CATEGORY,
      ],
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: assets.user_icon,
      permissions: [PERMISSIONS.UPDATE_USER, PERMISSIONS.DELETE_USER],
    },
    {
      name: "Accounts Admin",
      path: "/admin/accountadmin",
      icon: assets.user_icon,
      permissions: [PERMISSIONS.MANAGE_ADMIN],
    },
    {
      name: "Roles & Permissions",
      path: "/admin/permissions",
      icon: assets.list_icon,
      permissions: [PERMISSIONS.MANAGE_ADMIN],
    },
  ];

  const visibleMenuItems = menuItems.filter((item) =>
    canAccessAny(currentUser, item.permissions),
  );

  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
      <NavLink
        end={true}
        to="/admin"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.home_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Dashboard</p>
      </NavLink>
      <NavLink
        to="/admin/addBlog"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.add_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Add Blogs</p>
      </NavLink>
      <NavLink
        to="/admin/listBlog"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.list_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Blog lists</p>
      </NavLink>
      <NavLink
        to="/admin/comments"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.comment_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Comments</p>
      </NavLink>
      <NavLink
        to="/admin/categories"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.category_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Categories</p>
      </NavLink>
      <NavLink
        to="/admin/users"
        className={({ isActive }) =>
          `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${isActive && "bg-primary/10 border-r-4 border-primary"}`
        }
      >
        <img src={assets.user_icon} alt="" className="min w-4 w-5" />
        <p className="hidden md:inline-block">Users</p>
      </NavLink>
    </div>
  );
};

export default Sidebar;
