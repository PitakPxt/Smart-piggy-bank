import React, { useEffect, useState } from "react";
import LogoRang from "../assets/images/rang-number-1.png";
import BtnYellow from "../components/BtnYellow";
import LogoLoading from "/lottie/loading.lottie";
import NotFoundModal from "../components/modals/NotFoundModal";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserAuth } from "../context/AuthContext";
import { useScreen } from "../hooks/useScreen";
import BtnBack from "../components/BtnBack";
import { cn } from "../lib/tailwindcss";

const RankCard = ({ rank, name, amount, bgColor, avatar }) => {
  const isFirstPlace = rank === 1;
  const { isMobile, isTablet, isTabletHorizontal, isDesktop } = useScreen();

  const getHeight = () => {
    if (isMobile) {
      if (isFirstPlace) return "217px";
      if (rank === 2) return "148px";
      return "110px";
    } else if (isTablet && !isTabletHorizontal) {
      if (isFirstPlace) return "388px";
      if (rank === 2) return "276px";
      return "206px";
    } else if (isTablet && isTabletHorizontal) {
      if (isFirstPlace) return "248px";
      if (rank === 2) return "176px";
      return "146px";
    } else if (isDesktop) {
      if (isFirstPlace) return "368px";
      if (rank === 2) return "286px";
      return "216px";
    }
  };

  return (
    <div className="flex flex-col justify-end">
      <div className="flex flex-col text-center items-center xl:mb-4 sm:mb-1">
        <img
          className="xl:size-[120px] lg:size-[95px] md:size-[100px] sm:size-[78px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2"
          src={avatar}
          alt={`${name}'s profile`}
        />
        <h3 className="md:text-h3-bold sm:text-h5-bold">{name}</h3>
        <h2 className="md:text-h2-bold sm:text-h4-bold">{amount} ฿</h2>
      </div>
      <div
        className={`flex ${
          isFirstPlace ? "flex-col items-center " : ""
        } justify-center items-end ${bgColor}`}
        style={{
          height: getHeight(),
          borderTopLeftRadius: "1rem",
          borderTopRightRadius: "1rem",
        }}
      >
        <h1 className="xl:text-[128px] lg:text-[95px] md:text-[128px] sm:text-[78px] font-bold">
          {rank}
        </h1>
        {isFirstPlace && (
          <img
            className="xl:size-[148px] lg:size-[90px] md:size-[130px] sm:size-[80px]"
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

  const { isTablet, isTabletHorizontal, isDesktop, isMobile } = useScreen();

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

  const orderedRankData = () => {
    const validWinners = winners.filter(Boolean);
    let rankData = new Array(3);

    if (validWinners.length === 1) {
      // ถ้ามีคนเดียว ให้แสดงตรงกลาง (อันดับ 1)
      rankData[1] = {
        ...winners[0],
        rank: 1,
        bgColor: "bg-ranking-1",
      };
    } else if (validWinners.length === 2) {
      // อันดับ 1 ตรงกลาง, อันดับ 2 ซ้าย
      rankData[0] = {
        ...winners[1],
        rank: 2,
        bgColor: "bg-ranking-2",
      };
      rankData[1] = {
        ...winners[0],
        rank: 1,
        bgColor: "bg-ranking-1",
      };
    } else if (validWinners.length >= 3) {
      // อันดับ 1 ตรงกลาง, อันดับ 2 ซ้าย, อันดับ 3 ขวา
      rankData[0] = {
        ...winners[1],
        rank: 2,
        bgColor: "bg-ranking-2",
      };
      rankData[1] = {
        ...winners[0],
        rank: 1,
        bgColor: "bg-ranking-1",
      };
      rankData[2] = {
        ...winners[2],
        rank: 3,
        bgColor: "bg-ranking-3",
      };
    }

    return rankData;
  };

  const screenWidth = window.innerWidth;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div
        className={cn(
          "relative xl:w-[756px] xl:h-[820px] lg:w-[800px] lg:h-[618px] md:w-[678px] md:max-h-[862px] sm:w-[344px] sm:max-h-[550px] flex flex-col justify-center items-center bg-neutral-white-100 rounded-3xl overflow-hidden shadow-main-shadow md:justify-start h-fit",
          !isTablet && screenWidth <= 1024 && "py-12",
          isTablet && !isTabletHorizontal && screenWidth <= 1024 && "pt-4 pb-12"
        )}
      >
        {isTablet && isTabletHorizontal && (
          <div className="absolute top-4 left-4">
            <BtnBack onClick={handleBackToHome} />
          </div>
        )}
        <div className="xl:w-[620px] xl:h-[714px] lg:w-[682px] lg:h-[580px] md:w-[598px] h-fit md:max-h-[738px] sm:w-[312px] sm:max-h-[466px] flex flex-col justify-center items-center text-center py-4">
          <div className="flex flex-col size-full">
            <h2 className="md:mb-[28px] md:text-h2-bold sm:text-h3-bold">
              การจัดอันดับ
            </h2>
            <div className="grid grid-cols-3 xl:gap-6 sm:gap-3 h-full xl:mb-[34px] lg:mb-[18px] md:mb-[34px] sm:mb-[24px] justify-center items-end">
              {orderedRankData().map(
                (player, index) =>
                  player && (
                    <div
                      key={index}
                      className={winners.length === 1 ? "col-start-2" : ""}
                    >
                      <RankCard {...player} />
                    </div>
                  )
              )}
            </div>
            {(isDesktop || isMobile) && (
              <div className="w-full">
                <BtnYellow
                  className="px-[36px]"
                  text="กลับไปหน้าหลัก"
                  onClick={handleBackToHome}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
