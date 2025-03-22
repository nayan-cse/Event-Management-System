"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Navbar = ({ role }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.push("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="text-xl font-bold text-white">
              Eventify
            </Link>
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/s"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items (Desktop) */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {role === "admin" && (
              <>
                <Link
                  href="/admin/dashboard"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Manage Users
                </Link>
                <Link
                  href="/admin/events"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Manage Events
                </Link>
              </>
            )}

            {role === "organizer" && (
              <>
                <Link
                  href="/organizer/dashboard"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/organizer/events"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  My Events
                </Link>
                <Link
                  href="/organizer/create-event"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Create Event
                </Link>
              </>
            )}

            {role === "attendee" && (
              <>
                <Link
                  href="/attendee/dashboard"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/attendee/events"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Events
                </Link>
                <Link
                  href="/attendee/profile"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
              </>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white bg-red-600 hover:bg-red-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu (Collapsible) */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {role === "admin" && (
                <>
                  <Link
                    href="/admin/dashboard"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/users"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Manage Users
                  </Link>
                  <Link
                    href="/admin/events"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Manage Events
                  </Link>
                </>
              )}

              {role === "organizer" && (
                <>
                  <Link
                    href="/organizer/dashboard"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/organizer/events"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    My Events
                  </Link>
                  <Link
                    href="/organizer/create-event"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Create Event
                  </Link>
                </>
              )}

              {role === "attendee" && (
                <>
                  <Link
                    href="/attendee/dashboard"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/attendee/events"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Events
                  </Link>
                  <Link
                    href="/attendee/profile"
                    className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Profile
                  </Link>
                </>
              )}

              {/* Logout Button (Mobile) */}
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
