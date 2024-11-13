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

      const auth = getAuth();
      const actionCodeSettings = {
        url: `${window.location.origin}/changepasslog`,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      toast.success("กรุณาตรวจสอบลิงก์ยืนยันในอีเมลของคุณ");
    } catch (error) {
      console.error("Firebase error:", error);
      toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[756px] h-[742px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <Link to="/">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              onSubmit={fetchEmail}
              className="w-[512px] h-[524px] flex flex-col items-center"
            >
              <img
                className="size-[228px] mb-[18px]"
                src={LogoUnlockPinSucces}
                alt=""
              />
              <h2 className="text-h2-bold mb-[56px]">Smart Piggy Bank</h2>

              <InputLabel
                className={"mb-[42px] w-full"}
                text="อีเมล์"
                placeHolder="กรอกอีเมล์"
                value={email}
                isEye={false}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <BtnYellow type="submit" className={"px-[164px]"} text="ยืนยัน" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
