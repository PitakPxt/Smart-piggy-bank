import React from "react";
import BtnBack from "../components/BtnBack";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";
import Whawha from "../assets/images/whawha.jpg";
import Wha from "../assets/images/wha.jpg";
import Wwha from "../assets/images/wwha.jpg";
import Aod from "../assets/images/aod.jpg";
import IconPlus from "../assets/images/icon-plus.svg";

import { Link } from "react-router-dom";

export default function CreateParty() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[756px] h-[740px] flex flex-col justify-center items-center
          bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <div className="w-[520px] h-full flex flex-col justify-center items-center mt-[20px]">
            <div className="flex flex-col w-full gap-[18px] mb-[52px]">
              <h2 className="text-h2-bold text-center">สร้างปาร์ตี้</h2>
              <InputLabel
                className="w-full"
                text="ชื่อปาร์ตี้ :"
                placeHolder="ชื่อปาร์ตี้"
              />
              <InputLabel
                className="w-full"
                text="กำหนดเป้าหมาย :"
                placeHolder="กำหนดเป้าหมาย"
              />
              <InputLabel
                className="w-full"
                text="ระยะเวลาในการแข่งขัน : "
                placeHolder="ระยะเวลาในการแข่งขัน"
              />
              <div>
                <h3 className="text-h3-bold mb-[10px]">เชิญเพื่อน : </h3>
                <ul className="flex flex-wrap gap-[16px]">
                  <li className="rounded-full bg-neutral-white-100 ">
                    <img
                      className="w-[68px] h-[68px] p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
                      src={Whawha}
                      alt=""
                    />
                  </li>
                  <li className="rounded-full bg-neutral-white-100 ">
                    <img
                      className="w-[68px] h-[68px] p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
                      src={Wha}
                      alt=""
                    />
                  </li>
                  <li className="rounded-full bg-neutral-white-100 ">
                    <img
                      className="w-[68px] h-[68px] p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
                      src={Wwha}
                      alt=""
                    />
                  </li>
                  <li className="rounded-full bg-neutral-white-100 ">
                    <img
                      className="w-[68px] h-[68px] p-[2px] rounded-full border-2 border-neutral-white-500 object-cover"
                      src={Aod}
                      alt=""
                    />
                  </li>
                  <div className="w-[66px] h-[66px] flex justify-center items-center rounded-full border-2 border-neutral-white-500 bg-neutral-white-100 ">
                    <img className=" w-[26px] h-[26px]" src={IconPlus} alt="" />
                  </div>
                </ul>
              </div>
            </div>
            <BtnYellow className={"px-[156px]"} text={"สร้างปาร์ตี้"} />
          </div>
        </div>
      </div>
    </>
  );
}
