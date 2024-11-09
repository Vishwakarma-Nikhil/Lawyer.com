import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";

// Validation schema for the form
const validationSchema = Yup.object({
  caseName: Yup.string().required("Case name is required"),
  amount: Yup.number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  caseDescription: Yup.string().required("Case description is required"),
  caseType: Yup.string().required("Case type is required"),
  court: Yup.string().required("Court is required"),
});

function AddCase() {
  const apiUrl = import.meta.env.VITE_APP_URL;
  const data = useSelector((state) => state.auth.userData);
  const [message, setMessage] = useState("");
  console.log(data);
  const handleSubmit = async (values) => {
    try {
      // Prepare the case data to send to the backend
      const caseData = {
        caseName: values.caseName,
        amount: values.amount,
        user_id: data.user_id,
        caseDescription: values.caseDescription,
        caseType: values.caseType,
        court: values.court,
      };

      console.log(caseData); // For testing the data

      // Send the data to the backend
      const response = await axios.post(`${apiUrl}:8000/add-case`, caseData);

      setMessage("Case added successfully!");

      // Optionally handle the response here (e.g., reset the form)
    } catch (error) {
      setMessage(
        "Failed to add case: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Add Case</h2>

        {/* Formik Form */}
        <Formik
          initialValues={{
            caseName: "",
            amount: "",
            caseDescription: "",
            caseType: "",
            court: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="space-y-4">
                {/* Case Name */}
                <div>
                  <label
                    htmlFor="caseName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Case Name
                  </label>
                  <Field
                    id="caseName"
                    name="caseName"
                    className="mt-2 p-4 w-full border rounded-md"
                    placeholder="Enter case name"
                  />
                  <ErrorMessage
                    name="caseName"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Case Description */}
                <div>
                  <label
                    htmlFor="caseDescription"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Case Description
                  </label>
                  <Field
                    id="caseDescription"
                    name="caseDescription"
                    as="textarea"
                    className="mt-2 p-4 w-full border rounded-md"
                    placeholder="Describe the case"
                  />
                  <ErrorMessage
                    name="caseDescription"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Case Type */}
                <div>
                  <label
                    htmlFor="caseType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Case Type
                  </label>
                  <Field
                    id="caseType"
                    name="caseType"
                    className="mt-2 p-4 w-full border rounded-md"
                    placeholder="Enter case type"
                  />
                  <ErrorMessage
                    name="caseType"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Court */}
                <div>
                  <label
                    htmlFor="court"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Court
                  </label>
                  <Field
                    id="court"
                    name="court"
                    className="mt-2 p-4 w-full border rounded-md"
                    placeholder="Enter court name"
                  />
                  <ErrorMessage
                    name="court"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>
                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Amount
                  </label>
                  <Field
                    id="amount"
                    name="amount"
                    type="number"
                    className="mt-2 p-4 w-full border rounded-md"
                    placeholder="Enter case amount"
                  />
                  <ErrorMessage
                    name="amount"
                    component="div"
                    className="text-red-500 text-sm mt-2"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full p-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                  Add Case
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Displaying response message */}
        {message && <p className="text-center text-red-500 mt-4">{message}</p>}
      </div>
    </div>
  );
}

export default AddCase;
