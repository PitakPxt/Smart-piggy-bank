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
          className=" bg-neutral-white-100 rounded-3xl overflow-hidden shadow-lg relative
        xl:w-[756px] xl:h-[742px] 
        lg:w-[684px] lg:h-[628px]
        md:w-[708px] md:h-[684px]
        sm:w-[344px] sm:h-[504px]
        "
        >
          <Link to="/unlock-pin">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              onSubmit={handleSubmit}
              className="xl:w-[512px] xl:h-[524px] md:w-[512px] md:h-[520px] sm:w-[292px] sm:h-[388px] flex flex-col items-center"
            >
              <img
                className="xl:size-[228px] md:size-[228px] sm:size-[180px] md:mb-[18px] sm:mb-[8px]"
                src={LogoForgetPin}
                alt=""
              />
              <h2 className="md:text-h2-bold sm:text-h3-bold md:mb-[52px] sm:mb-[32px]">
                Smart Piggy Bank
              </h2>

              <div className="w-full mb-10">
                {/* <p className="text-h3-bold mb-2">รหัสผ่านเข้าสู่ระบบ</p> */}
                <InputLabel
                  text="รหัสผ่านเข้าสู่ระบบ"
                  className="w-full"
                  type="password"
                  placeHolder="กรอกรหัสผ่านเข้าสู่ระบบ"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <BtnYellow
                type="submit"
                className="md:px-[132px] sm:px-[92px]"
                text="ถัดไป"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
