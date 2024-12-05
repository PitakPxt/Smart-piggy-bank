import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import DefaultProfile from "@images/default-Profile.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import {
  setDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useUserAuth } from "../context/AuthContext";
import NotFoundModal from "../components/modals/NotFoundModal";
import LogoLoading from "/lottie/loading.lottie";
import { toast } from "react-toastify";

export default function Register() {
  const { logOut } = useUserAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [savingNumber, setSavingNumber] = useState("");
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [profileImageURL, setProfileImageURL] = useState(DefaultProfile);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 100;
      if (progress > 100) progress = 100;
      setProgress(progress);
      if (progress === 100) {
        clearInterval(interval);
        setTimeout(() => setShowProgress(false), 1000);
      }
    }, 200);
  };

  const handleUpload = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
          setProfileImageURL(e.target.result);
        };
        reader.readAsDataURL(selectedFile);
        setProgress(0);
        setShowProgress(true);
        simulateUpload();
      }
    };
    fileInput.click();
  };

  const formatPhoneNumber = (value) => {
    const number = value.replace(/[^\d]/g, "");

    if (number.length <= 3) return number;
    if (number.length <= 6) return `${number.slice(0, 3)}-${number.slice(3)}`;
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6, 10)}`;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // แปลงเบอร์โทรให้เหลือแค่ตัวเลข
    const numberOnly = phone.replace(/[^\d]/g, "");

    // ตรวจสอบว่าเบอร์โทรและหมายเลขกระปุกตรงกับที่มีในระบบหรือไม่
    try {
      const collectionRef = collection(db, "collection");
      const docRef = doc(collectionRef, numberOnly);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // ถ้าเจอ document ที่มี id ตรงกับเบอร์โทร ให้เช็คว่า savingNumber ตรงกันไหม
        if (docSnap.data().savingNumber !== savingNumber) {
          toast.error(
            "หมายเลขกระปุกออมสินไม่ตรงกับเบอร์โทรศัพท์ที่ลงทะเบียนไว้"
          );
          return;
        }
      } else {
        toast.error("ไม่พบข้อมูลการลงทะเบียนกระปุกออมสินของเบอร์โทรศัพท์นี้");
        return;
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบข้อมูล กรุณาลองใหม่");
      return;
    }

    // ตรวจสอบชื่อบัญชีก่อน
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("name", "==", name));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("ชื่อบัญชีนี้ถูกใช้งานแล้ว กรุณาใช้ชื่อบัญชีอื่น");
        return;
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบชื่อบัญชี:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบชื่อบัญชี กรุณาลองใหม่");
      return;
    }

    // ตรวจสอบเบอร์โทรศัพท์
    try {
      const usersRef = collection(db, "users");
      const phoneQuery = query(usersRef, where("phone", "==", numberOnly));
      const phoneSnapshot = await getDocs(phoneQuery);

      if (!phoneSnapshot.empty) {
        toast.error("เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว");
        return;
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบเบอร์โทรศัพท์ กรุณาลองใหม่");
      return;
    }

    // ตรวจสอบอีเมล
    try {
      const usersRef = collection(db, "users");
      const emailQuery = query(usersRef, where("email", "==", email));
      const emailSnapshot = await getDocs(emailQuery);

      if (!emailSnapshot.empty) {
        toast.error("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
        return;
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล:", error);
      toast.error("เกิดข้อผิดพลาดในการตรวจสอบอีเมล กรุณาลองใหม่");
      return;
    }

    if (!file) {
      toast.error("กรุณาเลือกรูปโปรไฟล์");
      return;
    }
    setIsUploading(true);

    if (savingNumber.length !== 5) {
      toast.error("กรุณากรอกหมายเลขกระปุกให้ครบ 5 หลัก");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("กรุณากรอกอีเมลให้ถูกต้อง เช่น example@gmail.com");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      setIsVerifying(true);
      logOut();

      const checkVerification = setInterval(async () => {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(checkVerification);
          setIsVerifying(false);

          try {
            const storageRef = ref(storage, `profileImages/${user.uid}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
              "state_changed",
              (snapshot) => {
                const progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
              },
              (error) => {
                console.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:", error);
                setIsUploading(false);
              },
              async () => {
                const imageURL = await getDownloadURL(uploadTask.snapshot.ref);
                await setDoc(doc(db, "users", user.uid), {
                  name: name,
                  phone: numberOnly,
                  email: email,
                  password: password,
                  savingNumber: savingNumber,
                  profileImageURL: imageURL,
                  pin: null,
                });

                setIsUploading(false);
                navigate("/");
                logOut();
              }
            );
          } catch (error) {
            console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
            setIsUploading(false);
          }
        }
      }, 3000);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        {isVerifying ? (
          <NotFoundModal
            src={LogoLoading}
            text="กำลังรอการยืนยันอีเมล..."
            className="h-[220px]"
            showBackButton={false}
          />
        ) : (
          <form
            onSubmit={handleSubmit}
            className=" bg-neutral-white-100 rounded-3xl overflow-hidden shadow-main-shadow relative
            xl:w-[1104px] xl:h-[726px]
            lg:w-[980px] lg:h-[600px]
            md:w-[670px] md:h-[980px]
            w-[344px] h-[670px]
            "
          >
            <Link to="/">
              <BtnBack />
            </Link>
            <div className="size-full flex flex-col justify-center items-center xl:gap-[28px] md:gap-[26px] sm:gap-[18px]">
              <div
                className="w-full flex justify-center items-center xl:gap-[102px] md:gap-[24px] sm:gap-[10px] 
              xl:mb-[34px] sm:mb-[4px] lg:flex-row sm:flex-col flex-col "
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <h2 className="md:text-h2-bold sm:text-h4-bold xl:mb-[32px] md:mb-[18px] sm:mb-[14px]">
                    สมัครสมาชิก
                  </h2>
                  <div className="xl:mb-[26px] sm:mb-[12px]">
                    <img
                      className="xl:size-[276px] lg:size-[276px] md:size-[176px] sm:size-[116px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2"
                      src={profileImageURL}
                      alt="รูปโปรไฟล์"
                    />
                    {showProgress && (
                      <p className="text-h4-bold text-neutral-black-800">
                        {progress.toFixed(2)}%
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleUpload}
                    type="button"
                    className="flex gap-[10px] items-center md:px-6 md:py-2 sm:px-[18px] sm:py-1 text-neutral-white-100 bg-secondary-300 md:rounded-xl sm:rounded-lg hover:duration-200 hover:ease-in-out hover:bg-secondary-600"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.2092 3.54949L16.4508 5.79104M15.6503 1.57476L9.58636 7.63871C9.27304 7.95159 9.05935 8.35023 8.97223 8.78437L8.41211 11.5882L11.2159 11.027C11.65 10.9402 12.0481 10.7273 12.3616 10.4139L18.4255 4.34997C18.6077 4.16775 18.7523 3.95142 18.8509 3.71333C18.9495 3.47525 19.0003 3.22007 19.0003 2.96237C19.0003 2.70466 18.9495 2.44949 18.8509 2.2114C18.7523 1.97332 18.6077 1.75699 18.4255 1.57476C18.2433 1.39254 18.027 1.24799 17.7889 1.14938C17.5508 1.05076 17.2956 1 17.0379 1C16.7802 1 16.525 1.05076 16.2869 1.14938C16.0489 1.24799 15.8325 1.39254 15.6503 1.57476Z"
                        stroke="#FFF8E9"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.8825 13.706V16.8825C16.8825 17.4442 16.6594 17.9828 16.2623 18.3799C15.8651 18.7771 15.3265 19.0002 14.7648 19.0002H3.11767C2.55603 19.0002 2.01739 18.7771 1.62025 18.3799C1.22311 17.9828 1 17.4442 1 16.8825V5.23534C1 4.6737 1.22311 4.13507 1.62025 3.73793C2.01739 3.34079 2.55603 3.11768 3.11767 3.11768H6.29417"
                        stroke="#FFF8E9"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <h4 className="md:text-h4-bold sm:text-h5-bold text-neutral-black-800">
                      เพิ่มรูปโปรไฟล์
                    </h4>
                  </button>
                </div>
                <div className="xl:w-[502px] md:w-[476px] sm:w-[268px] flex flex-col xl:gap-[4px] md:gap-[4px] sm:gap-[2px]">
                  <InputLabel
                    className={"w-full mb-[8px]"}
                    text="ชื่อบัญชี"
                    placeHolder="กรอกชื่อผู้ใช้งาน"
                    required={true}
                    value={name}
                    isEye={false}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="off"
                    textLabelClassName="xl:text-h3-bold lg:text-h3-bold md:text-h3-bold sm:text-h5-bold"
                    inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
                  />
                  <InputLabel
                    className={"w-full mb-[8px]"}
                    text="เบอร์โทรศัพท์"
                    placeHolder="กรอกเบอร์โทรศัพท์"
                    required={true}
                    value={phone}
                    isEye={false}
                    onChange={(e) => {
                      const formattedNumber = formatPhoneNumber(e.target.value);
                      if (formattedNumber.length <= 12) {
                        setPhone(formattedNumber);
                      }
                    }}
                    type="tel"
                    pattern="[0-9]*"
                    maxLength={12}
                    autoComplete="tel"
                    textLabelClassName="xl:text-h3-bold lg:text-h3-bold md:text-h3-bold sm:text-h5-bold"
                    inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
                  />
                  <InputLabel
                    className={"w-full mb-[8px]"}
                    text="อีเมล"
                    placeHolder="กรอกอีเมล"
                    isEye={false}
                    required={true}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value.trim());
                    }}
                    type="email"
                    autoComplete="email"
                    textLabelClassName="xl:text-h3-bold lg:text-h3-bold md:text-h3-bold sm:text-h5-bold"
                    inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
                  />
                  <InputLabel
                    className={"w-full mb-[8px]"}
                    text="รหัสผ่าน"
                    placeHolder="กรอกรหัสผ่าน"
                    required={true}
                    value={password}
                    isEye={true}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                    inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
                  />
                  <InputLabel
                    className={"w-full mb-[8px]"}
                    text="หมายเลขกระปุกออมสิน"
                    placeHolder="กรอกหมายเลขกระปุกออมสิน 5 หลัก"
                    required={true}
                    value={savingNumber}
                    isEye={false}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 5);
                      setSavingNumber(value);
                    }}
                    type="text"
                    pattern="[0-9]*"
                    maxLength={5}
                    autoComplete="off"
                    textLabelClassName="xl:text-h3-bold lg:text-h3-bold md:text-h3-bold sm:text-h5-bold"
                    inputClassName="xl:text-h3 lg:text-h4 md:text-h4 sm:text-h5"
                  />
                </div>
              </div>
              <BtnYellow
                type="submit"
                className={"md:px-[192px] sm:px-[96px]"}
                text="สมัครสมาชิก"
              />
            </div>
          </form>
        )}
      </div>
    </>
  );
}
