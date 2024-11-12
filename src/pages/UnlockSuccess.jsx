import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { getDatabase, ref, update } from "firebase/database";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";
import LogoUnlockPinSucces from "../assets/images/logo-pic-unlockSucces.png";

export default function UnlockSuccess() {
  const [countdown, setCountdown] = useState(15);
  const { user } = useUserAuth();
  const navigate = useNavigate();

  // แยกฟังก์ชัน updateStatus ออกมาเพื่อใช้ร่วมกัน
  const updateStatus = async () => {
    try {
      // ดึงข้อมูล savingNumber จาก Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      const savingNumber = userData.savingNumber;

      // อัพเดท status เป็น false ใน Realtime Database
      const rtdb = getDatabase();
      const savingRef = ref(rtdb, `saving/${savingNumber}`);
      await update(savingRef, {
        status: false,
      });

      // นำทางกลับไปหน้า home
      navigate("/home");
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          updateStatus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user, navigate]);

  // ฟังก์ชันสำหรับจัดการเมื่อกดปุ่มล็อคกระปุก
  const handleLockClick = () => {
    updateStatus();
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-[856px] h-[726px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
        <div className="w-full h-full flex flex-col justify-center items-center">
          <img
            className="size-[376px] mb-11"
            src={LogoUnlockPinSucces}
            alt=""
          />
          <h2 className="text-h2-bold mb-[54px]">ปลดล็อคกระปุกสำเร็จ</h2>
          <button
            onClick={handleLockClick}
            className="px-[124px] py-3 bg-primary-500 text-h3-bold rounded-xl drop-shadow-lg hover:bg-primary-600 transition-colors"
          >
            ล็อคกระปุก ({countdown})
          </button>
        </div>
      </div>
    </div>
  );
}
