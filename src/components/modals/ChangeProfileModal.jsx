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
import InputLabel from "../InputLabel";
import BtnYellow from "../BtnYellow";
import DefaultProfile from "@images/default-Profile.svg";
import BtnClose from "../BtnClose";
import NotFoundModal from "../../components/modals/NotFoundModal";
import LogoLoading from "/lottie/loading.lottie";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

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

        // ฟอร์แมตเบอร์โทรศัพท์ตั้งแต่ดึงข้อมูล
        const formattedPhone = data.phone
          ? data.phone
              .replace(/\D/g, "")
              .replace(/^(\d{3})(\d{3})(\d{4}).*/, "$1-$2-$3")
              .slice(0, 12)
          : "";

        setUserData(data);
        setFormData({
          name: data.name || "",
          phone: formattedPhone,
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

    if (name === "savingNumber") {
      if (!/^\d*$/.test(value) || value.length > 5) {
        return;
      }
    }

    if (name === "phone") {
      // เก็บเฉพาะตัวเลข
      const numbersOnly = value.replace(/\D/g, "");

      // ตรวจสอบความยาว่เกิน 10 หัก
      if (numbersOnly.length <= 10) {
        // ฟอร์แมตเบอร์โทร
        const formattedPhone = numbersOnly
          .replace(/(\d{3})(?=\d)/, "$1-")
          .replace(/(\d{3})(?=\d)/, "$1-");

        setFormData({
          ...formData,
          [name]: formattedPhone,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const checkDuplicateData = async (data) => {
    try {
      // ตรวจสอบในคอลเลคชัน collection ก่อน
      const collectionRef = collection(db, "collection");
      const docRef = doc(collectionRef, data.phone.replace(/-/g, "")); // ใช้เบอร์โทรเป็น id
      const docSnap = await getDoc(docRef);

      // ถ้าเจอเบอร์โทรในระบบ ต้องตรวจสอบว่า savingNumber ตรงกันไหม
      if (docSnap.exists()) {
        if (docSnap.data().savingNumber !== data.savingNumber) {
          toast.error(
            "หมายเลขกระปุกออมสินไม่ตรงกับเบอร์โทรศัพท์ที่ลงทะเบียนไว"
          );
          return;
        }
      } else {
        toast.error("ไม่พบข้อมูลการลงทะเบียนกระปุกออมสินของเบอร์โทรศัพท์นี้");
        return ["ไม่พบข้อมูลการลงทะเบียนกระปุกออมสินของเบอร์โทรศัพท์นี้"];
      }

      return [];
    } catch (error) {
      return;
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // ตรวจสอบข้อมูลซ้ำ
      const duplicateFields = await checkDuplicateData(formData);
      if (duplicateFields.length > 0) {
        return;
      }

      const userRef = doc(db, "users", auth.currentUser.uid);
      const updateData = {
        name: formData.name,
        phone: formData.phone.replace(/-/g, ""),
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
      }

      await updateDoc(userRef, updateData);
      toast.success("อัพเดทข้อมูลสำเร็จ");
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
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
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px] bg-black/20 z-[100]">
        {isLoading ? (
          <NotFoundModal
            src={LogoLoading}
            text="กำลังโหลดข้อมูล..."
            className="h-[220px]"
            showBackButton={false}
          />
        ) : (
          <div className="xl:w-[540px] xl:h-[800px] lg:w-[540px] lg:h-[710px] md:w-[500px] md:h-[670px] sm:w-[342px] sm:h-[620px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center">
            <div className="flex flex-col md:w-[436px] sm:w-[266px] items-center pt-[42px] relative">
              <BtnClose />
              <h2 className="md:text-h2-bold sm:text-h3-bold text-neutral-black-800 mb-[28px]">
                โปรไฟล์
              </h2>

              <img
                className="xl:size-[276px] lg:size-[226px] md:size-[186px] sm:size-[186px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2 mb-[22px]"
                src={
                  newImage
                    ? URL.createObjectURL(newImage)
                    : userData?.profileImageURL || DefaultProfile
                }
                alt=""
              />

              <div className="flex gap-[56px] mb-[26px]">
                <label className="flex gap-[10px] items-center md:px-6 sm:px-4 py-2 bg-primary-500 rounded-xl cursor-pointer hover:duration-200 hover:ease-in-out hover:bg-secondary-600 hover:text-neutral-white-100 group">
                  <svg
                    className="group-hover:stroke-neutral-white-100 sm:size-[16px] md:size-[18px]"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="group-hover:fill-neutral-white-100"
                      d="M14.709 3.54949L16.9505 5.79104M16.1501 1.57476L10.0861 7.63871C9.77279 7.95159 9.55911 8.35023 9.47199 8.78437L8.91187 11.5882L11.7157 11.027C12.1498 10.9402 12.5479 10.7273 12.8613 10.4139L18.9253 4.34997C19.1075 4.16775 19.252 3.95142 19.3506 3.71333C19.4493 3.47525 19.5 3.22007 19.5 2.96237C19.5 2.70466 19.4493 2.44949 19.3506 2.2114C19.252 1.97332 19.1075 1.75699 18.9253 1.57476C18.743 1.39254 18.5267 1.24799 18.2886 1.14938C18.0505 1.05076 17.7954 1 17.5377 1C17.28 1 17.0248 1.05076 16.7867 1.14938C16.5486 1.24799 16.3323 1.39254 16.1501 1.57476Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="group-hover:stroke-neutral-white-100"
                      d="M17.3825 13.706V16.8825C17.3825 17.4442 17.1594 17.9828 16.7623 18.3799C16.3651 18.7771 15.8265 19.0002 15.2648 19.0002H3.61767C3.05603 19.0002 2.51739 18.7771 2.12025 18.3799C1.72311 17.9828 1.5 17.4442 1.5 16.8825V5.23534C1.5 4.6737 1.72311 4.13507 2.12025 3.73793C2.51739 3.34079 3.05603 3.11768 3.61767 3.11768H6.79417"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <h4 className="md:text-h4-bold sm:text-h5-bold text-neutral-black-800">
                    เปลี่ยน
                  </h4>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                <button
                  className="flex gap-[10px] items-center md:px-6 sm:px-4 py-2 bg-primary-500 rounded-xl hover:duration-200 hover:ease-in-out hover:bg-secondary-600 hover:text-neutral-white-100 group"
                  onClick={handleRemoveImage}
                >
                  <svg
                    className="group-hover:stroke-neutral-white-100 "
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="group-hover:stroke-neutral-white-100"
                      d="M21 6H4M19.333 8.5L18.873 15.4C18.696 18.054 18.608 19.381 17.743 20.19C16.878 20.999 15.547 21 12.887 21H12.113C9.453 21 8.122 21 7.257 20.19C6.392 19.381 6.303 18.054 6.127 15.4L5.667 8.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      className="group-hover:stroke-neutral-white-100"
                      d="M7 6H7.11C7.51245 5.98972 7.90242 5.85822 8.22892 5.62271C8.55543 5.3872 8.80325 5.05864 8.94 4.68L8.974 4.577L9.071 4.286C9.154 4.037 9.196 3.913 9.251 3.807C9.35921 3.59939 9.51451 3.41999 9.70448 3.28316C9.89444 3.14633 10.1138 3.05586 10.345 3.019C10.462 3 10.593 3 10.855 3H14.145C14.407 3 14.538 3 14.655 3.019C14.8862 3.05586 15.1056 3.14633 15.2955 3.28316C15.4855 3.41999 15.6408 3.59939 15.749 3.807C15.804 3.913 15.846 4.037 15.929 4.286L16.026 4.577C16.1527 4.99827 16.4148 5.36601 16.7717 5.62326C17.1285 5.88051 17.5603 6.01293 18 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>

                  <h4 className="md:text-h4-bold sm:text-h5-bold text-neutral-black-800">
                    นำออก
                  </h4>
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
                  maxLength={5}
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
    </>
  );
}
