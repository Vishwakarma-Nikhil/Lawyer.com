import { useEffect, useState } from "react";
import Axios from "axios";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import AnimatedForms from "./components/Animatedform";
import { Outlet } from "react-router-dom";
import { Footer } from "./components/index.js";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice.js";
import { useNavigate } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_APP_URL;

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");

    if (storedUserData) {
      dispatch(login({ userData: JSON.parse(storedUserData) })); // Dispatch to Redux if user data exists
      navigate("/");
    }
  }, [dispatch, navigate]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await Axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      console.log("Login successful:", response.data);
      // Add additional success handling here (e.g., redirect or save token)
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
    <div>
      {/* <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form> */}

      {/* <div>
        <LoginPage />
      </div> */}
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
