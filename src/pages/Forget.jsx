import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import LogoUnlockPinSucces from "../assets/images/logo-pic-forget.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../lib/firebase";

export default function Forget() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForget = async (e) => {
    e.preventDefault();
    db.collection("email-user").doc(email).get();
  };
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     toast.success("ส่งอีเมล์สำเร็จ");
  //     const uid = user.uid;
  //   } else {
  //     toast.error("อีเมล์นี้ยังไม่ได้ลงทะเบียน");
  //     return;
  //   }
  // });

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[856px] h-[742px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <Link to="/login">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              onSubmit={handleForget}
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
                autoComplete="on"
              />
              <BtnYellow type="submit" className={"px-[164px]"} text="ยืนยัน" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
