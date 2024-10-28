import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import DefaultProfile from "@images/default-Profile.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { arrayUnion } from "firebase/firestore";

export default function Regisret() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("กรุณาเลือกรูปโปรไฟล์");
      return;
    }
    setIsUploading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

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
            phone: phone,
            email: email,
            password: password,
            savingNumber: savingNumber,
            profileImageURL: imageURL,
          });
          // await setDoc(
          //   doc(db, "email-user", "email"),
          //   {
          //     email: arrayUnion(email),
          //   },
          //   { merge: true }
          // );
          // await setDoc(
          //   doc(db, "phone-user", "phone"),
          //   {
          //     phone: arrayUnion(phone),
          //   },
          //   { merge: true }
          // );
          // await updateProfile(user, {
          //   displayName: name,
          //   photoURL: imageURL,
          //   phoneNumber: phone,
          // });
          console.log("บันทึกข้อมูลผู้ใช้และรูปภาพสำเร็จ");
          setIsUploading(false);
          navigate("/login");
        }
      );
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการสมัครสมาชิก:", error);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง");
      setIsUploading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="w-[1104px] h-[786px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <Link to="/login">
            <BtnBack />
          </Link>
          <div className="size-full flex flex-col justify-center items-center">
            <div className="w-full flex justify-center items-center gap-[102px] mb-[48px]">
              <div className="flex flex-col items-center justify-center text-center">
                <h2 className="text-h2-bold mb-[32px]">สมัครสมาชิก</h2>
                <div className="mb-[26px]">
                  <img
                    className="size-[276px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2"
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
                  className="flex gap-[10px] items-center px-6 py-2 bg-primary-500 rounded-xl hover:duration-200 group 
                  hover:ease-in-out hover:bg-secondary-600 hover:text-neutral-white-100"
                >
                  <svg
                    className="group-hover:stroke-neutral-white-100"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="group-hover:fill-neutral-white-100"
                      d="M14.709 3.54949L16.9505 5.79104M16.1501 1.57476L10.0861 7.63871C9.77279 7.95159 9.55911 8.35023 9.47199 8.78437L8.91187 11.5882L11.7157 11.027C12.1498 10.9402 12.5479 10.7273 12.8613 10.4139L18.9253 4.34997C19.1075 4.16775 19.252 3.95142 19.3506 3.71333C19.4493 3.47525 19.5 3.22007 19.5 2.96237C19.5 2.70466 19.4493 2.44949 19.3506 2.2114C19.252 1.97332 19.1075 1.75699 18.9253 1.57476C18.743 1.39254 18.5267 1.24799 18.2886 1.14938C18.0505 1.05076 17.7954 1 17.5377 1C17.28 1 17.0248 1.05076 16.7867 1.14938C16.5486 1.24799 16.3323 1.39254 16.1501 1.57476Z"
                      stroke="#0E0E0E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      className="group-hover:stroke-neutral-white-100"
                      d="M17.3825 13.706V16.8825C17.3825 17.4442 17.1594 17.9828 16.7623 18.3799C16.3651 18.7771 15.8265 19.0002 15.2648 19.0002H3.61767C3.05603 19.0002 2.51739 18.7771 2.12025 18.3799C1.72311 17.9828 1.5 17.4442 1.5 16.8825V5.23534C1.5 4.6737 1.72311 4.13507 2.12025 3.73793C2.51739 3.34079 3.05603 3.11768 3.61767 3.11768H6.79417"
                      stroke="#0E0E0E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <h4 className="text-h4-bold text-neutral-black-800">
                    เพิ่มรูปโปรไฟล์
                  </h4>
                </button>
              </div>
              <div className="w-[502px] flex flex-col">
                <InputLabel
                  className={"w-full mb-[18px]"}
                  text="ชื่อบัญชี"
                  placeHolder="กรอกชื่อ"
                  required={true}
                  value={name}
                  isEye={false}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                />
                <InputLabel
                  className={"w-full mb-[18px]"}
                  text="เบอร์โทรศัพท์"
                  placeHolder="กรอกเบอร์โทรศัพท์"
                  required={true}
                  value={phone}
                  isEye={false}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="off"
                />
                <InputLabel
                  className={"w-full mb-[18px]"}
                  text="อีเมล์"
                  placeHolder="กรอกอีเมล์"
                  required={true}
                  value={email}
                  isEye={false}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
                <InputLabel
                  className={"w-full mb-[18px]"}
                  text="รหัสผ่าน"
                  placeHolder="กรอกรหัสผ่าน"
                  required={true}
                  value={password}
                  isEye={true}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                />
                <InputLabel
                  className={"w-full"}
                  text="หมายเลขกระปุกออมสิน"
                  placeHolder="กรอกหมายเลขกระปุกออมสิน"
                  required={true}
                  value={savingNumber}
                  isEye={false}
                  onChange={(e) => setSavingNumber(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>
            <BtnYellow
              type="submit"
              className={"px-[192px]"}
              text="สมัครสมาชิก"
            />
          </div>
        </form>
      </div>
    </>
  );
}
