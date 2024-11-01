import React from "react";
import BtnBack from "../components/BtnBack";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";
import Whawha from "../assets/images/whawha.jpg";
import IconPlus from "../assets/images/icon-plus.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function CreateParty() {
  const [nameParty, setNameParty] = useState("");
  const [target, setTarget] = useState("");
  const [days, setDays] = useState("");

  const handleCreateParty = async () => {
    console.log("สร้างปาร์ตี้สำเร็จ");
    console.log(nameParty, target, days);
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[756px] h-[740px] flex flex-col justify-center items-center
          bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <Link to="/home">
            <BtnBack />
          </Link>
          <div className="w-[520px] h-full flex flex-col justify-center items-center mt-[20px]">
            <div className="flex flex-col w-full gap-[18px] mb-[52px]">
              <h2 className="text-h2-bold text-center">สร้างปาร์ตี้</h2>
              <InputLabel
                InputLabel
                className={"w-full"}
                text="ชื่อปาร์ตี้ :"
                placeHolder="ชื่อปาร์ตี้"
                required={true}
                isEye={false}
                autoComplete="off"
                value={nameParty}
                onChange={(e) => setNameParty(e.target.value)}
              />
              <InputLabel
                className="w-full"
                text="กำหนดเป้าหมาย (บาท) :"
                placeHolder="กำหนดเป้าหมาย"
                required={true}
                isEye={false}
                autoComplete="off"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
              />
              <InputLabel
                className={"w-full"}
                text="ระยะเวลาในการแข่งขัน (วัน) : "
                placeHolder="กรอกระยะเวลาในการแข่งขัน"
                required={true}
                isEye={false}
                autoComplete="off"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <div>
                <h3 className="text-h3-bold mb-[10px]">เชิญเพื่อน : </h3>
                <ul className="flex flex-wrap gap-[16px]">
                  {addFriendParty(Whawha)}
                  {addFriendButton(IconPlus)}
                </ul>
              </div>
            </div>
            <BtnYellow
              className={"px-[156px]"}
              text={"สร้างปาร์ตี้"}
              onClick={handleCreateParty}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function addFriendButton(src) {
  return (
    <button
      className="w-[66px] h-[66px] flex justify-center items-center rounded-full 
    border-2 border-neutral-white-500 bg-neutral-white-100"
    >
      <img className="size-[26px]" src={src} />
    </button>
  );
}

function addFriendParty(src) {
  return (
    <li className="rounded-full bg-neutral-white-100 ">
      <img
        className="w-[68px] h-[68px] p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
        src={src}
        alt=""
      />
    </li>
  );
}
