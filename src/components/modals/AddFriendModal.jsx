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
      <div className="z-[999] w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[728px] h-[312px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-[24px]">
            <div className="flex w-[634px] justify-between items-center">
              <h3 className="text-h3-bold text-neutral-black-800">
                เพิ่มเพื่อนใหม่!!
              </h3>
              <BtnClose onClick={onClose} />
            </div>
            <div className="flex justify-center">
              <InputLabel
                onChange={(e) => setAddPhone(formatPhoneNumber(e.target.value))}
                value={addPhone}
                isEye={false}
                className="w-[512px]"
                text="เบอร์โทรศัพท์"
                placeHolder="กรอกเบอร์โทรศัพท์"
              />
            </div>
            <div className="w-full flex justify-end px-12">
              <BtnYellow
                onClick={handleAddFriend}
                className="px-[22px]"
                text="เพิ่มเพื่อน"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
