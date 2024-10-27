import React from "react";
import InputPin from "../components/InputPin";
import LogoOtpLogin from "../assets/images/logo-pic-otpLogin.png";
import IconBack from "../assets/images/icon-back.svg";
import BtnYellow from "../components/BtnYellow";
import BtnBack from "../components/BtnBack";
import { Link, useLocation } from "react-router-dom";
import { auth } from "../lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useState, useEffect, useRef } from "react";

export default function Otp() {
  const location = useLocation();
  const { phone } = location.state || {};
  const [otp, setOtp] = useState("");

  const captchaVerifier = useRef(null);

  const formattedPhone = `+66${phone.substring(1)}`; // Convert 0xx to +66xx
  console.log("formattedPhone", formattedPhone);

  console.log("otp", otp);
  console.log("phone", phone);

  function onCaptchVerify() {}

  const sendOtp = async () => {};

  const verifyOtp = async () => {};

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[856px] h-[828px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <Link to="/forget">
              <BtnBack />
            </Link>
            <div className="flex flex-col justify-center text-center gap-[18px] pb-[28px]">
              <div className="flex flex-col gap-[18px]">
                <img src={LogoOtpLogin} alt="" />
              </div>
              <h2 className="text-h2-bold text-neutral-white-800 text-center">
                Smart Piggy Bank
              </h2>
              <div id="recaptcha"></div>
            </div>
            <InputPin
              value={otp}
              onChange={setOtp}
              className="mb-[42px]"
              textPin="กรุณากรอก OTP :"
              data={otp}
            />
            <BtnYellow
              className={"px-[164px]"}
              text="ยืนยัน"
              onClick={verifyOtp}
            />
          </div>
        </div>
      </div>
    </>
  );
}
