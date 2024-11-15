import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../lib/firebase";
import SquarePen from "@images/square-pen.svg";
import InputLabel from "../InputLabel";
import BtnYellow from "../BtnYellow";
import DefaultProfile from "@images/default-Profile.svg";
import Bin from "@images/Bin.svg";
import BtnClose from "../BtnClose";
import NotFoundModal from "../../components/modals/NotFoundModal";
import LogoLoading from "/lottie/loading.lottie";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import { off } from "firebase/database";

export default function ChangeProfileModal({ onClose, onUpdate }) {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    savingNumber: "",
  });
  const [newImage, setNewImage] = useState(null);
  const auth = getAuth();
  const [isLoading, setIsLoading] = useState(false);

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          savingNumber: data.savingNumber || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const checkDuplicateData = async (data) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef);
      const querySnapshot = await getDocs(q);

      let duplicateFields = [];

      querySnapshot.docs.forEach((doc) => {
        const userData = doc.data();
        if (doc.id !== auth.currentUser.uid) {
          if (userData.savingNumber === data.savingNumber) {
            duplicateFields.push("รหัสกระปุก");
          }
          if (userData.phone === data.phone) {
            duplicateFields.push("เบอร์โทรศัพท์");
          }
          if (userData.name === data.name) {
            duplicateFields.push("ชื่อ");
          }
        }
      });

      return duplicateFields;
    } catch (error) {
      console.error("Error checking duplicate:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // ตรวจสอบข้อมูลซ้ำ
      const duplicateFields = await checkDuplicateData(formData);
      if (duplicateFields.length > 0) {
        toast.error(`ข้อมูลซ้ำ: ${duplicateFields.join(", ")}`);
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        savingNumber: formData.savingNumber,
      };

      if (newImage) {
        if (
          userData.profileImageURL &&
          !userData.profileImageURL.includes("default")
        ) {
          const oldImageRef = ref(storage, userData.profileImageURL);
          await deleteObject(oldImageRef);
        }

        const imageRef = ref(storage, `profileImages/${auth.currentUser.uid}`);
        await uploadBytes(imageRef, newImage);
        const imageUrl = await getDownloadURL(imageRef);
        updateData.profileImageURL = imageUrl;
      } else if (userData.profileImageURL !== DefaultProfile && !newImage) {
        if (!userData.profileImageURL.includes("default")) {
          const oldImageRef = ref(storage, userData.profileImageURL);
          await deleteObject(oldImageRef);
        }
        updateData.profileImageURL = DefaultProfile;
      }

      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === "") {
          delete updateData[key];
        }
      });

      await updateDoc(userRef, updateData);
      toast.success("อัพเดทข้อมูลสำเร็จ");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsLoading(true);
      setUserData({
        ...userData,
        profileImageURL: DefaultProfile,
      });
      setNewImage(null);
    } catch (error) {
      console.error("Error removing image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
      {isLoading ? (
        <NotFoundModal
          src={LogoLoading}
          text="กำลังโหลดข้อมูล..."
          className="h-[220px]"
          showBackButton={false}
        />
      ) : (
        <div className="w-[540px] h-[800px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center">
          <div className="flex flex-col w-[436px] items-center pt-[42px]">
            <div className="self-end mr-[42px]" onClick={onClose}>
              <BtnClose />
            </div>

            <h2 className="text-h2-bold text-neutral-black-800 mb-[28px]">
              โปรไฟล์
            </h2>

            <img
              className="size-[276px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2 mb-[22px]"
              src={
                newImage
                  ? URL.createObjectURL(newImage)
                  : userData?.profileImageURL || DefaultProfile
              }
              alt=""
            />

            <div className="flex gap-[56px] mb-[26px]">
              <label className="flex gap-[10px] items-center px-6 py-2 bg-primary-500 rounded-xl cursor-pointer">
                <img src={SquarePen} alt="" />
                <h4 className="text-h4-bold text-neutral-black-800">เปลี่ยน</h4>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
              <button
                className="flex gap-[10px] items-center px-6 py-2 bg-primary-500 rounded-xl"
                onClick={handleRemoveImage}
              >
                <img src={Bin} alt="" />
                <h4 className="text-h4-bold text-neutral-black-800">นำออก</h4>
              </button>
            </div>

            <div className="flex flex-col gap-[10px] mb-[26px] w-full">
              <InputLabel
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                text="ชื่อ :"
                placeHolder=""
                isInline={true}
                isEye={false}
              />
              <InputLabel
                name="savingNumber"
                value={formData.savingNumber}
                onChange={handleInputChange}
                text="รหัสกระปุก :"
                placeHolder=""
                isInline={true}
                isEye={false}
              />
              <InputLabel
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                text="เบอร์โทรศัพท์ :"
                placeHolder=""
                isInline={true}
                isEye={false}
              />
            </div>

            <BtnYellow
              className="px-8 py-3"
              text="บันทึก"
              onClick={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
