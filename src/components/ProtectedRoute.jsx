import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useUserAuth();
  if (!user) {
    console.log(user);
    return <Navigate to="/" />;
  }
  return children;
}
