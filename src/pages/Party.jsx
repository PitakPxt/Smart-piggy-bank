import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import LogoNumber1 from "../assets/images/number-1.png";
import LogoNumber2 from "../assets/images/number-2.png";
import LogoNumber3 from "../assets/images/number-3.png";
import Whawha from "../assets/images/whawha.jpg";
import LogoDelete from "../assets/images/delete-Player.png";
import BtnBack from "../components/BtnBack";

function PlayerListItem({ rank, player, onDelete }) {
  const bgColors = {
    1: "bg-primary-500",
    2: "bg-primary-400",
    3: "bg-primary-300",
    default: "bg-primary-200",
  };

  return (
    <li
      className={`w-[680px] h-[100px] flex items-center justify-between ${
        bgColors[rank] || bgColors.default
      } rounded-3xl`}
    >
      <div className="flex">
        {rank <= 3 && (
          <img
            className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
            src={player.rankImage}
            alt={`Rank ${rank}`}
          />
        )}
        <div className="flex items-center gap-[24px]">
          <img
            className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
            src={player.avatar}
            alt={player.name}
          />
          <h2 className="text-h2-bold w-[180px] truncate">{player.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-[24px] mr-[48px]">
        <h2 className="text-h2-bold text-right">{player.amount} ฿</h2>
        <img
          className="size-[32px] cursor-pointer"
          src={LogoDelete}
          alt="Delete"
          onClick={() => onDelete(player.id)}
        />
      </div>
    </li>
  );
}

export default function Party() {
  const [partyData, setPartyData] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnapshots = [];

    const fetchPartyData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error("ไม่พบผู้ใช้ที่ล็อกอิน");
          return;
        }

        // ดึงข้อมูล user และ party
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const partyId = userDoc.data().party;
        const partyDoc = await getDoc(doc(db, "party", partyId));
        const party = partyDoc.data();
        setPartyData(party);

        // เก็บข้อมูล members
        const memberPromises = party.members.map(async (memberId) => {
          const memberDoc = await getDoc(doc(db, "users", memberId));
          if (!memberDoc.exists()) return null;
          const memberData = memberDoc.data();

          // ดึงข้อมูล saving ครั้งแรก
          const savingDoc = await getDoc(
            doc(db, "saving", memberData.savingNumber)
          );
          const initialAmount = savingDoc.exists() ? savingDoc.data().total : 0;

          // ติดตามการเปลี่ยนแปลงของ saving
          const unsubscribe = onSnapshot(
            doc(db, "saving", memberData.savingNumber),
            (doc) => {
              if (doc.exists()) {
                const newAmount = doc.data().total || 0;
                setPlayerData((currentPlayers) => {
                  const updatedPlayers = currentPlayers.map((player) => {
                    if (player.savingNumber === memberData.savingNumber) {
                      return { ...player, amount: newAmount };
                    }
                    return player;
                  });

                  return updatedPlayers
                    .sort((a, b) => b.amount - a.amount)
                    .map((player, index) => ({
                      ...player,
                      rankImage:
                        index < 3
                          ? [LogoNumber1, LogoNumber2, LogoNumber3][index]
                          : null,
                    }));
                });
              }
            }
          );

          unsubscribeSnapshots.push(unsubscribe);

          return {
            id: memberId,
            name: memberData.name,
            avatar: memberData.profileImageURL,
            amount: initialAmount,
            savingNumber: memberData.savingNumber,
          };
        });

        const memberResults = await Promise.all(memberPromises);
        const validMembers = memberResults
          .filter((member) => member !== null)
          .sort((a, b) => b.amount - a.amount)
          .map((player, index) => ({
            ...player,
            rankImage:
              index < 3 ? [LogoNumber1, LogoNumber2, LogoNumber3][index] : null,
          }));

        setPlayerData(validMembers);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartyData();

    return () => {
      unsubscribeSnapshots.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const handleDeletePlayer = async (playerId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("ไม่พบผู้ใช้ที่ล็อกอิน");
        return;
      }

      // อัพเดทข้อมูลในคอลเลคชัน party โดยลบ memberId ออก
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      const partyId = userDoc.data().partyId;

      const partyRef = doc(db, "party", partyId);
      const partyDoc = await getDoc(partyRef);
      const currentMembers = partyDoc.data().members;

      // ลบ memberId ออกจากอาร์เรย์
      const updatedMembers = currentMembers.filter((id) => id !== playerId);

      // อัพเดทข้อมูลใน Firestore
      await updateDoc(partyRef, {
        members: updatedMembers,
      });

      // อัพเดท state เพื่อแสดงผลใหม่
      setPlayerData((players) =>
        players.filter((player) => player.id !== playerId)
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบสมาชิก:", error);
    }
  };

  const handleEndParty = async () => {
    try {
      // TODO: เพิ่มโค้ดสำหรับจัดการการสิ้นสุดปาร์ตี้
      // เช่น อัพเดทสถานะปาร์ตี้ใน Firestore
      console.log("End party");
    } catch (error) {
      console.error("Error ending party:", error);
    }
  };

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  // เพิ่มการตรวจสอบว่ามีข้อมูล partyData หรือไม่
  if (!partyData) {
    return <div>ไม่พบข้อมูลปาร์ตี้</div>;
  }

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[768px] h-[814px] flex flex-col justify-start items-center
          bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg gap-[18px] pt-[42px] relative"
        >
          <Link to="/home">
            <BtnBack />
          </Link>
          <div className="text-center items-center mt-[28px]">
            <h2 className="text-h2-bold">ปาร์ตี้ : {partyData?.partyName}</h2>
            <div className="flex gap-[28px]">
              <h3 className="text-h3-bold">
                เป้าหมาย : {partyData?.target || 0} บาท
              </h3>
              <h3 className="text-h3-bold">
                ระยะเวลาที่เหลือ {partyData?.days || 0} วัน
              </h3>
            </div>
          </div>
          <div className="w-[680px] justify-center items-center flex-grow">
            <ul className="flex flex-col gap-[8px]">
              {playerData?.map((player, index) => (
                <PlayerListItem
                  key={player.id}
                  rank={index + 1}
                  player={player}
                  onDelete={handleDeletePlayer}
                />
              ))}
            </ul>
          </div>
          <div
            className="px-[32px] py-[12px] absolute bottom-[24px] bg-transparent border-2 border-error-300 text-error-300 text-h3-bold 
            rounded-xl drop-shadow-lg hover:border-error-200 hover:bg-error-200 hover:text-neutral-white-100 cursor-pointer"
            onClick={handleEndParty}
          >
            สิ้นสุดปาร์ตี้
          </div>
        </div>
      </div>
    </>
  );
}
