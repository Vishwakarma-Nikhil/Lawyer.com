import React from "react";
import { Logo, LogoutBtn } from "../index";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header() {
  const data = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();

  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "Add Case",
      slug: "/add-case",
      active: !data?.islawyer && authStatus,
    },
    {
      name: "Requests",
      slug: "/requests",
      active: data?.islawyer,
    },
    {
      name: "Accepted Cases",
      slug: "/accepted-cases",
      active: data?.islawyer,
    },
  ];

  return (
    <header className="bg-gradient-to-r from-gray-600 to-gray-800 shadow-lg sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center">
          <Link to="/">
            <Logo width="80px" />
          </Link>
          <div className="text-white text-2xl font-bold ml-4">Lawyer.com</div>
        </div>
        <ul className="flex space-x-6 items-center">
          {navItems.map(
            (item) =>
              item.active && (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className="text-white font-medium py-2 px-4 rounded-full transition duration-300 transform  hover:bg-blue-100 hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
                  >
                    {item.name ? item.name : null}
                  </button>
                </li>
              )
          )}
          {authStatus && (
            <li>
              <LogoutBtn />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
