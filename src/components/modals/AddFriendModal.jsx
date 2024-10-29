import React, { useState, useEffect } from "react";
import InputLabel from "@components/InputLabel";
import BtnYellow from "@components/BtnYellow";
import BtnClose from "@components/BtnClose";
import { setDoc, doc, getDoc, arrayUnion } from "firebase/firestore";
import { useUserAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { ToastContainer, toast } from "react-toastify";
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

  const handleAddFriend = async (e) => {
    e.preventDefault();
    await setDoc(
      doc(db, "friendships", phone),
      {
        phone: arrayUnion(addPhone),
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
                onChange={(e) => setAddPhone(e.target.value)}
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
