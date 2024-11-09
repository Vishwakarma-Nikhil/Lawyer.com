import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const CasesList = ({ cases }) => {
   const apiUrl = import.meta.env.VITE_APP_URL;
  const data = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  // Navigate to case details page
  const handleViewDetails = (caseId) => {
    navigate(`/case-details/${data.username}/${caseId}`);
  };

  // Navigate to add lawyer page
  const handleAddLawyer = (caseId, event) => {
    event.stopPropagation(); // Prevent navigation to case details
    navigate(`/case-details/${data.username}/${caseId}/add-lawyer`);
  };

  return (
    <div className="p-6 bg-gray-200 rounded-lg shadow-md w-full mx-auto">
      {cases.length > 0 ? (
        <ul className="space-y-4">
          {cases.map((caseItem) => (
            <li
              key={caseItem.caseid}
              onClick={() => handleViewDetails(caseItem.caseid)}
              className={`cursor-pointer p-5 border rounded-lg shadow-sm transition duration-200 transform hover:shadow-lg hover:scale-105 ${
                caseItem.casestatus === "Pending"
                  ? "border-red-300 bg-red-100 hover:bg-red-200"
                  : "border-green-300 bg-green-100 hover:bg-green-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
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
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => handleViewDetails(caseItem.caseid)}
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
        <p className="text-gray-600 text-center">No cases found.</p>
      )}
    </div>
  );
};

export default CasesList;
