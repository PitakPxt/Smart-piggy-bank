import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import InputPin from "../components/InputPin";
import Logo from "../components/Logo";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";

export default function ChangePin() {
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const navigate = useNavigate();
  const { user } = useUserAuth();

  const handlePinChange = (pin) => {
    setNewPin(pin);
  };

  const handleConfirmPinChange = (pin) => {
    setConfirmPin(pin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ากรอก PIN ครบทั้ง 6 หลักหรือไม่
    if (newPin.length !== 6 || confirmPin.length !== 6) {
      toast.error("กรุณากรอก PIN 6 หลัก");
      return;
    }

    // ตรวจสอบว่า PIN ที่กรอกตรงกันทั้ง 2 ครั้ง
    if (newPin !== confirmPin) {
      toast.error("PIN ไม่ตรงกัน กรุณากรอกใหม่");
      return;
    }

    try {
      // อัพเดท PIN ใน Firestore
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        pin: newPin,
      });

      toast.success("เปลี่ยน PIN สำเร็จ");
      navigate("/unlock-pin");
    } catch (error) {
      console.error("Error:", error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="bg-neutral-white-100 rounded-[32px] overflow-hidden shadow-main-shadow justify-center items-center
      xl:w-[756px] xl:h-[740px]
      lg:w-[642px] lg:h-[626px]
      md:w-[676px] md:h-[612px]
      sm:w-[344px] sm:h-[426px]"
        >
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              className="size-full xl:w-[512px] xl:h-[524px] md:w-[512px] sm:w-[300px] flex flex-col justify-center items-center"
              onSubmit={handleSubmit}
            >
              <Logo className="md:mb-[34px] sm:mb-[16px]" />
              <div className="flex flex-col md:gap-8 sm:gap-[4px]">
                <InputPin
                  textPin="กรุณากรอก PIN ใหม่ :"
                  onChange={handlePinChange}
                />
                <InputPin
                  className="md:mb-[38px] sm:mb-[34px]"
                  textPin="กรุณายืนยัน PIN :"
                  onChange={handleConfirmPinChange}
                />
              </div>
              <BtnYellow
                type="submit"
                className="md:px-[146px] sm:px-[48px]"
                text="เปลี่ยนรหัสผ่าน"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
