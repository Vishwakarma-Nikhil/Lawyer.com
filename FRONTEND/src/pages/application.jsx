import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"; // Import Link for navigation

function Application() {
  const apiUrl = import.meta.env.VITE_APP_URL;
  const data = useSelector((state) => state.auth.userData);
  const lawyerId = data?.user_id;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clientNames, setClientNames] = useState({}); // Store client names by user_id

  // Fetch the requests for the lawyer
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}:8000/get-requests/${lawyerId}`
        );
        setRequests(response.data);

        // After requests are fetched, fetch client details for each request
        response.data.forEach(async (request) => {
          await fetchClientName(request.user_id); // Fetch client name by user_id
        });
      } catch (error) {
        setError("Error fetching requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [lawyerId]);

  // Fetch client name by user_id
  const fetchClientName = async (clientId) => {
    try {
      const response = await axios.get(
        `${apiUrl}:8000/user-details/${clientId}`
      );
      setClientNames((prevNames) => ({
        ...prevNames,
        [clientId]: response.data.rows[0]?.username,
      }));
    } catch (error) {
      console.error("Error fetching client name:", error);
    }
  };

  // Handle accepting or rejecting a request
  const handleUpdateStatus = async (applicationId, status) => {
    try {
      await axios.post(`${apiUrl}:8000/update-request-status`, {
        applicationId,
        status,
      });

      // Update the local state to reflect the change
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.application_id === applicationId
            ? { ...request, status }
            : request
        )
      );
    } catch (error) {
      setError("Error updating status.");
    }
  };

  return (
    <div className="w-full h-lvh ">
      <div className="max-w-5xl mx-auto p-6 mt-10 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Received Requests
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : requests.length > 0 ? (
          <ul className="space-y-6">
            {requests.map((request) => (
              <li
                key={request.application_id}
                className="p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md"
              >
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>Case ID:</strong> {request.caseid}
                  </p>
                  <p className="text-lg">
                    <strong>Client Name:</strong>{" "}
                    {clientNames[request?.user_id] || "Loading..."}
                  </p>
                  <p className="text-lg">
                    <strong>Status:</strong> {request.status}
                  </p>
                </div>

                {/* Wrap each request item with a Link to the details page */}
                <Link
                  to={`/case-details/${data.username}/${request.caseid}`}
                  className="block mt-4 text-blue-500 hover:text-blue-700 transition duration-200"
                >
                  View Details
                </Link>

                {request.status === "pending" && (
                  <div className="flex mt-4 space-x-3">
                    <button
                      onClick={() =>
                        handleUpdateStatus(request.application_id, "accepted")
                      }
                      className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-200"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(request.application_id, "rejected")
                      }
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 mt-10">
            No pending requests found.
          </p>
        )}
      </div>
    </div>
  );
}

export default Application;
