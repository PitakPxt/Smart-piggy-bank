import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import NotFoundModal from "./modals/NotFoundModal";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useUserAuth();
  if (loading) {
    return (
      <NotFoundModal
        src={"/lottie/loading.lottie"}
        text="กำลังโหลดข้อมูล..."
        showBackButton={false}
      />
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
