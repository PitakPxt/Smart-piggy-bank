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
      className={`xl:w-[680px] xl:h-[100px] md:w-[640px] md:h-[100px] sm:w-[308px] sm:h-[60px] flex items-center justify-between ${
        bgColors[rank] || bgColors.default
      } sm:rounded-[12px]`}
    >
      <div className="flex items-center">
        {rank <= 3 && (
          <img
            className="xl:size-[82px] md:size-[76px] sm:size-[48px] border-neutral-white-500 object-cover mr-[24px] absolute xl:ml-[36px] md:ml-[24px] sm:ml-[12px]"
            src={player.rankImage}
            alt={`Rank ${rank}`}
          />
        )}
        <div className="flex items-center xl:gap-[24px] md:gap-[18px] sm:gap-[8px]">
          <img
            className="xl:size-[84px] md:size-[82px] sm:size-[52px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 xl:ml-[142px] md:ml-[108px] sm:ml-[68px]"
            src={player.avatar}
            alt={player.name}
          />
          <h2 className="md:text-h2-bold xl:w-[120px] md:w-[150px] sm:w-[55px] sm:text-h5-bold truncate">
            {player.name}
          </h2>
        </div>
      </div>
      <div className="flex items-center xl:mr-[48px] md:mr-[36px] sm:mr-[18px] md:gap-[24px] sm:gap-[12px]">
        <div className="xl:w-[120px] md:w-[130px] sm:w-[60px] flex justify-end">
          <h2 className="md:text-h2-bold sm:text-h5-bold">{player.amount} ฿</h2>
        </div>
        <div className="md:w-[32px] sm:w-[20px]">
          {canDelete && (
            <img
              className="md:size-[32px] sm:size-[18px] cursor-pointer"
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
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPartyEnded, setIsPartyEnded] = useState(false);
  const [isPartyCreator, setIsPartyCreator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const timerRef = useRef(null);

  const calculateTimeLeft = useCallback((createdAt, totalDays) => {
    const endDate = new Date(createdAt);
    endDate.setDate(endDate.getDate() + totalDays);
    const currentDate = new Date();
    const timeDiff = endDate - currentDate;

    if (timeDiff <= 0) {
      setIsPartyEnded(true);
      handleEndParty();
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    setIsPartyEnded(false);
    return {
      days: Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
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
      });

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
    if (!partyData) return;

    timerRef.current = setInterval(() => {
      const createdAt = partyData.createdAt.toDate();
      const totalDays = parseInt(partyData.days);
      // console.log(createdAt, totalDays);
      const newTimeLeft = calculateTimeLeft(createdAt, totalDays);
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [partyData]);

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
    if (!user) return;
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
  }, [navigate, user, isPartyEnded]);

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
        className="flex flex-col justify-start items-center bg-neutral-white-100 rounded-3xl overflow-hidden
      shadow-main-shadow gap-[8px] md:pt-[28px] sm:pt-[38px] relative
      xl:w-[768px] xl:h-[814px] 
      lg:w-[736px] lg:h-[646px]
      md:w-[676px] md:h-[856px] 
      sm:w-[344px] sm:h-[542px]"
      >
        <Link to="/home">
          <BtnBack />
        </Link>
        <div className="text-center items-center">
          <div className="flex flex-col">
            <h2 className="md:text-h2-bold sm:text-h4-bold">
              เป้าหมาย : {partyData?.target || 0} บาท
            </h2>
            <h2 className="md:text-h2-bold sm:text-h4-bold">
              ปาร์ตี้ : {partyData?.partyName}
            </h2>
            <h3 className="md:text-h3 sm:text-h5">
              เวลาที่เหลือ {timeLeft.days} วัน {timeLeft.hours} ชั่วโมง{" "}
              {timeLeft.minutes} นาที {timeLeft.seconds} วินาที
            </h3>
          </div>
        </div>
        <div className="md:w-[680px] sm:w-[308px] justify-center items-center flex-grow">
          <ul className="flex flex-col gap-[8px] items-center">
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
            className="px-[32px] py-[6px] absolute bottom-[24px] bg-transparent border-2 border-error-300 text-error-300 md:text-h3-bold sm:text-h5-bold
            rounded-[12px] drop-shadow-lg hover:border-error-200 hover:bg-error-200 hover:text-neutral-white-100 cursor-pointer"
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
