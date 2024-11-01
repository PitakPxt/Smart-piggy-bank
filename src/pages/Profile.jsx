import React, { useState, useEffect } from "react";
import BtnBack from "../components/BtnBack";
import Whawha from "../assets/images/whawha.jpg";
import EditProfile from "../assets/images/edit-porfile.png";
import BtnYellow from "../components/BtnYellow";
import DefaultProfile from "@images/default-Profile.svg";
import { useUserAuth } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const userDoc = doc(db, "users", user.uid);
        try {
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    try {
      logOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[768px] h-[754px] flex flex-col justify-center items-center
    bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <Link to="/home">
            <BtnBack />
          </Link>
          <div className="absolute top-[42px] right-[42px]">
            <img src={EditProfile} alt="edit-profile" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-h2-bold mb-[36px]">โปรไฟล์</h2>
            <div className="flex flex-col items-center justify-center mb-[52px]">
              <img
                className="size-[276px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2 mb-[28px]"
                src={userData?.profileImageURL || DefaultProfile}
                alt="โปรไฟล์"
              />
              <div className="flex flex-col gap-3">
                <h1 className="text-h1-bold">{userData?.name || "Name"}</h1>
                <h2 className="text-h2">{userData?.phone || "099XXXXXXX"}</h2>
                <h2 className="text-h2">
                  {userData?.email || "xxxxxx@gmail.com"}
                </h2>
              </div>
            </div>
            <BtnYellow
              className={"px-[192px]"}
              text="ออกจากระบบ"
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>
    </>
  );
}
