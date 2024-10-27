import React from "react";
import InputPin from "../components/InputPin";
import Logo from "../components/Logo";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";

export default function ChangePass() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="flex flex-col justify-center items-center
         w-[756px] h-[728px]  bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <div className="w-[556px] h-[448px] flex flex-col justify-center items-center">
            <div className="mb-[34px]">
              <Logo />
            </div>
            <div className="flex flex-col w-full gap-[32px]">
              <InputPin className="" textPin="กรุณากรอกรหัสผ่านใหม่ :" />
              <InputPin className="mb-[42px]" textPin="กรุณายืนยันรหัสผ่าน :" />
            </div>
            <BtnYellow className={"px-[144px]"} text={"เปลี่ยนรหัสผ่าน"} />
          </div>
        </div>
      </div>
    </>
  );
}
