import React, { useState } from "react";

const AnimatedForms = () => {
  const [activeForm, setActiveForm] = useState("login");

  return (
    <section className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl mb-8">Animated Forms</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setActiveForm("login")}
          className={`px-4 py-2 transition-transform duration-300 ${
            activeForm === "login"
              ? "text-green-500 transform translate-x-2"
              : "text-gray-400"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveForm("signup")}
          className={`px-4 py-2 transition-transform duration-300 ${
            activeForm === "signup"
              ? "text-green-500 transform -translate-x-2"
              : "text-gray-400"
          }`}
        >
          Sign Up
        </button>
      </div>
      <div className="relative w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        {activeForm === "login" ? (
          <form className="transition-transform duration-300 transform">
            <fieldset>
              <legend className="sr-only">Login Form</legend>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="block mb-1 text-sm text-gray-300"
                >
                  E-mail
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full px-4 py-2 text-gray-900 rounded border border-gray-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="login-password"
                  className="block mb-1 text-sm text-gray-300"
                >
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  required
                  className="w-full px-4 py-2 text-gray-900 rounded border border-gray-500 focus:outline-none"
                />
              </div>
            </fieldset>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300"
            >
              Login
            </button>
          </form>
        ) : (
          <form className="transition-transform duration-300 transform">
            <fieldset>
              <legend className="sr-only">Signup Form</legend>
              <div className="mb-4">
                <label
                  htmlFor="signup-email"
                  className="block mb-1 text-sm text-gray-300"
                >
                  E-mail
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="w-full px-4 py-2 text-gray-900 rounded border border-gray-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="signup-password"
                  className="block mb-1 text-sm text-gray-300"
                >
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  className="w-full px-4 py-2 text-gray-900 rounded border border-gray-500 focus:outline-none"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="signup-password-confirm"
                  className="block mb-1 text-sm text-gray-300"
                >
                  Confirm Password
                </label>
                <input
                  id="signup-password-confirm"
                  type="password"
                  required
                  className="w-full px-4 py-2 text-gray-900 rounded border border-gray-500 focus:outline-none"
                />
              </div>
            </fieldset>
            <button
              type="submit"
              className="w-full py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-600 transition duration-300"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AnimatedForms;
