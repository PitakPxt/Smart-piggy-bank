import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import NotFoundModal from "./modals/NotFoundModal";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useUserAuth();
  if (!loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <NotFoundModal
          src={"/lottie/loading.lottie"}
          text="กำลังโหลดข้อมูล..."
          showBackButton={false}
          className="md:h-[220px] sm:h-[120px]"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
}
