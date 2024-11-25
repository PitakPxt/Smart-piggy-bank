import React, { useState, useEffect } from "react";
import BtnBack from "../components/BtnBack";
import EditProfile from "../assets/images/edit-porfile.svg";
import BtnYellow from "../components/BtnYellow";
import DefaultProfile from "@images/default-Profile.svg";
import { useUserAuth } from "../context/AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import LogoutModal from "../components/modals/LogoutMadal";
import ChangeProfileModal from "../components/modals/ChangeProfileModal";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      const userDoc = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(
        userDoc,
        (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        },
        (error) => {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [user]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleCloseModal = () => {
    setShowLogoutModal(false);
  };

  const handleConfirmLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserDataState = (newData) => {
    setUserData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="xl:w-[768px] xl:h-[754px] lg:w-[756px] lg:h-[680px] md:w-[680px] md:h-[590px] sm:w-[340px] sm:h-[516px] flex flex-col justify-center items-center bg-neutral-white-100 rounded-3xl overflow-hidden shadow-main-shadow relative">
          <Link to="/home">
            <BtnBack />
          </Link>
          <div
            className="absolute xl:top-[42px] xl:right-[42px] md:top-[42px] md:right-[42px] sm:top-[24px] sm:right-[24px] cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img
              className="sm:size-[16px] md:size-[24px] "
              src={EditProfile}
              alt="edit-profile"
            />
          </div>
          <div className="flex flex-col items-center justify-center text-center ">
            <h2 className="md:text-h2-bold sm:text-h3-bold xl:mb-[36px] md:mb-[24px] sm:mb-[8px]">
              โปรไฟล์
            </h2>
            <div className="flex flex-col items-center justify-center xl:mb-[52px] md:mb-[28px] sm:mb-[24px]">
              <img
                className="xl:size-[276px] lg:size-[276px] md:size-[216px] sm:size-[186px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2     xl:mb-[28px] md:mb-[20px] sm:mb-[18px]"
                src={userData?.profileImageURL || DefaultProfile}
                alt="โปรไฟล์"
              />
              <div className="flex flex-col gap-2">
                <h1 className="xl:text-h1-bold md:text-h2-bold sm:text-h3-bold">
                  {userData?.name || "Name"}
                </h1>
                <h2 className="xl:text-h3-bold md:text-h4-bold sm:text-h4-bold">
                  รหัสกระปุก : {userData?.savingNumber || "00XXX"}
                </h2>
                <h2 className="text-h3 sm:text-h4">
                  {userData?.phone
                    ? userData.phone.replace(
                        /(\d{3})(\d{3})(\d{4})/,
                        "$1-$2-$3"
                      )
                    : "099-XXX-XXXX"}
                </h2>
                <h2 className="text-h3 sm:text-h4">
                  {userData?.email || "xxxxxx@gmail.com"}
                </h2>
              </div>
            </div>
            <BtnYellow
              className={"xl:px-[192px] md:px-[160px] sm:px-[90px]"}
              text="ออกจากระบบ"
              onClick={handleLogoutClick}
            />
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onCancel={handleCloseModal}
          onConfirm={handleConfirmLogout}
        />
      )}
      {showModal && (
        <ChangeProfileModal
          onClose={() => setShowModal(false)}
          onUpdate={updateUserDataState} // ส่ง function ไปยัง Modal
        />
      )}
    </>
  );
}
