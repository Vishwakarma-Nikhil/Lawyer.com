import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import AuthLayout from "./components/AuthLayout.jsx";
import { Provider } from "react-redux";
import Login from "../src/pages/Login.jsx";
import Signup from "../src/pages/Signup.jsx";
import Addcase from "./pages/addcase.jsx";
import Home from "./pages/Home.jsx";
import CaseDetails from "./pages/casedetails.jsx";
import Addlawyer from "./pages/addlawyer.jsx";
import Application from "./pages/application.jsx";
import AcceptedCases from "./pages/AcceptedCases.jsx";
import PaymentScreen from "./pages/PaymentScreen.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/add-case",
        element: (
          <AuthLayout authentication>
            <Addcase />
          </AuthLayout>
        ),
      },
      {
        path: "/case-details/:username/:caseId",
        element: (
          <AuthLayout authentication>
            <CaseDetails />
          </AuthLayout>
        ),
      },
      {
        path: "/case-details/:username/:caseId/payment",
        element: (
          <AuthLayout authentication>
            <PaymentScreen />
          </AuthLayout>
        ),
      },
      {
        path: "/case-details/:username/:caseId/add-lawyer",
        element: (
          <AuthLayout authentication>
            <Addlawyer />
          </AuthLayout>
        ),
      },
      {
        path: "/requests",
        element: (
          <AuthLayout authentication>
            <Application />
          </AuthLayout>
        ),
      },
      {
        path: "/accepted-cases",
        element: (
          <AuthLayout authentication>
            <AcceptedCases />
          </AuthLayout>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
