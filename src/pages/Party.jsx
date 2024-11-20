import React, { useState, useEffect, useCallback, useRef } from "react";
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

  const timer = useRef(null);

  const calculateTimeLeft = useCallback((createdAt, totalDays) => {
    const endDate = new Date(createdAt);
    endDate.setDate(endDate.getDate() + totalDays);
    const currentDate = new Date();
    const timeDiff = endDate - currentDate;

    if (timeDiff <= 0) {
      setIsPartyEnded(true);
      handleEndParty();
      return { days: 0, hours: 0, minutes: 0 };
    }

    setIsPartyEnded(false);
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
      const partyRef = doc(db, "party", partyId);
      const partyDoc = await getDoc(partyRef);
      const party = partyDoc.data();

      // ถ้า status เป็น end ให้ redirect ไปหน้า ranking ทันที
      if (party.status === "end") {
        // เตรียมข้อมูลผู้เล่นทั้งหมด
        const memberData = await Promise.all(
          party.members.map(async (memberId) => {
            const memberDoc = await getDoc(doc(db, "users", memberId));
            const memberInfo = memberDoc.data();
            const savingDoc = await getDoc(
              doc(db, "saving", memberInfo.savingNumber)
            );
            const amount = savingDoc.exists() ? savingDoc.data().total : 0;

            return {
              name: memberInfo.name,
              amount: amount,
              avatar: memberInfo.profileImageURL,
            };
          })
        );

        // เรียงลำดับและเตรียมข้อมูล winners
        const sortedMembers = memberData
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3)
          .map((player, index) => ({
            ...player,
            rank: index + 1,
          }));

        // อัพเดท winners ใน party document ถ้ายังไม่มีข้อมูล
        if (!party.winners || party.winners.length === 0) {
          await updateDoc(doc(db, "party", partyId), {
            winners: sortedMembers,
          });
        }

        // จัดเรียงใหม่ตามลำดับการแสดงผล (2, 1, 3)
        const orderedWinners = [
          sortedMembers[1], // อันดับ 2
          sortedMembers[0], // อันดับ 1
          sortedMembers[2], // อันดับ 3
        ].filter(Boolean);

        // นำทางไปหน้า ranking พร้อมข้อมูลที่จัดเรียงแล้ว
        navigate("/ranking", {
          state: {
            topPlayers: orderedWinners,
            partyId: partyId,
            members: party.members,
          },
          replace: true,
        });
        return;
      }

      // ตั้ง state สำหรับข้อมูลปาร์ตี้ (ถ้า status ไม่ใช่ end)
      setIsPartyCreator(userDoc.data().name === party.createdBy);
      const createdAt = party.createdAt.toDate();
      const totalDays = parseInt(party.days);
      const initialTimeLeft = calculateTimeLeft(createdAt, totalDays);
      setTimeLeft(initialTimeLeft);
      setPartyData({
        ...party,
        ...initialTimeLeft,
      });

      timer.current = setInterval(() => {
        const newTimeLeft = calculateTimeLeft(createdAt, totalDays);
        setTimeLeft(newTimeLeft);
      }, 60000);

      // เก็บข้อมูล members และติดตามการเปลี่ยนแปลง
      const memberPromises = party.members.map(async (memberId) => {
        const memberDoc = await getDoc(doc(db, "users", memberId));
        if (!memberDoc.exists()) return null;
        const memberData = memberDoc.data();

        // ดึงข้อมูล saving ครั้งแรก
        const savingDoc = await getDoc(
          doc(db, "saving", memberData.savingNumber)
        );
        const initialAmount = savingDoc.exists() ? savingDoc.data().total : 0;

        // ติดตามการเปลี่ยนแปลงเอง saving
        onSnapshot(doc(db, "saving", memberData.savingNumber), async (doc) => {
          if (doc.exists()) {
            const newAmount = doc.data().total || 0;

            // ตรวจสอบว่าถึงเป้าหมายหรือไม่
            if (newAmount >= party.target) {
              // อัพเดท status อย่างเดียว
              await updateDoc(partyRef, {
                status: "end",
              });

              // เตรียมข้อมูลผู้เล่นทั้งหมดใหม่
              const allPlayers = await Promise.all(
                party.members.map(async (memberId) => {
                  const memberDoc = await getDoc(doc(db, "users", memberId));
                  const memberData = memberDoc.data();
                  const savingDoc = await getDoc(
                    doc(db, "saving", memberData.savingNumber)
                  );
                  const amount = savingDoc.exists()
                    ? savingDoc.data().total
                    : 0;

                  return {
                    name: memberData.name,
                    amount: amount,
                    avatar: memberData.profileImageURL,
                  };
                })
              );

              // จัดเรียงและเตรียมข้อมูล 3 อันดับแรก
              const topThree = allPlayers
                .sort((a, b) => b.amount - a.amount)
                .slice(0, 3)
                .map((player, index) => ({
                  name: player.name,
                  amount: player.amount,
                  avatar: player.avatar,
                  rank: index + 1,
                }));

              // จัดเรียงใหม่ตามลำดับการแสดงผล (2, 1, 3)
              const orderedPlayers = [
                topThree[1], // อันดับ 2
                topThree[0], // อันดับ 1
                topThree[2], // อันดับ 3
              ].filter(Boolean);

              console.log("Sending to ranking:", orderedPlayers); // เพิ่ม log เพื่อตรวจสอบ

              // นำทางไปหน้า ranking
              navigate("/ranking", {
                state: {
                  topPlayers: orderedPlayers,
                  partyId: partyId,
                  members: party.members,
                },
                replace: true, // เพิ่ม replace: true เพื่อป้องกันการกลับมาหน้า party
              });
            }

            // อัพเดทข้อมูลผู้เล่น
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
        });

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
    return () => clearInterval(timer.current);
  }, [timer.current]);

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

  const handleEndParty = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const partyId = userDoc.data().party;
      const partyRef = doc(db, "party", partyId);
      const partyDoc = await getDoc(partyRef);
      const party = partyDoc.data();

      // เตรียมข้อมูลผู้เล่นทั้งหมด
      const memberData = await Promise.all(
        party.members.map(async (memberId) => {
          const memberDoc = await getDoc(doc(db, "users", memberId));
          const memberInfo = memberDoc.data();
          const savingDoc = await getDoc(
            doc(db, "saving", memberInfo.savingNumber)
          );
          const amount = savingDoc.exists() ? savingDoc.data().total : 0;

          return {
            name: memberInfo.name,
            amount: amount,
            avatar: memberInfo.profileImageURL,
          };
        })
      );

      // เรียงลำดับและเตรียมข้อมูล winners
      const sortedMembers = memberData
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3)
        .map((player, index) => ({
          ...player,
          rank: index + 1,
        }));

      // อัพเดทสถานะปาร์ตี้และบันทึกผู้ชนะ
      await updateDoc(partyRef, {
        status: "end",
        winners: sortedMembers,
      });

      // จัดเรียงใหม่ตามลำดับการแสดงผล (2, 1, 3)
      const orderedWinners = [
        sortedMembers[1], // อันดับ 2
        sortedMembers[0], // อันดับ 1
        sortedMembers[2], // อันดับ 3
      ].filter(Boolean);

      // นำทางไปหน้า ranking พร้อมข้อมูลที่จัดเรียงแล้ว
      navigate("/ranking", {
        state: {
          topPlayers: orderedWinners,
          partyId: partyId,
          members: party.members,
        },
        replace: true,
      });
    } catch (error) {
      console.error("Error ending party:", error);
    }
  }, [navigate, user]);

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
      drop-shadow-lg gap-[8px] pt-[24px] relative"
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
