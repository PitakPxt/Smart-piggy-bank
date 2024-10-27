import React from "react";
import InputLabel from "@components/InputLabel";
import BtnYellow from "@components/BtnYellow";
import BtnClose from "@components/BtnClose";

export default function AppFriendModal() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[728px] h-[312px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center">
          <div className="flex flex-col justify-center items-center gap-[24px]">
            <div className="flex w-[634px] justify-between items-center">
              <h3 className="text-h3-bold text-neutral-black-800">
                เพิ่มเพื่อนใหม่!!
              </h3>
              <BtnClose />
            </div>
            <div className="flex justify-center">
              <InputLabel
                className="w-[512px]"
                text="เบอร์โทรศัพท์"
                placeHolder="กรอกเบอร์โทรศัพท์"
              />
            </div>
            <div className="w-full flex justify-end px-12">
              <BtnYellow className="px-[22px]" text="เพิ่มเพื่อน" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
