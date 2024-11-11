import React, { useEffect, useState } from "react";
import LogoRang from "../assets/images/rang-number-1.png";
import BtnYellow from "../components/BtnYellow";
import LogoLoading from "/lottie/loading.lottie";
import NotFoundModal from "../components/modals/NotFoundModal";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";

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
  const { user } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [winners, setWinners] = useState([]);
  const partyId = location.state?.partyId;

  const handleBackToHome = async () => {
    try {
      if (!partyId || !user?.uid) return;

      // ดึงข้อมูล party เพื่อตรวจสอบจำนวน members
      const partyRef = doc(db, "party", partyId);
      const partyDoc = await getDoc(partyRef);

      if (partyDoc.exists()) {
        const partyData = partyDoc.data();
        const updatedMembers = partyData.members.filter(
          (memberId) => memberId !== user.uid
        );

        // ถ้าเป็นคนสุดท้ายให้ลบ party document
        if (updatedMembers.length === 0) {
          await deleteDoc(partyRef);
        } else {
          // ถ้ายังมีคนอื่นอยู่ให้อัพเดท members array
          await updateDoc(partyRef, {
            members: updatedMembers,
          });
        }
      }

      // อัพเดทข้อมูลผู้ใช้
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        party: null,
      });

      navigate("/home");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการออกจากปาร์ตี้:", error);
    }
  };

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        if (!partyId) {
          console.error("ไม่พบ partyId");
          return;
        }

        const partyRef = doc(db, "party", partyId);
        const partyDoc = await getDoc(partyRef);

        if (!partyDoc.exists()) {
          console.error("ไม่พบข้อมูลปาร์ตี้");
          return;
        }

        const partyData = partyDoc.data();
        if (partyData.winners) {
          setWinners(partyData.winners);
        }
      } catch (error) {
        console.error("เกิดข้อผิดพลาด:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWinners();
  }, [partyId]);

  const orderedRankData = [
    {
      ...winners[1],
      rank: 2,
      bgColor: "bg-[#F36B39]",
    },
    {
      ...winners[0],
      rank: 1,
      bgColor: "bg-primary-500",
    },
    {
      ...winners[2],
      rank: 3,
      bgColor: "bg-[#9BD0F2]",
    },
  ].filter(Boolean);

  if (isLoading) {
    return (
      <NotFoundModal
        src={LogoLoading}
        text="กำลังโหลดข้อมูล..."
        className="h-[220px]"
        showBackButton={false}
      />
    );
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
                onClick={handleBackToHome}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
