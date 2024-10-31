import React, { useState, useEffect, useRef } from "react";
import BtnYellow from "@components/BtnYellow";
import ImgFriend from "@images/whawha.jpg";
import DeleteIcon from "@images/icon-delete.svg";
import AcceptIcon from "@images/icon-accept.svg";
import RefuseIcon from "@images/icon-refuse.svg";
import AddFriendModal from "@components/modals/AddFriendModal";
import { useUserAuth } from "../../context/AuthContext";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
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
            <>
              <BtnYellow
                onClick={handleAddFriendClick}
                className="w-[274px] text-h3-bold text-black text-center mb-5"
                text="เพิ่มเพื่อน!"
              />
              <FriendList />
              <div className="w-full flex flex-col">
                <h4 className="text-h4-bold text-neutral-black-800 mb-[14px]">
                  คำขอเป็นเพื่อน
                </h4>
                <div className="w-full flex flex-col gap-4">
                  <FriendRequestItem />
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

////////////////////////////////////////////////////////////
//เพื่อนที่เรามี
////////////////////////////////////////////////////////////

const FriendItem = ({ name, src, phone, userPhone }) => {
  const handleDeleteFriend = async () => {
    try {
      // ลบเพื่อนออกจากรายการของเรา
      const myFriendDoc = doc(db, "friends", userPhone);
      const myFriendData = await getDoc(myFriendDoc);

      if (myFriendData.exists()) {
        const currentFriendships = myFriendData.data().friendships || [];
        await updateDoc(myFriendDoc, {
          friendships: currentFriendships.filter((friend) => friend !== phone),
        });
      }

      // ลบเราออกจากรายการเพื่อนของเขา
      const theirFriendDoc = doc(db, "friends", phone);
      const theirFriendData = await getDoc(theirFriendDoc);

      if (theirFriendData.exists()) {
        const theirFriendships = theirFriendData.data().friendships || [];
        await updateDoc(theirFriendDoc, {
          friendships: theirFriendships.filter(
            (friend) => friend !== userPhone
          ),
        });
      }

      toast.success("ลบเพื่อนสำเร็จ");
    } catch (error) {
      console.error("Error deleting friend:", error);
      toast.error("ไม่สามารถลบเพื่อนได้");
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-full justify-between">
      <UserItem name={name} src={src} />
      <img
        src={DeleteIcon}
        alt="ลบเพื่อน"
        className="cursor-pointer"
        onClick={handleDeleteFriend}
      />
    </div>
  );
};

////////////////////////////////////////////////////////////
//คำขอเป็นเพื่อน
////////////////////////////////////////////////////////////
const FriendRequestItem = ({ name, src }) => {
  const { user } = useUserAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchUserPhoneAndRequests = async () => {
      try {
        // ดึงเบอร์โทรของผู้ช้ที่ล็อกอิน
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          const phone = userData.data().phone;
          setUserPhone(phone);

          // ดึงข้อมูล friendsRequest
          const friendDoc = doc(db, "friends", phone);
          const friendData = await getDoc(friendDoc);

          if (friendData.exists()) {
            const requests = friendData.data().friendsRequest || [];

            // ดึงข้อมูลผู้ใช้สำหรับแต่ละ request
            const requestsWithUserData = await Promise.all(
              requests.map(async (requestPhone) => {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("phone", "==", requestPhone));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                  const requestUserData = querySnapshot.docs[0].data();
                  return {
                    phone: requestPhone,
                    name: requestUserData.name,
                    profileImage: requestUserData.profileImageURL,
                  };
                }
                return {
                  phone: requestPhone,
                  name: requestPhone,
                  profileImage: ImgFriend,
                };
              })
            );

            setFriendRequests(requestsWithUserData);
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
      // เช็คและอัพเดทข้อมูลของผู้ใช้ที่กดยอมรับ
      const myFriendDoc = doc(db, "friends", userPhone);
      const myFriendSnapshot = await getDoc(myFriendDoc);

      if (!myFriendSnapshot.exists()) {
        // สร้างเอกสารใหม่ถ้ายังไม่มี
        await setDoc(myFriendDoc, {
          friendships: [requestPhone],
          friendsRequest: friendRequests
            .filter((request) => request.phone !== requestPhone)
            .map((request) => request.phone),
        });
      } else {
        // อัพเดทเอกสารที่มีอยู่
        await updateDoc(myFriendDoc, {
          friendships: arrayUnion(requestPhone),
          friendsRequest: friendRequests
            .filter((request) => request.phone !== requestPhone)
            .map((request) => request.phone),
        });
      }

      // เช็คและอัพเดทข้อมูลของผู้ที่ส่งคำขอ
      const theirFriendDoc = doc(db, "friends", requestPhone);
      const theirFriendSnapshot = await getDoc(theirFriendDoc);

      if (!theirFriendSnapshot.exists()) {
        // สร้างเอกสารใหม่ถ้ายังไม่มี
        await setDoc(theirFriendDoc, {
          friendships: [userPhone],
          friendsRequest: [],
        });
      } else {
        // อัพเดทเอกสารที่มีอยู่
        await updateDoc(theirFriendDoc, {
          friendships: arrayUnion(userPhone),
        });
      }

      // อัพเดท state
      setFriendRequests((prevRequests) =>
        prevRequests.filter((request) => request.phone !== requestPhone)
      );

      toast.success("ยอมรับคำขอเป็นเพื่อนสำเร็จ");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      toast.error("ไม่สามารถยอมรับคำขอเป็นเพื่อนได้");
    }
  };

  const handleRefuseFriendRequest = async (requestPhone) => {
    try {
      // อัพเดทข้อมูลของผู้ใช้ที่กดปฏิเสธ
      const myFriendDoc = doc(db, "friends", userPhone);
      const myFriendSnapshot = await getDoc(myFriendDoc);

      if (myFriendSnapshot.exists()) {
        // อัพเดท friendsRequest โดยลบเบอร์ที่เราปฏิเสธออก
        await updateDoc(myFriendDoc, {
          friendsRequest: friendRequests
            .filter((request) => request.phone !== requestPhone)
            .map((request) => request.phone),
        });

        // อัพเดท state
        setFriendRequests((prevRequests) =>
          prevRequests.filter((request) => request.phone !== requestPhone)
        );

        toast.success("ปฏิเสธคำขอเป็นเพื่อนสำเร็จ");
      }
    } catch (error) {
      console.error("Error refusing friend request:", error);
      toast.error("ไม่สามารถปฏิเสธคำขอเป็นเพื่อนได้");
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {friendRequests.map((request, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-full justify-between"
        >
          <UserItem
            name={request.name}
            src={request.profileImage || ImgFriend}
          />
          <div className="flex gap-2">
            <img
              className="px-[18px] py-[8px] bg-success-400 rounded-xl cursor-pointer"
              src={AcceptIcon}
              onClick={() => handleAcceptFriendRequest(request.phone)}
            />
            <img
              className="px-[18px] py-[8px] bg-error-400 rounded-xl cursor-pointer"
              src={RefuseIcon}
              onClick={() => handleRefuseFriendRequest(request.phone)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

const FriendList = () => {
  const { user } = useUserAuth();
  const [friends, setFriends] = useState([]);
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // ดึงเบอร์โทรของผู้ใช้ที่ล็อกอิน
        const userDoc = doc(db, "users", user.uid);
        const userData = await getDoc(userDoc);

        if (userData.exists()) {
          const phone = userData.data().phone;
          setUserPhone(phone);

          // ดึงข้อมูล friendships
          const friendDoc = doc(db, "friends", phone);
          const friendData = await getDoc(friendDoc);

          if (friendData.exists()) {
            const friendships = friendData.data().friendships || [];

            // ดึงข้อมูลผู้ใช้สำหรับแต่ละเพื่อน
            const friendsWithData = await Promise.all(
              friendships.map(async (friendPhone) => {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("phone", "==", friendPhone));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                  const friendData = querySnapshot.docs[0].data();
                  return {
                    phone: friendPhone,
                    name: friendData.name,
                    profileImage: friendData.profileImageURL || ImgFriend,
                  };
                }
                return {
                  phone: friendPhone,
                  name: friendPhone,
                  profileImage: ImgFriend,
                };
              })
            );

            setFriends(friendsWithData);
          }
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
        toast.error("ไม่สามารถดึงข้อมูลเพื่อนได้");
      }
    };

    fetchFriends();
  }, [user.uid]);

  return (
    <div className="w-full flex flex-col">
      <h4 className="text-h4-bold text-neutral-black-800 mb-[14px]">เพื่อน</h4>
      <div className="w-full flex flex-col gap-4">
        {friends.map((friend, index) => (
          <FriendItem
            key={index}
            name={friend.name}
            src={friend.profileImage}
            phone={friend.phone}
            userPhone={userPhone}
          />
        ))}
        <span className="h-[1px] w-full bg-neutral-white-500 mb-[16px]"></span>
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////
//ชื่อผู้ใช้ รูปภาพและชื่อผู้ใช้
////////////////////////////////////////////////////////////
const UserItem = ({ name, src }) => {
  return (
    <div className="flex items-center gap-3">
      <img
        className="size-[54px] border-neutral-white-500 object-cover rounded-full p-[2px] border-2"
        src={src}
        alt=""
      />
      <h4 className="w-[125px] text-h4-bold text-neutral-black-800 truncate">
        : {name}
      </h4>
    </div>
  );
};
