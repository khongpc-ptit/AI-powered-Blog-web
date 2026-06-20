import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets";
import { PERMISSIONS } from "../../constants/rbac";
import { canAccessAny } from "../../utils/permission";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useAuth();

  const localUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const isAdmin = localStorage.getItem("isAdmin");

  const currentUser = user || localUser;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: assets.home_icon,
      end: true,
      permissions: [PERMISSIONS.VIEW_DASHBOARD],
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
        PERMISSIONS.VIEW_POST,
        PERMISSIONS.UPDATE_POST,
        PERMISSIONS.DELETE_POST,
        PERMISSIONS.CHANGE_POST_STATUS,
      ],
    },
    {
      name: "Comments",
      path: "/admin/comments",
      icon: assets.comment_icon,
      permissions: [
        PERMISSIONS.VIEW_COMMENT,
        PERMISSIONS.UPDATE_COMMENT,
        PERMISSIONS.DELETE_COMMENT,
      ],
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
      name: "Permission-Role",
      path: "/admin/permissions",
      icon: assets.list_icon,
      permissions: [PERMISSIONS.MANAGE_PERMISSION],
    },
  ];

  const userWithRole = currentUser
    ? {
        ...currentUser,
        role: currentUser.role || currentUser.role_id,
      }
    : null;

  const visibleMenuItems =
    isAdmin === "true"
      ? menuItems
      : menuItems.filter((item) =>
          canAccessAny(userWithRole, item.permissions),
        );

  return (
    <div className="flex flex-col border-r border-gray-200 min-h-full pt-6">
      {visibleMenuItems.map((item) => (
        <NavLink
          key={item.path}
          end={item.end}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer ${
              isActive ? "bg-primary/10 border-r-4 border-primary" : ""
            }`
          }
        >
          <img src={item.icon} alt="" className="min-w-4 w-5" />
          <p className="hidden md:inline-block">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
