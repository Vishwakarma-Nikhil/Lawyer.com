import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/authSlice";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    // Dispatch the logout action to clear the Redux state
    dispatch(logout());

    // Clear the user data from localStorage
    localStorage.removeItem("userData");
  };

  return (
    <button
      className="inline-block px-6 py-2 duration-200 hover:bg-blue-100 rounded-full text-white"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;
