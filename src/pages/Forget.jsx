import React from "react";
import BtnBack from "../components/BtnBack";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import LogoUnlockPinSucces from "../assets/images/logo-pic-forget.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Forget() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const usersRef = collection(db, "users");

  const fetchEmail = async (e) => {
    e.preventDefault();

    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      toast.error("ยังไม่ได้ลงทะเบียน Email");
    } else {
      const userId = querySnapshot.docs[0].id;
      toast.success("อีเมล์ถูกต้อง");
      navigate("/ChangePassLog", { state: { userId, email } });
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[856px] h-[742px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <Link to="/login">
            <BtnBack />
          </Link>
          <div className="w-full h-full flex flex-col justify-center items-center">
            <form
              onSubmit={fetchEmail}
              className="w-[512px] h-[524px] flex flex-col items-center"
            >
              <img
                className="size-[228px] mb-[18px]"
                src={LogoUnlockPinSucces}
                alt=""
              />
              <h2 className="text-h2-bold mb-[56px]">Smart Piggy Bank</h2>

              <InputLabel
                className={"mb-[42px] w-full"}
                text="อีเมล์"
                placeHolder="กรอกอีเมล์"
                value={email}
                isEye={false}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="on"
              />
              <BtnYellow type="submit" className={"px-[164px]"} text="ยืนยัน" />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
