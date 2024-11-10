import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import InputPin from "../components/InputPin";
import LogoPicUnlockPin from "../assets/images/logo-pic-unlockPin.png";
import BtnYellow from "../components/BtnYellow";
import BtnBack from "../components/BtnBack";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function UnlockPin() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userPin, setUserPin] = useState(null);
  const [newPin, setNewPin] = useState("");

  const isFromLogin = location.state?.fromLogin || false;

  useEffect(() => {
    const checkPin = async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      setUserPin(userData.pin);
    };
    checkPin();
  }, [user.uid]);

  const handlePinChange = (pin) => {
    setNewPin(pin);
  };

  const handleSubmit = async () => {
    if (newPin.length !== 6) {
      toast.error("กรุณากรอก PIN ให้ครบ 6 หลัก");
      return;
    }

    try {
      if (userPin === null) {
        // กรณีตั้งค่า PIN ครั้งแรก
        await updateDoc(doc(db, "users", user.uid), {
          pin: newPin,
        });
        toast.success("ตั้งค่า PIN สำเร็จ");
        navigate("/home");
      } else {
        // กรณีปลดล็อคกระปุก
        if (newPin === userPin) {
          navigate("/home");
          toast.success("ปลดล็อคกระปุกสำเร็จ");
        } else {
          toast.error("PIN ไม่ถูกต้อง");
        }
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const handleBack = () => {
    if (userPin === null) {
      navigate("/");
    } else {
      navigate("/home");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[756px] h-[742px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col justify-center items-center ">
            <div onClick={handleBack} className="cursor-pointer">
              <BtnBack />
            </div>
            <div className="flex flex-col justify-center text-center gap-2 mb-[38px]">
              <div className="flex flex-col gap-[18px] items-center">
                <img
                  src={LogoPicUnlockPin}
                  alt=""
                  className="size-[202px] object-cover"
                />
                <h2 className="text-h3 font-bold text-neutral-white-800 text-center">
                  {userPin === null
                    ? "กำหนด PIN สำหรับปลดล็อคกระปุก"
                    : "ปลดล็อคกระปุก"}
                </h2>
              </div>
              <h2 className="text-h2-bold text-neutral-white-800 text-center">
                Smart Piggy Bank
              </h2>
            </div>
            <div className="mb-[52px]">
              {/* <h2 className="text-h3-bold font-bold text-neutral-white-800 pb-[10px]">
                กรุณากรอก PIN :
              </h2> */}
              <InputPin
                textPin="กรุณากรอก PIN :"
                className="your-class-name"
                onChange={handlePinChange}
              />
            </div>
            <BtnYellow
              className={"px-[136px]"}
              text={userPin === null ? "ยืนยัน PIN" : "ปลดล็อคกระปุก"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
