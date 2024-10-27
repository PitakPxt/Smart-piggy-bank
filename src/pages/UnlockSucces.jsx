import React from "react";
import LogoUnlockPinSucces from "../assets/images/logo-pic-unlockSucces.png";

export default function unlockPin() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[856px] h-[726px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col justify-center items-center">
            <img
              className="size-[376px] mb-11"
              src={LogoUnlockPinSucces}
              alt=""
            />
            <h2 className="text-h2-bold mb-[54px]">ปลดล็อคกระปุกสำเร็จ</h2>
            <a
              className="px-[124px] py-3 bg-primary-500 text-h3-bold rounded-xl drop-shadow-lg hover:bg-secondary-600 hover:text-neutral-white-100"
              type="submit"
            >
              ล็อคกระปุก (10)
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
