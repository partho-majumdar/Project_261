import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = ({ open, setOpen, userRole }) => {
  const location = useLocation();

  const getNavigationItems = () => {
    switch (userRole) {
      case "Student":
        return [
          { name: "Home", path: "/student", icon: "home" },
          {
            name: "Submit Proposal",
            path: "/student/submit-proposal",
            icon: "document",
          },
          {
            name: "Upload Files",
            path: "/student/upload-files",
            icon: "upload",
          },
          { name: "Supervisor", path: "/student/supervisor", icon: "user" },
          { name: "Feedback", path: "/student/feedback", icon: "chat" },
          {
            name: "Notifications",
            path: "/student/notifications",
            icon: "bell",
          },
        ];
      case "Teacher":
        return [
          { name: "Home", path: "/teacher", icon: "home" },
          {
            name: "Pending Requests",
            path: "/teacher/pending-requests",
            icon: "clock",
          },
          {
            name: "Assigned Students",
            path: "/teacher/assigned-students",
            icon: "users",
          },
          { name: "Files", path: "/teacher/files", icon: "folder" },
        ];
      case "Admin":
        return [
          { name: "Home", path: "/admin", icon: "home" },
          { name: "Manage Students", path: "/admin/students", icon: "users" },
          {
            name: "Manage Teachers",
            path: "/admin/teachers",
            icon: "academic",
          },
          {
            name: "Assign Supervisor",
            path: "/admin/assign-supervisor",
            icon: "link",
          },
          { name: "Deadlines", path: "/admin/deadlines", icon: "calendar" },
          { name: "Projects", path: "/admin/projects", icon: "folder" },
        ];
      default:
        return [];
    }
  };

  const getIcon = (iconName, isActive = false) => {
    const className = `w-5 h-5 ${
      isActive ? "text-blue-600" : "text-slate-600"
    }`;

    switch (iconName) {
      case "home":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        );
      case "document":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
      case "upload":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        );
      case "user":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "chat":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        );
      case "bell":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5-5-5h5zm-5-8a3 3 0 11-6 0 3 3 0 016 0zm6.5 0c0-4.418-4.03-8-9-8s-9 3.582-9 8c0 1.5.5 2.91 1.34 4.06L3 20l3.72-1.395c1.15.84 2.56 1.34 4.06 1.34z"
            />
          </svg>
        );
      case "clock":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "users":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      case "folder":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        );
      case "check":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "academic":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
          </svg>
        );
      case "link":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        );
      default:
        return (
          <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7h16z"
            />
          </svg>
        );
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed -left-full lg:left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 transition-all duration-300 z-30 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-4 border-blue-500"
                        : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                    }
                  `}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      setOpen(false);
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    {getIcon(item.icon, isActive)}
                  </div>
                  <span
                    className={`ml-3 font-medium transition-opacity duration-300 ${
                      open ? "opacity-100" : "opacity-0 lg:opacity-0"
                    } ${open ? "block" : "hidden lg:hidden"}`}
                  >
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-slate-200">
            <div
              className={`transition-opacity duration-300 ${
                open ? "opacity-100" : "opacity-0 lg:opacity-0"
              } ${open ? "block" : "hidden lg:hidden"}`}
            >
              <p className="text-xs text-slate-500 text-center">
                Educational Project Management v1.0
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {/* <div className={`fixed inset-0 bg-white z-40 lg:hidden transition-transform duration-300 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}> */}
      {/* <div className="flex flex-col h-full pt-16"> */}
      {/* Mobile navigation */}
      {/* <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
                    }
                  `}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex-shrink-0">
                    {getIcon(item.icon, isActive)}
                  </div>
                  <span className="ml-3 font-medium">
                    {item.name}
                  </span>
                </NavLink>
              );
            })}
          </nav> */}

      {/* Mobile footer */}
      {/* <div className="p-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Educational Project Management v1.0
            </p>
          </div> */}
      {/* </div> */}
      {/* </div> */}

      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setOpen(false)} // click backdrop to close
        ></div>
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          {/* Mobile navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
              flex items-center px-4 py-3 rounded-lg transition-all duration-200
              ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
              }
            `}
                  onClick={() => setOpen(false)}
                >
                  <div className="flex-shrink-0">
                    {getIcon(item.icon, isActive)}
                  </div>
                  <span className="ml-3 font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile footer */}
          <div className="p-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Educational Project Management v1.0
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
