import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import LogoUnlockPinSucces from "../assets/images/logo-pic-forget.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, sendSignInLinkToEmail } from "firebase/auth";

export default function Forget() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const fetchEmail = async (e) => {
    e.preventDefault();

    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("กรุณากรอกอีเมลให้ถูกต้อง");
        return;
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        toast.error("ไม่พบอีเมลนี้ในระบบ");
        return;
      }

      const userId = querySnapshot.docs[0].id;
      const auth = getAuth();
      const actionCodeSettings = {
        url: `${window.location.origin}/reset-password?userId=${userId}`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      window.localStorage.setItem("resetUserId", userId);
      toast.success("กรุณาตรวจสอบลิงก์ยืนยันในอีเมลของคุณ");
    } catch (error) {
      console.error("Firebase error:", error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className=" bg-neutral-white-100 rounded-3xl overflow-hidden shadow-lg relative
        xl:w-[756px] xl:h-[742px]
         md:w-[624px] md:h-[640px]
        sm:w-[344px] sm:h-[504px]
        "
        >
          <Link to="/">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form onSubmit={fetchEmail} className="flex flex-col items-center">
              <img
                className="xl:size-[228px] md:size-[228px] sm:size-[170px] xl:mb-[18px] md:mb-[18px] sm:mb-[8px] "
                src={LogoUnlockPinSucces}
                alt=""
              />
              <h2 className="md:text-h2-bold sm:text-h3-bold md:mb-[24px] sm:mb-[12px]">
                Smart Piggy Bank
              </h2>
              <div className="xl:w-[512px] md:w-[492px] sm:w-[292px] md:mb-[42px] sm:mb-[34px]">
                <InputLabel
                  className={"mb-[42px] w-full"}
                  text="อีเมล์"
                  name="email"
                  placeHolder="กรอกอีเมล์"
                  value={email}
                  isEye={false}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  textLabelClassName="xl:text-h3-bold md:text-h3-bold sm:text-h5-bold"
                />
              </div>
              <BtnYellow
                type="submit"
                className={"md:px-[164px] sm:px-[92px]"}
                text="ยืนยัน"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
