import React, { useEffect, useState } from "react";
import LogoRang from "../assets/images/rang-number-1.png";
import BtnYellow from "../components/BtnYellow";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const RankCard = ({ rank, name, amount, bgColor, avatar }) => {
  const isFirstPlace = rank === 1;

  const getHeight = () => {
    if (isFirstPlace) return "368px";
    if (rank === 2) return "286px";
    return "216px";
  };

  return (
    <div className="flex flex-col justify-end">
      <div className="flex flex-col text-center items-center mb-4">
        <img
          className="size-[120px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2"
          src={avatar}
          alt={`${name}'s profile`}
        />
        <h3 className="text-h3-bold">{name}</h3>
        <h2 className="text-h2-bold">{amount} ฿</h2>
      </div>
      <div
        className={`flex ${
          isFirstPlace ? "flex-col items-center" : ""
        } justify-center items-end ${bgColor}`}
        style={{
          height: getHeight(),
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        <h1 className="text-[128px] font-bold">{rank}</h1>
        {isFirstPlace && (
          <img
            className="size-[148px] drop-shadow-mddrop-shadow-lg"
            src={LogoRang}
            alt="First place badge"
          />
        )}
      </div>
    </div>
  );
};

export default function Ranking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const topPlayers = location.state?.topPlayers || [];

  const cleanupPartyData = async () => {
    try {
      // ดึงข้อมูล party ที่มี status เป็น "end"
      const partyRef = doc(db, "party", "pitak");
      const partyDoc = await getDoc(partyRef);

      if (!partyDoc.exists()) {
        console.error("ไม่พบข้อมูลปาร์ตี้");
        return;
      }

      const partyData = partyDoc.data();

      // ตรวจสอบว่า status เป็น "end" หรือไม่
      if (partyData.status !== "end") {
        console.log("ปาร์ตี้ยังไม่สิ้นสุด");
        return;
      }

      // อัพเดทข้อมูลผู้ใช้
      const members = partyData.members || [];
      for (const memberId of members) {
        const userRef = doc(db, "users", memberId);
        await updateDoc(userRef, {
          party: null,
        });
        console.log(`อัพเดทผู้ใช้ ${memberId} สำเร็จ`);
      }

      // ลบข้อมูลปาร์ตี้
      await deleteDoc(partyRef);
      console.log("ลบปาร์ตี้สำเร็จ");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    cleanupPartyData();
  }, []);

  const orderedRankData = [
    {
      ...topPlayers[1],
      rank: 2,
      bgColor: "bg-[#F36B39]",
    },
    {
      ...topPlayers[0],
      rank: 1,
      bgColor: "bg-primary-500",
    },
    {
      ...topPlayers[2],
      rank: 3,
      bgColor: "bg-[#9BD0F2]",
    },
  ].filter(Boolean);

  if (isLoading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-[756px] h-[840px] flex flex-col justify-center items-center bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
        <div className="w-[620px] h-[714px] flex flex-col justify-center items-center text-center">
          <div className="flex flex-col size-full">
            <h2 className="text-h2-bold mb-[28px]">การจัดอันดับ</h2>
            <div className="grid grid-cols-3 gap-6 h-full mb-[34px]">
              {orderedRankData.map((player) => (
                <RankCard key={player.rank} {...player} />
              ))}
            </div>
            <div className="w-full">
              <BtnYellow
                className="px-[36px]"
                text="กลับไปหน้าหลัก"
                onClick={() => navigate("/home")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
