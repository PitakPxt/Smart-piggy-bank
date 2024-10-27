import React from "react";
import Logo from "../components/Logo";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";

export default function ChangePassLog() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
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
              />
              <InputLabel
                text={"ยืนยันรหัสผ่านใหม่"}
                placeHolder={"กรอกรหัสผ่านใหม่อีกครั้ง"}
              />
            </div>
            <BtnYellow className={"px-[150px]"} text={"เปลี่ยนรหัสผ่าน"} />
          </div>
        </div>
      </div>
    </>
  );
}
