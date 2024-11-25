import React from "react";
import Logo from "@components/Logo";
import BtnYellow from "@components/BtnYellow";
import BtnClose from "@components/BtnClose";
import ImgFriend from "@images/whawha.jpg";
import { useState, useEffect } from "react";
import { useUserAuth } from "../../context/AuthContext";
import {
  setDoc,
  doc,
  getDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InvitePartyModal({
  onClose,
  onInviteFriend,
  selectedFriends,
}) {
  const { user } = useUserAuth();
  const [phone, setPhone] = useState("");
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userDoc = doc(db, "users", user.uid);
      const userData = await getDoc(userDoc);
      const userPhone = userData.data()?.phone;
      setPhone(userPhone);

      const friendsRef = collection(db, "friends");
      const q = query(friendsRef);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (doc.data().friendships?.includes(userPhone)) {
          setFriends((prev) => [...prev, doc.id]);
        }
      });
    };
    fetchData();
  }, [user.uid]);

  const handleRemoveFriend = (friendPhone) => {
    setFriends((prev) => prev.filter((phone) => phone !== friendPhone));
  };

  const handleInvitedFriend = (friendData) => {
    if (selectedFriends.length >= 4) {
      toast.error("สามารถเลือกเพื่อนได้สูงสุด 4 คนเท่านั้น");
      return;
    }

    onInviteFriend(friendData);
    setFriends((prev) => prev.filter((phone) => phone !== friendData.phone));
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="md:w-[426px] md:h-[332px] sm:w-[322px] sm:h-[292px] md:px-[48px] md:py-[38px] sm:px-[38px] sm:py-[30px] bg-neutral-white-100 rounded-3xl overflow-hidden shadow-main-shadow relative">
          <BtnClose
            className="md:size-[16px] sm:size-[14px]"
            onClick={onClose}
          />
          <div className="flex flex-col h-full">
            <h3 className="md:text-h3-bold sm:text-h4-bold text-neutral-black-800 md:mb-[30px] sm:mb-[28px]">
              เชิญเพื่อนเข้าปาร์ตี้ ({selectedFriends.length}/4)
            </h3>
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
              <div className="flex flex-col items-center gap-[18px]">
                {friends.map((friendPhone, index) => (
                  <InviteItem
                    key={`${friendPhone}-${index}`}
                    phone={friendPhone}
                    currentUserPhone={phone}
                    onInvited={handleInvitedFriend}
                    disabled={selectedFriends.length >= 4}
                    selectedFriends={selectedFriends}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const InviteItem = ({
  phone,
  currentUserPhone,
  onInvited,
  disabled,
  selectedFriends,
}) => {
  const [friendData, setFriendData] = useState({
    name: "",
    profileImageURL: "",
    partyRequest: [],
    party: null,
  });

  useEffect(() => {
    const getFriendData = async () => {
      const isAlreadyInvited = selectedFriends.some(
        (friend) => friend.phone === phone
      );
      if (isAlreadyInvited) {
        return;
      }

      const usersRef = collection(db, "users");
      const friendRef = doc(db, "friends", phone);

      const q = query(usersRef, where("phone", "==", phone));
      const querySnapshot = await getDocs(q);
      const friendDoc = await getDoc(friendRef);

      querySnapshot.forEach((doc) => {
        setFriendData({
          name: doc.data().name || "ไม่ระบุชื่อ",
          profileImageURL: doc.data().profileImageURL || ImgFriend,
          partyRequest: friendDoc.data()?.partyRequest || [],
          party: doc.data().party || null,
        });
      });
    };
    getFriendData();
  }, [phone, currentUserPhone, selectedFriends]);

  if (selectedFriends.some((friend) => friend.phone === phone)) {
    return null;
  }

  const handleInvite = async () => {
    if (disabled) {
      toast.error("สามารถเลือกเพื่อนได้สูงสุด 4 คนเท่านั้น");
      return;
    }

    if (friendData.party) {
      toast.error("เพื่อนคนนี้มีปาร์ตี้อยู่แล้ว");
      return;
    }

    try {
      onInvited({
        phone: phone,
        name: friendData.name,
        profileImageURL: friendData.profileImageURL,
      });
    } catch (error) {
      console.error("Error sending party invite:", error);
    }
  };

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          className="md:size-[54px] sm:size-[46px] border-neutral-white-500 object-cover rounded-full p-[2px] border-2"
          src={friendData.profileImageURL}
          alt={friendData.name}
        />
        <h4 className="md:w-[96px] sm:w-[90px] text-h4-bold text-neutral-black-800 truncate">
          {friendData.name}
        </h4>
      </div>
      <button
        className={`xl:px-[34px] md:px-[28px] sm:px-[20px] py-[4px] rounded-xl ${
          disabled || friendData.party
            ? "bg-neutral-white-400 cursor-not-allowed"
            : "bg-success-400 cursor-pointer"
        }`}
        onClick={handleInvite}
        disabled={disabled || friendData.party}
      >
        <h4 className="text-h4-bold text-neutral-white-100">เชิญ</h4>
      </button>
    </div>
  );
};
