import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function PaymentScreen() {
  const { caseId, username } = useParams();
  const [caseDetails, setCaseDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_URL;
  useEffect(() => {
    const fetchCaseDetails = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}:8000/case-deatails/${username}/${caseId}` // Fixed the typo here
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

  const handlePayment = async () => {
    if (caseDetails) {
      const { lawyerassigned, paymentamount, user_id } = caseDetails;

      try {
        // Fetch sender's wallet ID
        const senderResponse = await axios.get(
          `${apiUrl}:8000/user-details/${user_id}`
        );
        const senderWalletId = senderResponse.data.rows[0].walletid;

        // Fetch receiver's (lawyer's) wallet ID
        const receiverResponse = await axios.get(
          `${apiUrl}:8000/user-details/${lawyerassigned}`
        );
        const receiverWalletId = receiverResponse.data.rows[0].walletid;

        // Now you can use the wallet IDs to make the payment
        const response = await axios.post(`${apiUrl}:8000/transfer`, {
          senderWalletId, // Updated key to match the backend (walletId)
          receiverWalletId, // Updated key to match the backend (walletId)
          amount: paymentamount,
          caseId: caseId, // Include caseId for transaction logic
        });

        if (response.data.success) {
          alert("Payment successful!");
        } else {
          alert("Payment failed: " + response.data.message);
        }
      } catch (error) {
        alert(
          "Error processing payment: " +
            (error.response ? error.response.data.message : error.message)
        );
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
        Payment Screen
      </h2>
      <div className="mb-4">
        <p className="text-lg font-medium text-gray-700">
          <strong>Lawyer:</strong> {caseDetails.lawyerassigned}
        </p>
        <p className="text-lg font-medium text-gray-700">
          <strong>Amount:</strong> ${caseDetails.paymentamount}
        </p>
      </div>
      <button
        onClick={handlePayment}
        className="w-full py-2 px-4 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none transition"
      >
        Pay Lawyer
      </button>
    </div>
  );
}

export default PaymentScreen;
