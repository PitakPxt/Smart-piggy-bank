import React, { useState } from "react";
import LogoNumber1 from "../assets/images/number-1.png";
import LogoNumber2 from "../assets/images/number-2.png";
import LogoNumber3 from "../assets/images/number-3.png";
import Whawha from "../assets/images/whawha.jpg";
import LogoDelete from "../assets/images/delete-Player.png";
import BtnBack from "../components/BtnBack";

export default function Party() {
  const [partyName, setPartyName] = useState("โมโม่");
  const [partyGoal, setPartyGoal] = useState(10000);
  const [partyTime, setPartyTime] = useState("100");

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[768px] h-[814px] flex flex-col justify-start items-center
          bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg gap-[18px] pt-[42px] relative"
        >
          <BtnBack />
          <div className="text-center items-center mt-[28px]">
            <h2 className="text-h2-bold">ปาร์ตี้ : {partyName}</h2>
            <div className="flex gap-[28px]">
              <h3 className="text-h3-bold">เป้าหมาย : {partyGoal} บาท</h3>
              <h3 className="text-h3-bold">ระยะเวลาที่เหลือ {partyTime} วัน</h3>
            </div>
          </div>
          <div className="w-[680px] justify-center items-center flex-grow">
            <ul className="flex flex-col gap-[8px] ">
              <li className=" w-[680px] h-[100px] flex items-center justify-between  bg-primary-400 rounded-3xl">
                <div className="flex">
                  <img
                    className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
                    src={LogoNumber1}
                    alt=""
                  />
                  <div className="flex items-center gap-[24px]">
                    <img
                      className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
                      src={Whawha}
                      alt=""
                    />
                    <h2 className="text-h2-bold w-[180px] truncate">Whawha</h2>
                  </div>
                </div>
                <div className="flex items-center gap-[24px] mr-[48px]">
                  <h2 className="text-h2-bold text-right">5161651 ฿</h2>
                  <img className="size-[32px] " src={LogoDelete} alt="" />
                </div>
              </li>
              <li className=" w-[680px] h-[100px] flex items-center justify-between  bg-primary-300 rounded-3xl">
                <div className="flex">
                  <img
                    className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
                    src={LogoNumber2}
                    alt=""
                  />
                  <div className="flex items-center gap-[24px]">
                    <img
                      className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
                      src={Whawha}
                      alt=""
                    />
                    <h2 className="text-h2-bold w-[180px] truncate">Wha</h2>
                  </div>
                </div>
                <div className="flex items-center gap-[24px] mr-[48px]">
                  <h2 className="text-h2-bold text-right">516161 ฿</h2>
                  <img className="size-[32px] " src={LogoDelete} alt="" />
                </div>
              </li>
              <li className=" w-[680px] h-[100px] flex items-center justify-between  bg-primary-300 rounded-3xl">
                <div className="flex">
                  <img
                    className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
                    src={LogoNumber3}
                    alt=""
                  />
                  <div className="flex items-center gap-[24px]">
                    <img
                      className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
                      src={Whawha}
                      alt=""
                    />
                    <h2 className="text-h2-bold w-[180px] truncate">Whaa</h2>
                  </div>
                </div>
                <div className="flex items-center gap-[24px] mr-[48px]">
                  <h2 className="text-h2-bold text-right">1651 ฿</h2>
                  <img className="size-[32px] " src={LogoDelete} alt="" />
                </div>
              </li>
              <li className=" w-[680px] h-[100px] flex items-center justify-between  bg-primary-300 rounded-3xl">
                <div className="flex">
                  {/* <img
                    className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
                    src={LogoNumber3}
                    alt=""
                  /> */}
                  <div className="flex items-center gap-[24px]">
                    <img
                      className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
                      src={Whawha}
                      alt=""
                    />
                    <h2 className="text-h2-bold w-[180px] truncate">Pitak</h2>
                  </div>
                </div>
                <div className="flex items-center gap-[24px] mr-[48px]">
                  <h2 className="text-h2-bold text-right">115 ฿</h2>
                  <img className="size-[32px] " src={LogoDelete} alt="" />
                </div>
              </li>
              <li className=" w-[680px] h-[100px] flex items-center justify-between  bg-primary-300 rounded-3xl">
                <div className="flex">
                  {/* <img
                    className="size-[82px] border-neutral-white-500 object-cover mr-[24px] absolute ml-[36px]"
                    src={LogoNumber3}
                    alt=""
                  /> */}
                  <div className="flex items-center gap-[24px]">
                    <img
                      className="size-[82px] border-neutral-white-500 object-cover rounded-full p-[4px] border-2 ml-[142px]"
                      src={Whawha}
                      alt=""
                    />
                    <h2 className="text-h2-bold w-[180px] truncate">Kann</h2>
                  </div>
                </div>
                <div className="flex items-center gap-[24px] mr-[48px]">
                  <h2 className="text-h2-bold text-right">15 ฿</h2>
                  <img className="size-[32px] " src={LogoDelete} alt="" />
                </div>
              </li>
            </ul>
          </div>
          <a
            className="px-[32px] py-[12px] absolute bottom-[24px] bg-transparent border-2 border-error-300 text-error-300 text-h3-bold 
            rounded-xl drop-shadow-lg hover:border-error-200 hover:bg-error-200 hover:text-neutral-white-100"
            type="submit"
          >
            สิ้นสุดปาร์ตี้
          </a>
        </div>
      </div>
    </>
  );
}
