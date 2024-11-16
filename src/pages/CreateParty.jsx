import React from "react";
import BtnBack from "../components/BtnBack";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";
import LogoDelete from "../assets/images/delete-Player.png";
import IconPlus from "../assets/images/icon-plus.svg";
import InvitePartyModal from "../components/modals/InvitePartyModal";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUserAuth } from "../context/AuthContext";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function CreateParty() {
  const [nameParty, setNameParty] = useState("");
  const [target, setTarget] = useState("");
  const [days, setDays] = useState("");
  const [showInvitePartyModal, setShowInvitePartyModal] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState([]);
  const [name, setName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [hasParty, setHasParty] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          const userName = userData.data().name;
          const userPhone = userData.data().phone;
          const userParty = userData.data().party;
          setName(userName);
          setUserPhone(userPhone);

          if (userParty) {
            setHasParty(true);
            navigate("/party");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    };

    fetchUserData();
  }, [user]);

  const handleShowInvitePartyModal = () => {
    setShowInvitePartyModal(true);
  };

  const handleCreateParty = async () => {
    try {
      await setDoc(doc(db, "party", name), {
        members: [user.uid],
        partyName: nameParty,
        target: Number(target),
        days: days,
        createdAt: new Date(),
        createdBy: name,
        status: "proress",
      });

      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        party: name,
      });

      invitedFriends.forEach((friend) => {
        const friendRef = doc(db, "friends", friend.phone);
        updateDoc(friendRef, {
          partyRequest: arrayUnion(name),
        });
      });

      toast.success("สร้างปาร์ตี้สำเร็จ");
      navigate("/party");
    } catch (error) {
      console.error("Error creating party:", error);
      toast.error("เกิดข้อผิดพลาดในการสร้างปาร์ตี้");
    }
  };

  const handleInviteFriend = (friendData) => {
    const newFriends = Array.isArray(friendData) ? friendData : [friendData];
    setInvitedFriends((prev) => [...prev, ...newFriends]);
    toast.success("เพิ่มเพื่อนสำเร็จ");
  };

  const handleRemoveFriend = (phoneToRemove) => {
    setInvitedFriends((prev) =>
      prev.filter((friend) => friend.phone !== phoneToRemove)
    );
    toast.success("ลบเพื่อนสำเร็จ");
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[756px] h-[740px] flex flex-col justify-center items-center
            bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <Link to="/home">
            <BtnBack />
          </Link>
          <div className="w-[520px] h-full flex flex-col justify-center items-center mt-[20px]">
            <div className="flex flex-col w-full gap-[18px] mb-[52px]">
              <h2 className="text-h2-bold text-center">สร้างปาร์ตี้</h2>
              <InputLabel
                InputLabel
                className={"w-full"}
                text="ชื่อปาร์ตี้ :"
                placeHolder="ชื่อปาร์ตี้"
                required={true}
                isEye={false}
                autoComplete="off"
                value={nameParty}
                onChange={(e) => setNameParty(e.target.value)}
              />
              <InputLabel
                className="w-full"
                text="กำหนดเป้าหมาย (บาท) :"
                placeHolder="กำหนดเป้าหมาย"
                required={true}
                isEye={false}
                autoComplete="off"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <InputLabel
                className={"w-full"}
                text="ระยะเวลาในการแข่งขัน (วัน) : "
                placeHolder="กรอกระยะเวลาในการแข่งขัน"
                required={true}
                isEye={false}
                autoComplete="off"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <div>
                <h3 className="text-h3-bold mb-[10px]">เชิญเพื่อน : </h3>
                <ul className="flex flex-wrap gap-[16px] ">
                  {invitedFriends.map((friend) => (
                    <li
                      key={friend.phone}
                      className="flex flex-col items-center relative w-[68px] h-[68px]"
                    >
                      <div
                        className="absolute -right-0 -top-0 z-5 cursor-pointer size-[20px] bg-neutral-white-100 rounded-full"
                        onClick={() => handleRemoveFriend(friend.phone)}
                      >
                        <img src={LogoDelete} alt="delete" />
                      </div>
                      <img
                        className="w-full h-full p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
                        src={friend.profileImageURL}
                        alt={friend.name}
                      />
                    </li>
                  ))}
                  {addFriendButton(IconPlus, handleShowInvitePartyModal)}
                </ul>
              </div>
            </div>
            <BtnYellow
              className={"px-[156px]"}
              text={"สร้างปาร์ตี้"}
              onClick={handleCreateParty}
            />
            {showInvitePartyModal && (
              <InvitePartyModal
                onClose={() => setShowInvitePartyModal(false)}
                onInviteFriend={handleInviteFriend}
                selectedFriends={invitedFriends}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function addFriendButton(src, onClickHandler) {
  return (
    <div
      className="w-[66px] h-[66px] flex justify-center items-center rounded-full 
    border-2 border-neutral-white-500 bg-neutral-white-100 cursor-pointer "
      onClick={onClickHandler}
    >
      <img className="size-[26px]" src={src} />
    </div>
  );
}
