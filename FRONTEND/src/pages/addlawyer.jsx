import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AddLawyer() {
  const apiUrl = import.meta.env.VITE_APP_URL;
  const data = useSelector((state) => state.auth.userData);
  const user_id = data?.user_id;
  const { username, caseId } = useParams(); // Get username and caseId from the URL
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await axios.get(`${apiUrl}:8000/get-lawyers`);
        setLawyers(response.data);
      } catch (error) {
        setError("Error fetching lawyers");
      } finally {
        setLoading(false);
      }
    };

    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}:8000/check-pending-requests/${caseId}`
        );
        setPendingRequests(response.data);
      } catch (error) {
        setError("Error fetching pending requests");
      }
    };

    fetchLawyers();
    fetchPendingRequests();
  }, [caseId]);

  const handleSendRequest = async (lawyerId) => {
    try {
      setSendingRequest(true);
      setRequestError(null);

      const response = await axios.post(`${apiUrl}:8000/request-lawyer`, {
        caseId,
        user_id,
        lawyerId,
        status: "pending",
      });

      if (response.status === 200) {
        setPendingRequests((prev) => [
          ...prev,
          { lawyer_id: lawyerId, status: "pending" },
        ]);
      }
    } catch (error) {
      setRequestError("Error sending request.");
    } finally {
      setSendingRequest(false);
    }
  };

  const handleDeleteRequest = async (lawyerId) => {
    try {
      setRequestError(null);

      // Confirm caseId and user_id are accessible or defined in this scope
      const response = await axios.delete(
        `${apiUrl}:8000/delete-request/${caseId}/${lawyerId}/${user_id}`
      );

      if (response.status === 200) {
        setPendingRequests((prev) =>
          prev.filter((request) => request.lawyer_id !== lawyerId)
        );
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      setRequestError("Error deleting request.");
    }
  };

  const isRequestPending = (lawyerId) => {
    return pendingRequests.some((request) => request.lawyer_id === lawyerId);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Request a Lawyer
      </h2>
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <ul className="space-y-4">
          {lawyers.map((lawyer) => (
            <li
              key={lawyer.user_id}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
            >
              <p className="text-lg font-medium text-gray-800">
                {lawyer.username}
              </p>
              <div className="space-x-2">
                {isRequestPending(lawyer.user_id) ? (
                  <button
                    onClick={() => handleDeleteRequest(lawyer.user_id)}
                    className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                  >
                    Delete Request
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(lawyer.user_id)}
                    className={`px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 ${
                      sendingRequest ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={sendingRequest}
                  >
                    {sendingRequest ? "Sending..." : "Send Request"}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {requestError && (
        <div className="mt-4 text-center text-red-500">{requestError}</div>
      )}
    </div>
  );
}

export default AddLawyer;
