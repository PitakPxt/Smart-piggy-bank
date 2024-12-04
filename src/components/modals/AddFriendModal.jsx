import InputLabel from "@components/InputLabel";
import BtnYellow from "@components/BtnYellow";
import BtnClose from "@components/BtnClose";
import React, { useState, useEffect } from "react";
import {
  setDoc,
  doc,
  getDoc,
  arrayUnion,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useUserAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddFriendModal({ onClose }) {
  const [addPhone, setAddPhone] = useState("");
  const [phone, setPhone] = useState("");
  const { user } = useUserAuth();

  useEffect(() => {
    const fetchUserPhone = async () => {
      const userDoc = doc(db, "users", user.uid);
      const userData = await getDoc(userDoc);
      if (userData.exists()) {
        setPhone(userData.data().phone);
      }
    };
    fetchUserPhone();
  }, [user.uid]);

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`;
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();

    const formattedPhone = addPhone.replace(/-/g, "");

    const phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(formattedPhone)) {
      toast.error("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
      return;
    }

    if (formattedPhone === phone) {
      toast.error("ไม่สามารถเพิ่มเบอร์โทรศัพท์ของตัวเองได้");
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("phone", "==", formattedPhone));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("ไม่พบเบอร์โทรศัพท์นี้ในระบบ");
      return;
    }

    const friendDoc = doc(db, "friends", formattedPhone);
    const friendData = await getDoc(friendDoc);

    if (friendData.exists()) {
      const { friendships = [], friendsRequest = [] } = friendData.data();

      if (friendships.includes(phone)) {
        toast.error("คุณมีเพื่อนคนนี้อยู่แล้ว");
        return;
      }

      if (friendsRequest.includes(phone)) {
        toast.error("คุณได้ส่งคำขอเป็นเพื่อนไปแล้ว");
        return;
      }
    }

    const userFriendDoc = doc(db, "friends", phone);
    const userFriendData = await getDoc(userFriendDoc);

    if (userFriendData.exists()) {
      const { friendsRequest = [] } = userFriendData.data();

      if (friendsRequest.includes(formattedPhone)) {
        toast.error("คุณมีคำขอเป็นเพื่อนจากเบอร์นี้แล้ว");
        return;
      }
    }

    await setDoc(
      friendDoc,
      {
        friendsRequest: arrayUnion(phone),
      },
      { merge: true }
    );
    toast.success("เพิ่มเพื่อนสำเร็จ");
    onClose();
  };

  return (
    <>
      <div className="z-[999] w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px] bg-black/20">
        <div className="xl:w-[728px] xl:h-[312px] md:w-[540px] md:h-[312px] sm:w-[358px] sm:h-[180px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center relative">
          <div className="w-full flex flex-col justify-center items-center md:gap-[24px] sm:gap-[8px]">
            <BtnClose onClick={onClose} />
            <div className="flex items-start justify-start w-full md:px-12 sm:px-6">
              <h3 className="md:text-h3-bold sm:text-h5-bold text-neutral-black-800">
                เพิ่มเพื่อนใหม่!!
              </h3>
            </div>
            <div className="xl:w-[512px] lg:w-[386px] md:w-[386px] sm:w-[266px] flex justify-center">
              <InputLabel
                onChange={(e) => setAddPhone(formatPhoneNumber(e.target.value))}
                value={addPhone}
                isEye={false}
                className=""
                text="เบอร์โทรศัพท์"
                placeHolder="กรอกเบอร์โทรศัพท์"
                inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
              />
            </div>
            <div className="w-full flex justify-end md:px-12 sm:px-6">
              <BtnYellow
                onClick={handleAddFriend}
                className="md:px-[22px] sm:px-[14px] md:py-[10px] sm:py-[8px]"
                text="เพิ่มเพื่อน"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
