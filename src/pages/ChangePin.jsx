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
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-[756px] bg-neutral-white-100 rounded-[32px] overflow-hidden drop-shadow-lg p-16">
        <div className="w-full flex flex-col items-center">
          <div className="mb-16">
            <Logo />
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-[500px] gap-12"
          >
            <div className="flex flex-col gap-8">
              <InputPin
                textPin="กรุณากรอก PIN ใหม่ :"
                onChange={handlePinChange}
              />
              <InputPin
                textPin="กรุณายืนยัน PIN :"
                onChange={handleConfirmPinChange}
              />
            </div>
            <BtnYellow
              type="submit"
              className="w-full rounded-[16px] py-4 text-xl font-bold"
              text="เปลี่ยนรหัสผ่าน"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
