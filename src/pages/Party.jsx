import React, { useState, useEffect, useCallback } from "react";
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
import LogoDelete from "../assets/images/delete-Player.png";
import NotFoundModal from "../components/modals/NotFoundModal";
import LogoLoading from "/lottie/loading.lottie";
import LogoPig from "/lottie/pig.lottie";
import BtnBack from "../components/BtnBack";
import PartySucceedModal from "../components/modals/PartySucceedModal";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import DeleteUserPartyModal from "../components/modals/DeleteUserPartyModal";

function PlayerListItem({
  rank,
  player,
  onDelete,
  isCreator,
  currentUserId,
  creatorName,
}) {
  const bgColors = {
    1: "bg-primary-500",
    2: "bg-primary-400",
    3: "bg-primary-300",
    default: "bg-primary-200",
  };

  const canDelete =
    isCreator && player.id !== currentUserId && player.name !== creatorName;

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
      <div className="flex items-center mr-[48px] gap-[24px]">
        <div className="w-[120px] flex justify-end">
          <h2 className="text-h2-bold">{player.amount} ฿</h2>
        </div>
        <div className="w-[32px]">
          {canDelete && (
            <img
              className="size-[32px] cursor-pointer"
              src={LogoDelete}
              alt="Delete"
              onClick={() => onDelete(player)}
            />
          )}
        </div>
      </div>
    </li>
  );
}

export default function Party() {
  const { user, loading: userLoading } = useUserAuth();
  const navigate = useNavigate();
  const [partyData, setPartyData] = useState(null);
  const [playerData, setPlayerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPartySucceedModal, setShowPartySucceedModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });
  const [isPartyEnded, setIsPartyEnded] = useState(false);
  const [isPartyCreator, setIsPartyCreator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const calculateTimeLeft = useCallback((createdAt, totalDays) => {
    const endDate = new Date(createdAt);
    endDate.setDate(endDate.getDate() + totalDays);
    const currentDate = new Date();
    const timeDiff = endDate - currentDate;

    setIsPartyEnded(timeDiff <= 0);

    if (timeDiff <= 0) {
      return { days: 0, hours: 0, minutes: 0 };
    }

    return {
      days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
    };
  }, []);

  const fetchPartyData = async () => {
    try {
      if (!user) {
        console.log("ไม่พบผู้ใช้ที่ล็อกอิน");
        return;
      }

      // ดึงข้อมูล user และ party
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const partyId = userDoc.data().party;
      const partyDoc = await getDoc(doc(db, "party", partyId));
      const party = partyDoc.data();

      // เพิ่ม console.log เพื่อดูค่า
      console.log("Current user name:", userDoc.data().name);
      console.log("Party creator name:", party.createdBy);

      // เช็คว่าผู้ใช้ปัจจุบันเป็นผู้สร้างปาร์ตี้หรือไม่โดยเทียบจากชื่อ
      setIsPartyCreator(userDoc.data().name === party.createdBy);

      const createdAt = party.createdAt.toDate();
      const totalDays = parseInt(party.days);

      // คำนวณเวลาที่เหลือคั้งแรก
      const initialTimeLeft = calculateTimeLeft(createdAt, totalDays);

      setTimeLeft(initialTimeLeft);
      setPartyData({
        ...party,
        ...initialTimeLeft,
      });

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

  useEffect(() => {
    if (!user) return;
    let unsubscribeSnapshots = [];
    fetchPartyData();
    return () => {
      unsubscribeSnapshots.forEach((unsubscribe) => unsubscribe());
    };
  }, [user]);

  useEffect(() => {
    if (!partyData) return;

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(
        partyData.createdAt.toDate(),
        parseInt(partyData.days)
      );

      const endDate = new Date(partyData.createdAt);
      endDate.setDate(endDate.getDate() + parseInt(partyData.days));
      const isPartyEnded = new Date() > endDate;

      console.log(endDate);

      setTimeLeft(newTimeLeft);
    }, 60000); // อัพเดททุก 1 นาที

    return () => clearInterval(timer);
  }, [partyData, calculateTimeLeft]);

  const handleDeleteClick = (player) => {
    setSelectedPlayer(player);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!selectedPlayer) return;

      // อัพเดท party document โดยลบ member
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const partyId = userDoc.data().party;
      const partyRef = doc(db, "party", partyId);
      const partyDoc = await getDoc(partyRef);

      const updatedMembers = partyDoc
        .data()
        .members.filter((id) => id !== selectedPlayer.id);

      await updateDoc(partyRef, {
        members: updatedMembers,
      });

      // อัพเดท user document ของคนที่ถูกลบ
      const memberRef = doc(db, "users", selectedPlayer.id);
      await updateDoc(memberRef, {
        party: null,
      });

      // อัพเดท playerData และจัดเรียงใหม่
      const updatedPlayerData = playerData
        .filter((player) => player.id !== selectedPlayer.id)
        .sort((a, b) => b.amount - a.amount)
        .map((player, index) => ({
          ...player,
          rankImage: getRankImage(index + 1), // function สำหรับเลือกรูป rank ตามอันดับ
        }));

      setPlayerData(updatedPlayerData);
      setShowDeleteModal(false);
      setSelectedPlayer(null);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการลบสมาชิก:", error);
    }
  };

  // เพิ่มฟังก์ชันสำหรับเลือกรูป rank
  const getRankImage = (rank) => {
    switch (rank) {
      case 1:
        return LogoNumber1;
      case 2:
        return LogoNumber2;
      case 3:
        return LogoNumber3;
      default:
        return null;
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedPlayer(null);
  };

  useEffect(() => {
    const updatePartyStatus = async () => {
      if (isPartyEnded && user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const partyId = userDoc.data().party;

          if (partyId) {
            const partyRef = doc(db, "party", partyId);
            await updateDoc(partyRef, {
              status: "end",
            });
            console.log("อัพเดทสถานะปาร์ตี้เป็น end สำเร็จ");

            const topPlayers = playerData.slice(0, 3).map((player) => ({
              name: player.name,
              amount: player.amount,
              avatar: player.avatar,
            }));

            navigate("/ranking", {
              state: {
                topPlayers,
                partyId,
                members: playerData.map((player) => player.id),
              },
            });
          }
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการอัพเดทสถานะปาร์ตี้:", error);
        }
      }
    };

    updatePartyStatus();
  }, [isPartyEnded, user, playerData, navigate]);

  const handleEndParty = useCallback(async () => {
    try {
      // ดึงข้อมูล party ID จาก user
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const partyId = userDoc.data().party;

      // อัพเดทสถานะปาร์ตี้เป็น "end"
      const partyRef = doc(db, "party", partyId);
      await updateDoc(partyRef, {
        status: "end",
      });

      // เลือก 3 อันดับแรกจาก playerData
      const topPlayers = playerData.slice(0, 3).map((player) => ({
        name: player.name,
        amount: player.amount,
        avatar: player.avatar,
      }));

      setShowPartySucceedModal(false);
      navigate("/ranking", {
        state: {
          topPlayers,
          partyId,
          members: playerData.map((player) => player.id),
        },
      });
    } catch (error) {
      console.error("Error ending party:", error);
    }
  }, [navigate, playerData, user]);

  const handleCancelParty = useCallback(() => {
    setShowPartySucceedModal(false);
  }, []);

  if (loading || userLoading) {
    return (
      <NotFoundModal
        src={LogoLoading}
        text="กำลังโหลดข้อมูล..."
        className="h-[220px]"
        showBackButton={false}
      />
    );
  }

  if (!partyData) {
    return (
      <NotFoundModal
        src={LogoPig}
        text="ไม่พบข้อมูลปาร์ตี้"
        className="w-[480px]"
        to="/home"
      />
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div
        className="w-[768px] h-[814px] flex flex-col justify-start items-center bg-neutral-white-100 rounded-3xl overflow-hidden
      drop-shadow-lg gap-[18px] pt-[24px] relative"
      >
        <Link to="/home">
          <BtnBack />
        </Link>
        <div className="text-center items-center">
          <div className="flex flex-col">
            <h2 className="text-h2-bold">
              เป้าหมาย : {partyData?.target || 0} บาท
            </h2>
            <h2 className="text-h2-bold">ปาร์ตี้ : {partyData?.partyName}</h2>
            <h3 className="text-h3">
              ระยะเวลาที่เหลือ {timeLeft.days || 0} วัน {timeLeft.hours || 0}{" "}
              ชั่วโมง {timeLeft.minutes || 0} นาที
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
                onDelete={handleDeleteClick}
                isCreator={isPartyCreator}
                currentUserId={user.uid}
                creatorName={partyData?.createdBy}
              />
            ))}
          </ul>
        </div>
        {isPartyCreator && (
          <div
            className="px-[32px] py-[12px] absolute bottom-[24px] bg-transparent border-2 border-error-300 text-error-300 text-h3-bold 
            rounded-xl drop-shadow-lg hover:border-error-200 hover:bg-error-200 hover:text-neutral-white-100 cursor-pointer"
            onClick={() => setShowPartySucceedModal(true)}
          >
            สิ้นสุดปาร์ตี้
          </div>
        )}
      </div>
      {showPartySucceedModal && (
        <PartySucceedModal
          show={showPartySucceedModal}
          setShowPartySucceedModal={setShowPartySucceedModal}
          onEndParty={handleEndParty}
          onCancel={handleCancelParty}
        />
      )}
      {showDeleteModal && (
        <DeleteUserPartyModal
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
