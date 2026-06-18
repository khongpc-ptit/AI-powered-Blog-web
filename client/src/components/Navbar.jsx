import React from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        onClick={() => navigate("/")}
        src={assets.ptitblog_logo}
        alt="Logo"
        className="w-32 sm:w-44 cursor-pointer"
      />

      {user ? (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="hidden sm:flex items-center gap-2 text-sm px-6 py-2 border border-primary/30 text-primary rounded-full cursor-pointer hover:bg-primary/5 transition-all"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : null}
            <span className={user.avatar ? "pl-1" : ""}>
              {user.name || "Profile"}
            </span>
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-8 py-2.5"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/register")}
            className="text-sm px-6 sm:px-8 py-2.5 border border-primary/30 text-primary rounded-full cursor-pointer hover:bg-primary/5 transition-all"
          >
            Register
          </button>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-8 sm:px-10 py-2.5"
          >
            Login
            <img src={assets.arrow} className="w-3" alt="arrow" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
