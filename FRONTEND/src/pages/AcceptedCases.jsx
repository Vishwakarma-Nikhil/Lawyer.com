import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

function AcceptedCases() {
  const apiUrl = import.meta.env.VITE_APP_URL;
  const data = useSelector((state) => state.auth.userData);
  const lawyerId = data?.user_id;
  const [acceptedCases, setAcceptedCases] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    if (!lawyerId) return; // Ensure lawyerId is present

    const fetchAcceptedCases = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous error if any
        const response = await axios.get(
          `${apiUrl}:8000/accepted-cases/${lawyerId}`
        );
        setAcceptedCases(response.data);
      } catch (error) {
        setError("Error fetching accepted cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedCases();
  }, [lawyerId]);

  const handleCaseClick = (caseId) => {
    // Navigate to the case details page
    const username = data.username;
    navigate(`/case-details/${username}/${caseId}`);
  };

  const handleAddLawyer = (caseId, event) => {
    event.stopPropagation(); // Prevent navigation to case details
    const username = data.username;
    navigate(`/case-details/${username}/${caseId}/add-lawyer`);
  };

  if (loading)
    return (
      <p className="text-center text-lg text-gray-500">
        Loading accepted cases...
      </p>
    );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Accepted Cases
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {acceptedCases.length > 0 ? (
        <ul className="space-y-6">
          {acceptedCases.map((caseItem) => (
            <li
              key={caseItem.caseid}
              onClick={() => handleCaseClick(caseItem.caseid)}
              className={`cursor-pointer p-5 border rounded-lg shadow-sm transition duration-200 transform hover:shadow-lg hover:scale-105 ${
                caseItem.casestatus === "Pending"
                  ? "border-gray-300 bg-gray-50 hover:bg-gray-200"
                  : "border-green-300 bg-green-100 hover:bg-green-200"
              }`}
            >
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {caseItem.casename}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {caseItem.casestatus}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Amount:</strong> ${caseItem.paymentamount}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Description:</strong> {caseItem.casedescription}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Court Type:</strong> {caseItem.court}
                </p>
              </div>

              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleCaseClick(caseItem.caseid)}
                  className="px-4 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  View Details
                </button>
                {!caseItem.lawyerassigned && (
                  <button
                    onClick={(event) => handleAddLawyer(caseItem.caseid, event)}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Lawyer
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No accepted cases found.</p>
      )}
    </div>
  );
}

export default AcceptedCases;
