import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice.js";

// Validation Schema
const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

function LoginScreen() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    // Trim the username and password values
    const trimmedValues = {
      username: values.username.trim(),
      password: values.password.trim(),
    };

    setLoading(true);
    setError("");
    const apiUrl = import.meta.env.VITE_APP_URL;
    console.log(apiUrl);
    try {
      const response = await Axios.post(`${apiUrl}:8000/login`, trimmedValues);

      const userData = response.data.user;
      if (userData) {
        dispatch(authLogin({ userData })); // Dispatch the user data to Redux
      }

      console.log("Login successful:", userData);
      navigate("/"); // Redirect to home page after successful login
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Login failed. Please check your username and password.";
      setError(errorMessage);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-500 via-gray-500 to-white">
      <div className="bg-white p-12 rounded-lg shadow-2xl w-full max-w-md">
        {/* User Login */}
        <div className="flex flex-col justify-center items-center p-8 bg-gradient-to-tl from-gray-800 to-gray-700 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Welcome Back!
          </h2>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ touched, errors }) => (
              <Form className="w-full">
                <div className="mb-6">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Username
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className={`mt-2 p-4 w-full border ${
                      touched.username && errors.username
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter your username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className={`mt-2 p-4 w-full border ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-gray-600"
                    } rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-full py-4 px-6 bg-indigo-600 text-white rounded-md shadow-lg text-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <p className="mt-4 text-center text-base text-gray-300">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-400 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;
