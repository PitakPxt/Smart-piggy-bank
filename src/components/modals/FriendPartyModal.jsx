import React, { useState, useEffect, useRef } from "react";
import BtnYellow from "@components/BtnYellow";
import ImgFriend from "@images/whawha.jpg";
import DeleteIcon from "@images/icon-delete.svg";
import AcceptIcon from "@images/icon-accept.svg";
import RefuseIcon from "@images/icon-refuse.svg";
import AddFriendModal from "@components/modals/AddFriendModal";
import { useUserAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";
export default function FriendPartyModal() {
  const [activeTab, setActiveTab] = useState("friends");
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [phone, setPhone] = useState("");

  const handleAddFriendClick = () => {
    setShowAddFriendModal(true);
  };

  return (
    <>
      <div
        className="z-[99] absolute button-0 -left-1/2 -translate-x-1/2 w-[374px] h-[614px] bg-neutral-white-100 rounded-3xl 
      overflow-hidden drop-shadow-lg "
      >
        <div className="size-auto px-6 py-[18px] flex flex-col items-center justify-center ">
          <div className="flex px-[6px] py-[4px] bg-neutral-white-200 gap-4 justify-between items-center rounded-xl mb-[18px]">
            <div className="flex flex-1/2">
              <h4
                className={`text-h4-bold px-[16px] py-[12px] rounded-xl cursor-pointer ${
                  activeTab === "friends"
                    ? "text-neutral-white-100 bg-secondary-600"
                    : "text-secondary-500"
                }`}
                onClick={() => setActiveTab("friends")}
              >
                เพื่อนทั้งหมด
              </h4>
            </div>
            <div className="flex flex-1/2">
              <h4
                className={`text-h4-bold px-[16px] py-[12px] rounded-xl cursor-pointer ${
                  activeTab === "invitesParty"
                    ? "text-neutral-white-100 bg-secondary-600"
                    : "text-secondary-500"
                }`}
                onClick={() => setActiveTab("invitesParty")}
              >
                คำเชิญเข้าปาร์ตี้
              </h4>
            </div>
          </div>

          {activeTab === "friends" && (
            <BtnYellow
              onClick={handleAddFriendClick}
              className="w-[274px] text-h3-bold text-black text-center mb-5"
              text="เพิ่มเพื่อน!"
            />
          )}

          {activeTab === "friends" && (
            <>
              <div className="w-full flex flex-col">
                <h4 className="text-h4-bold text-neutral-black-800 mb-[14px]">
                  เพื่อน
                </h4>
                <div className="w-full flex flex-col gap-4">
                  <FriendItem name="Whawha" src={ImgFriend} />
                  <FriendItem name="Whawha" src={ImgFriend} />
                  <span className="h-[1px] w-full bg-neutral-white-500 mb-[16px]"></span>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <h4 className="text-h4-bold text-neutral-black-800 mb-[14px]">
                  คำขอเป็นเพื่อน
                </h4>
                <div className="w-full flex flex-col gap-4">
                  <FriendRequestItem name="Whawha" src={ImgFriend} />
                </div>
              </div>
            </>
          )}

          {activeTab === "invitesParty" && (
            <div className="w-full flex flex-col">
              <h4 className="text-h4-bold text-neutral-black-800 mb-[14px]">
                คำเชิญเข้าร่วมปาร์ตี้
              </h4>
              <div className="w-full flex flex-col gap-4">
                <FriendRequestItem name="Wha" src={ImgFriend} />
                <FriendRequestItem name="Wha" src={ImgFriend} />
                <FriendRequestItem name="Wha" src={ImgFriend} />
              </div>
            </div>
          )}
        </div>
      </div>
      {showAddFriendModal && (
        <AddFriendModal onClose={() => setShowAddFriendModal(false)} />
      )}
    </>
  );
}

//เพื่อนที่เรามี
const FriendItem = ({ name, src }) => {
  return (
    <div className="flex items-center gap-3 rounded-full justify-between">
      <UserItem name={name} src={src} />
      <img src={DeleteIcon} alt="" />
    </div>
  );
};

//คำขอเป็นเพื่อน
const FriendRequestItem = ({ name, src }) => {
  const { user } = useUserAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchUserPhoneAndRequests = async () => {
      try {
        // ดึงเบอร์โทรของผู้ใช้ที่ล็อกอิน
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          const phone = userData.data().phone;
          setUserPhone(phone);
          console.log("userPhone", phone);

          // ดึงข้อมูล friendsRequest จาก document ที่ตรงกับเบอร์โทร
          const friendDoc = doc(db, "friends", phone);
          const friendData = await getDoc(friendDoc);

          if (friendData.exists()) {
            // ดึง array ของ friendsRequest
            const requests = friendData.data().friendsRequest || [];
            setFriendRequests(requests);
            console.log("Friend requests:", requests);
          }
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        toast.error("ไม่สามารถดึงข้อมูลคำขอเป็นเพื่อนได้");
      }
    };

    fetchUserPhoneAndRequests();
  }, [user.uid]);

  const handleAcceptFriendRequest = async (requestPhone) => {
    try {
      // เพิ่มเข้า friendships
      const friendDoc = doc(db, "friends", userPhone);
      await updateDoc(friendDoc, {
        friendships: arrayUnion(requestPhone),
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("ไม่สามารถยอมรับคำขอเป็นเพื่อนได้");
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-full justify-between">
      <UserItem name={name} src={src} />
      <div className="flex gap-2">
        <img
          className="px-[24px] py-[8px] bg-success-400 rounded-xl"
          src={AcceptIcon}
          alt=""
          onClick={() => handleAcceptFriendRequest(name)}
        />
        <img
          className="px-[24px] py-[8px] bg-error-400 rounded-xl"
          src={RefuseIcon}
          alt=""
        />
      </div>
    </div>
  );
};

//ชื่อผู้ใช้ รูปภาพและชื่อผู้ใช้
const UserItem = ({ name, src }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        className="size-[54px] border-neutral-white-500 object-cover rounded-full p-[2px] border-2"
        src={src}
        alt=""
      />
      <h4 className="w-[96px] text-h4-bold text-neutral-black-800 truncate">
        : {name}
      </h4>
    </div>
  );
};
