import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import LogoForgetPin from "../assets/images/logo-pic-forgetPin.svg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ForgetPin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ดึงข้อมูล user จาก Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      // เช็คว่า password ตรงกับที่เก็บใน Firestore หรือไม่
      if (password === userData.password) {
        toast.success("ยืนยันตัวตนสำเร็จ");
        navigate("/change-pin"); // นำทางไปหน้าเปลี่ยน PIN
      } else {
        toast.error("รหัสผ่านไม่ถูกต้อง");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className=" bg-neutral-white-100 rounded-3xl overflow-hidden shadow-lg
        w-[756px] h-[742px] 
        "
        >
          <Link to="/unlock-pin">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="w-[512px] h-[524px] flex flex-col items-center"
            >
              <img
                className="size-[228px] mb-[18px]"
                src={LogoForgetPin}
                alt=""
              />
              <h2 className="text-h2-bold mb-[56px]">Smart Piggy Bank</h2>

              <div className="w-full mb-10">
                <p className="text-h3-bold mb-2">รหัสผ่านเข้าสู่ระบบ</p>
                <InputLabel
                  className="w-full"
                  type="password"
                  placeHolder="กรอกรหัสผ่านเข้าสู่ระบบ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <BtnYellow type="submit" className="px-[132px]" text="ถัดไป" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
