import React, { useEffect, useState } from "react";
import Logo from "../components/Logo";
import InputLabel from "../components/InputLabel";
import BtnYellow from "../components/BtnYellow";

export default function test() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <form
          className="flex flex-col justify-center items-center
         bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg
         xl:w-[756px] xl:h-[726px]
         md:w-[646px] md:h-[602px]
         sm:w-[344px] sm:h-[426px]"
        >
          <div className="xl:w-[556px] xl:h-[448px] md:w-[508px] md:h-[530px] sm:w-[300px] sm:h-[350px] flex flex-col justify-center items-center">
            <div className="md:mb-[46px] sm:mb-[24px]">
              <Logo />
            </div>
            <div className="flex flex-col gap-[18px] xl:mb-[52px] md:mb-[36px] sm:mb-[34px] w-full">
              <InputLabel
                text={"รหัสผ่านใหม่"}
                placeHolder={"กรอกรหัสผ่านใหม่"}
                required={true}
                isEye={true}
                autoComplete="off"
              />
              <InputLabel
                text={"ยืนยันรหัสผ่านใหม่อีกครั้ง"}
                placeHolder={"กรอกรหัสผ่านใหม่อีกครั้ง"}
                required={true}
                isEye={true}
                autoComplete="off"
              />
            </div>
            <BtnYellow
              className={"xl:px-[150px] sm:px-[48px]"}
              text={"เปลี่ยนรหัสผ่าน"}
            />
          </div>
        </form>
      </div>
    </>
  );
}
