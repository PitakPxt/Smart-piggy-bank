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
import { useContext } from "react";
import { getDatabase, ref, update } from "firebase/database";

export default function UnlockPin() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userPin, setUserPin] = useState(null);
  const [newPin, setNewPin] = useState("");
  const [pin, setPin] = useState("");

  const isFromLogin = location.state?.fromLogin || false;

  useEffect(() => {
    const checkPin = async () => {
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      setUserPin(userData.pin);
    };
    checkPin();
  }, [user]);

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
          // ดึงข้อมูล savingNumber จาก Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.data();
          const savingNumber = userData.savingNumber;

          // อัพเดท status ใน Realtime Database
          const rtdb = getDatabase();
          const savingRef = ref(rtdb, `saving/${savingNumber}`);
          await update(savingRef, {
            status: true,
          });

          toast.success("ปลดล็อคกระปุกสำเร็จ");
          navigate("/unlock-success");
        } else {
          toast.error("PIN ไม่ถูกต้อง");
        }
      }
    } catch (error) {
      console.error("Error:", error);
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

  const handlePinSubmit = async (e) => {
    e.preventDefault();

    if (user?.pin && pin) {
      if (pin === user.pin) {
        try {
          const db = getDatabase();
          const savingRef = ref(db, `saving/${user.savingNumber}`);
          await update(savingRef, {
            status: true,
          });

          navigate("/unlock-success");
        } catch (error) {
          console.error("Error updating status:", error);
          alert("เกิดข้อผิดพลาดในการอัพเดทสถานะ");
        }
      } else {
        alert("รหัส PIN ไม่ถูกต้อง");
      }
    }
  };

  const handleForgetPassword = () => {
    navigate("/forget-pin");
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
            <div className="flex flex-col relative mb-[52px] gap-2">
              <InputPin textPin="กรุณากรอก PIN :" onChange={handlePinChange} />
              {userPin !== null && (
                <div className="absolute bottom-[-28px] right-0">
                  <span
                    className="text-h4 text-neutral-white-500 cursor-pointer"
                    onClick={handleForgetPassword}
                  >
                    ลืมรหัสผ่าน?
                  </span>
                </div>
              )}
            </div>
            <BtnYellow
              className={"px-[136px] mt-6"}
              text={userPin === null ? "ยืนยัน PIN" : "ปลดล็อคกระปุก"}
              onClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
