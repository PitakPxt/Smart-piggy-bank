import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { updateDoc } from "firebase/firestore";
import { collection, getDocs, query, where, doc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { db } from "../lib/firebase";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassLog() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userId, setUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const auth = getAuth();

  useEffect(() => {
    // ดึง userId จาก URL parameters
    const userIdFromUrl = searchParams.get("userId");

    if (!userIdFromUrl) {
      toast.error("ไม่พบข้อมูลผู้ใช้");
      navigate("/forget");
      return;
    }

    setUserId(userIdFromUrl);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        toast.error("ไม่พบข้อมูลอีเมล กรุณาทำรายการใหม่");
        navigate("/forget");
        return;
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          window.localStorage.removeItem("resetUserId");
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาด:", error);
          toast.error("การยืนยันตัวตนล้มเหลว");
          navigate("/forget");
        });
    }
  }, [searchParams, navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!userId) {
      toast.error("ไม่พบข้อมูลผู้ใช้");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("รหัสผ่านใหม่ และ ยืนยันรหัสผ่านใหม่ไม่ตรงกัน");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("ไม่พบข้อมูลผู้ใช้ที่เข้าสู่ระบบ");
        return;
      }

      await updatePassword(user, newPassword);
      await updateDoc(doc(db, "users", userId), {
        password: newPassword,
      });

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ");
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      toast.error("การเปลี่ยนรหัสผ่านล้มเหลว กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col justify-center items-center
         w-[756px] h-[728px]  bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <div className="w-[556px] h-[448px] flex flex-col justify-center items-center">
            <div className="mb-[46px]">
              <Logo />
            </div>
            <div className="flex flex-col w-full gap-[18px] mb-[52px]">
              <InputLabel
                text={"รหัสผ่านใหม่"}
                placeHolder={"กรอกรหัสผ่านใหม่"}
                required={true}
                isEye={true}
                autoComplete="off"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <InputLabel
                text={"ยืนยันรหัสผ่านใหม่อีกครั้ง"}
                placeHolder={"กรอกรหัสผ่านใหม่อีกครั้ง"}
                required={true}
                isEye={true}
                autoComplete="off"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </div>
            <BtnYellow className={"px-[150px]"} text={"เปลี่ยนรหัสผ่าน"} />
          </div>
        </form>
      </div>
    </>
  );
}
