import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import CasesList from "../components/CasesList";

const Home = () => {
  const data = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const [userCases, setUserCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_APP_URL;
  useEffect(() => {
    if (authStatus) {
      const fetchCases = async () => {
        try {
          const response = await axios.get(
            `${apiUrl}:8000/user-cases/${data.user_id}`
          );
          setUserCases(response.data.cases);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setError("No cases found for this account.");
          } else {
            setError("Error fetching cases");
          }
        } finally {
          setLoading(false);
        }
      };

      fetchCases();
    }
  }, [authStatus, data?.user_id]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-200">
      {authStatus ? (
        <div className="w-full  bg-gray-200 p-8 rounded-lg shadow-lg mx-4">
          <div className="text-3xl font-semibold text-black mb-6 text-center">
            Welcome, {data.username}
          </div>
          {loading ? (
            <div className="text-gray-600 text-center">Loading cases...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <CasesList cases={userCases} />
          )}
        </div>
      ) : (
        <div className="text-gray-700 text-center mt-10">
          Please log in to view your cases.
        </div>
      )}
    </div>
  );
};

export default Home;
