import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CaseDetails = () => {
  const apiUrl = import.meta.env.VITE_APP_URL;
  const { caseId, username } = useParams();
  const navigate = useNavigate();

  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmClose, setShowConfirmClose] = useState(false);
  const [lawyer, setLawyerDetails] = useState("Not Assigned");

  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}:8000/case-deatails/${username}/${caseId}`
        );
        setCaseDetails(response.data);
      } catch (error) {
        setError("Error fetching case details");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId, username]);

  useEffect(() => {
    const fetchLawyerDetails = async () => {
      if (caseDetails?.lawyerassigned) {
        try {
          const response = await axios.get(
            `${apiUrl}:8000/user-details/${caseDetails.lawyerassigned}`
          );
          setLawyerDetails(response.data.rows[0]?.username);
        } catch (error) {
          console.error("Error fetching lawyer details:", error);
        }
      }
    };

    if (caseDetails) {
      fetchLawyerDetails();
    }
  }, [caseDetails]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  const handleAddLawyer = () =>
    navigate(`/case-details/${username}/${caseId}/add-lawyer`);
  const handlePayLawyer = () =>
    navigate(`/case-details/${username}/${caseId}/payment`);

  const handleCloseCase = async () => {
    const confirmClose = window.confirm(
      "Are you sure you want to close this case?"
    );
    if (confirmClose) {
      try {
        await axios.post(`${apiUrl}:8000/close-case/${caseId}`);
        navigate(`/accepted-cases`);
      } catch (error) {
        alert("Error closing the case.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {caseDetails.casename}
        </h2>

        <div className="space-y-8">
          {/* Case Information */}
          <div className="p-6 bg-blue-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Case Information
            </h3>
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              <p>
                <strong>Status:</strong> {caseDetails.casestatus}
              </p>
              <p>
                <strong>Amount:</strong> ${caseDetails.paymentamount}
              </p>
              <p className="col-span-2">
                <strong>Description:</strong> {caseDetails.casedescription}
              </p>
              <p className="col-span-2">
                <strong>Court:</strong> {caseDetails.court}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-6 bg-green-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-2 gap-6 text-gray-700">
              <p>
                <strong>Lawyer Assigned:</strong> {lawyer}
              </p>
              <p>
                <strong>Transaction ID:</strong>{" "}
                {caseDetails.transactionid || "Not Paid"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-10 space-x-4">
          {caseDetails.lawyerassigned === null &&
            caseDetails.casestatus !== "closed" && (
              <button
                onClick={handleAddLawyer}
                className="px-6 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600"
              >
                Assign Lawyer
              </button>
            )}

          {caseDetails.lawyerassigned &&
            caseDetails.casestatus === "closed" && (
              <button
                onClick={handlePayLawyer}
                className="px-6 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600"
              >
                Pay Lawyer
              </button>
            )}

          {caseDetails.lawyerassigned &&
            caseDetails.casestatus !== "closed" && (
              <button
                onClick={() => setShowConfirmClose(true)}
                className="px-6 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600"
              >
                Close Case
              </button>
            )}
        </div>

        {/* Confirmation Modal for Closing Case */}
        {showConfirmClose && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className="text-xl font-semibold mb-6">
                Are you sure you want to close the case?
              </h3>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleCloseCase}
                  className="px-6 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600"
                >
                  Yes, Close Case
                </button>
                <button
                  onClick={() => setShowConfirmClose(false)}
                  className="px-6 py-2 bg-gray-500 text-white rounded-full shadow hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
