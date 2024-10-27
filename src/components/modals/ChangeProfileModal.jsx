import React from "react";
import SquarePen from "@images/square-pen.svg";
import InputLabel from "@components/InputLabel";
import BtnYellow from "@components/BtnYellow";
import Whawha from "@images/whawha.jpg";
import Bin from "@images/Bin.svg";
import BtnClose from "@components/BtnClose";

export default function ChangeProfileModal() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[540px] h-[726px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center">
          <div className="flex flex-col w-[436px] h-full justify-center items-center">
            <BtnClose />
            <h2 className="text-h2-bold text-neutral-white-800 text-center mb-[28px]">
              โปรไฟล์
            </h2>
            <img
              className="size-[276px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2 mb-[22px]"
              src={Whawha}
              alt=""
            />
            <div className="flex gap-[56px] mb-[26px]">
              <button className="flex gap-[10px] items-center px-6 py-2 bg-primary-500 rounded-xl">
                <img src={SquarePen} alt="" />
                <h4 className="text-h4-bold text-neutral-black-800">เปลี่ยน</h4>
              </button>
              <button className="flex gap-[10px] items-center px-6 py-2 bg-primary-500 rounded-xl">
                <img src={Bin} alt="" />
                <h4 className="text-h4-bold text-neutral-black-800">นำออก</h4>
              </button>
            </div>
            <div>
              <div className="flex flex-col gap-[10px] mb-[26px]">
                <InputLabel
                  className=""
                  text="ชื่อ :"
                  placeHolder="Sugar"
                  isInline={true}
                />
                <InputLabel
                  className=""
                  text="เบอร์โทรศัพท์ :"
                  placeHolder="0991451914"
                  isInline={true}
                />
              </div>
            </div>
            <BtnYellow className="px-8 py-3" text="บันทึก" />
          </div>
        </div>
      </div>
    </>
  );
}
