import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useUserAuth } from "../context/AuthContext"; // สมมติว่ามี context สำหรับ auth
import Coin1 from "../assets/images/coin-1.png";
import Coin2 from "../assets/images/coin-2.png";
import Coin5 from "../assets/images/coin-5.png";
import Coin10 from "../assets/images/coin-10.png";
import BtnYellow from "../components/BtnYellow";
import { Link } from "react-router-dom";

// สร้าง component ย่อยสำหรับแสดงข้อมูลเหรียญ
const CoinDisplay = ({ coinImage, value }) => (
  <div className="flex items-center gap-5">
    <img src={coinImage} alt="coin" />
    <h1 className="w-[226px] h-[72px] bg-neutral-white-200 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
      {value}
    </h1>
  </div>
);

export default function Home() {
  const [savingData, setSavingData] = useState(null);
  const { user } = useUserAuth();

  useEffect(() => {
    if (!user) return;

    // ดึงข้อมูล user document เพื่อหา savingNumber
    const userDocRef = doc(db, "users", user.uid);
    console.log(userDocRef.id);

    const unsubscribe = onSnapshot(userDocRef, (userDoc) => {
      if (userDoc.exists()) {
        const { savingNumber } = userDoc.data();
        console.log(savingNumber);
        // ดึงข้อมูล saving document
        const savingDocRef = doc(db, "saving", savingNumber);
        onSnapshot(savingDocRef, (savingDoc) => {
          console.log(savingDoc.data());
          if (savingDoc.exists()) {
            const data = savingDoc.data();
            setSavingData({
              coin1: data.coin1 || 0,
              coin2: data.coin2 || 0,
              coin5: data.coin5 || 0,
              coin10: data.coin10 || 0,
              total: data.total || 0,
            });
          } else {
            // กรณีไม่พบ document ให้ set ค่าเริ่มต้นเป็น 0 ทั้งหมด
            setSavingData({
              coin1: 0,
              coin2: 0,
              coin5: 0,
              coin10: 0,
              total: 0,
            });
          }
        });
      } else {
        // กรณีไม่พบ user document
        setSavingData({
          coin1: 0,
          coin2: 0,
          coin5: 0,
          coin10: 0,
          total: 0,
        });
      }
    });

    return () => unsubscribe();
  }, [user]);

  const coins = [
    { image: Coin1, value: savingData?.coin1 || 0 },
    { image: Coin2, value: savingData?.coin2 || 0 },
    { image: Coin5, value: savingData?.coin5 || 0 },
    { image: Coin10, value: savingData?.coin10 || 0 },
  ];

  return (
    <div className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex flex-col w-[856px] h-[649px] bg-neutral-white-100 opacity-95 rounded-3xl drop-shadow-lg mx-auto overflow-hidden justify-center items-center mb-[50px]">
        <h1 className="w-[384px] h-[96px] mb-[76px] bg-primary-400 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
          ยอดรวม : {savingData?.total || 0} บาท
        </h1>
        <div className="grid grid-cols-2 gap-4">
          {coins.map((coin, index) => (
            <CoinDisplay
              key={index}
              coinImage={coin.image}
              value={coin.value}
            />
          ))}
        </div>
      </div>
      <Link to="/party">
        <BtnYellow className={"px-[98px]"} text={"ดูปาร์ตี้"} />
      </Link>
    </div>
  );
}
