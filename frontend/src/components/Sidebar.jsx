import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, FolderKanban, Users, User } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/workspaces", label: "Workspaces", icon: <FolderKanban size={20} /> },
    { path: "/boards", label: "Boards", icon: <Users size={20} /> },
    { path: "/profile", label: "Profile", icon: <User size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#1E1E1E] text-gray-300 flex flex-col border-r border-gray-700">
      {/* --- Header --- */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-teal-400 text-center tracking-wide">
          MindCanvas
        </h1>
      </div>

      {/* --- Nav Links --- */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-teal-500 text-white shadow-md"
                      : "hover:bg-gray-800 hover:text-teal-400"
                  }`
                }
              >
                {link.icon}
                <span className="font-medium">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* --- Footer / Logout --- */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gray-800 hover:bg-red-500 hover:text-white transition-all duration-200 font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;