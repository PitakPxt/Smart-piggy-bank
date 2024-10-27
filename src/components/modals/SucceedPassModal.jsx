import React from "react";
import LogoSucceed from "@images/succeed-Pass.svg";

export default function SucceedPassModal() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[656px] h-[522px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="size-full flex flex-col justify-center items-center">
            <img
              className="w-[246px] h-[287px] mb-[16px]"
              src={LogoSucceed}
              alt=""
            />
            <h2 className="text-h2-bold text-neutral-white-800 text-center mb-[28px]">
              เปลี่ยนรหัสปลดล็อคสำเร็จ
            </h2>
            <h2 className="text-h2 text-neutral-white-800 text-center">
              คุณได้ทำการเปลี่ยนรหัสปลดล็อคแล้ว
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
