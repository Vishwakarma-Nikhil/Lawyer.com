import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

// // Validation schema
// const validationSchema = Yup.object({
//   username: Yup.string().required("Username is required"),
//   password: Yup.string().required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
//   islawyer: Yup.string().required("User type is required"), // New field for islawyer
//   typeOfLawyer: Yup.string().when("islawyer", {
//     is: "lawyer",
//     then: Yup.string().required("Type of Lawyer is required"),
//     otherwise: Yup.string().notRequired(),
//   }),
//   casesWon: Yup.number().when("islawyer", {
//     is: "lawyer",
//     then: Yup.number().required("Cases Won is required"),
//     otherwise: Yup.number().notRequired(),
//   }),
//   casesLost: Yup.number().when("islawyer", {
//     is: "lawyer",
//     then: Yup.number().required("Cases Lost is required"),
//     otherwise: Yup.number().notRequired(),
//   }),
//   court: Yup.string().when("islawyer", {
//     is: "lawyer",
//     then: Yup.string().required("Court is required"),
//     otherwise: Yup.string().notRequired(),
//   }),
//   description: Yup.string().when("islawyer", {
//     is: "lawyer",
//     then: Yup.string().required("Description is required"),
//     otherwise: Yup.string().notRequired(),
//   }),
//   dob: Yup.date().when("islawyer", {
//     is: "lawyer",
//     then: Yup.date().required("Date of Birth is required"),
//     otherwise: Yup.date().notRequired(),
//   }),
// });

function Signup() {
  const [userType, setUserType] = useState("client");
  const [message, setMessage] = useState("");

  const handleSignup = async (values) => {
    try {
      let additionalFields = null; // Use `let` to allow reassignment
      if (userType === "lawyer") {
        additionalFields = {
          type_of_lawyer: values.typeOfLawyer,
          cases_won: values.casesWon,
          cases_lost: values.casesLost,
          court: values.court,
          description: values.description,
          dob: values.dob,
        };
      }

      // Conditionally include additionalFields in userData only if it's not null
      const userData = {
        username: values.username,
        password: values.password,
        islawyer: userType === "lawyer" ? 1 : 0,
        ...(additionalFields && { additionalFields }), // Spread only if additionalFields is truthy
      };

      console.log(userData); // Check the structure of the user data being sent
      const response = await axios.post(`${apiUrl}:8000/signup`, userData);

      setMessage(
        `Signup successful! Wallet ID: ${response.data.user.walletid}`
      );
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#d4d4d4]">
      <div className="bg-white p-12 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-center space-x-4 mb-8">
          {/* Select User Type */}
          <button
            onClick={() => setUserType("client")}
            className={`w-1/2 p-2 rounded-t-md ${
              userType === "client" ? "bg-gray-600 text-white" : "bg-gray-200"
            }`}
          >
            Client
          </button>
          <button
            onClick={() => setUserType("lawyer")}
            className={`w-1/2 p-2 rounded-t-md ${
              userType === "lawyer" ? "bg-gray-600 text-white" : "bg-gray-200"
            }`}
          >
            Lawyer
          </button>
        </div>

        <h2 className="text-3xl font-semibold text-center mb-8">Sign Up</h2>

        {/* Formik Form */}
        <Formik
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
            islawyer: userType,
            typeOfLawyer: "",
            casesWon: 0,
            casesLost: 0,
            court: "",
            description: "",
            dob: "",
          }}
          onSubmit={handleSignup}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <div className="space-y-6">
                {/* Username */}
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Username
                  </label>
                  <Field
                    id="username"
                    name="username"
                    className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter your username"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                    placeholder="Confirm your password"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Lawyer-specific Fields */}
                {userType === "lawyer" && (
                  <>
                    <div>
                      <label
                        htmlFor="typeOfLawyer"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Type of Lawyer
                      </label>
                      <Field
                        id="typeOfLawyer"
                        name="typeOfLawyer"
                        className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                        placeholder="Enter your specialty"
                      />
                      <ErrorMessage
                        name="typeOfLawyer"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="casesWon"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cases Won
                        </label>
                        <Field
                          type="number"
                          id="casesWon"
                          name="casesWon"
                          className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                          placeholder="Enter number of cases won"
                        />
                        <ErrorMessage
                          name="casesWon"
                          component="div"
                          className="text-red-500 text-sm mt-2"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="casesLost"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Cases Lost
                        </label>
                        <Field
                          type="number"
                          id="casesLost"
                          name="casesLost"
                          className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                          placeholder="Enter number of cases lost"
                        />
                        <ErrorMessage
                          name="casesLost"
                          component="div"
                          className="text-red-500 text-sm mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="court"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Court
                      </label>
                      <Field
                        id="court"
                        type="text"
                        name="court"
                        className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                        placeholder="Enter the court name"
                      />
                      <ErrorMessage
                        name="court"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <Field
                        as="textarea"
                        id="description"
                        name="description"
                        className="mt-2 p-
                        4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                        placeholder="Enter a description"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="dob"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date of Birth
                      </label>
                      <Field
                        type="date"
                        id="dob"
                        name="dob"
                        className="mt-2 p-4 w-full border rounded-md focus:ring-2 focus:ring-gray-500"
                      />
                      <ErrorMessage
                        name="dob"
                        component="div"
                        className="text-red-500 text-sm mt-2"
                      />
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full mt-6 p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Sign Up
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Message */}
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default Signup;
