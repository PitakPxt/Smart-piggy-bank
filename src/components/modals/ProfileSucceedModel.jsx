import React from "react";
import BtnYellow from "@components/BtnYellow";
import LogoSucceed from "@images/logo-ProfileSucc.png";

export default function ProfileSucceedModal() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[498px] h-[476px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex flex-col justify-center items-center">
          <img className="mb-[28px]" src={LogoSucceed} alt="" />
          <h2 className="text-h2-bold mb-[32px]">ข้อมูลโปรไฟล์ใหม่</h2>
          <div className="flex gap-[46px] text-center">
            <BtnYellow className="w-[168px] bg-primary-200" text="ยกเลิก" />
            <BtnYellow className="w-[168px]" text="บันทึกโปรไฟล์" />
          </div>
        </div>
      </div>
    </>
  );
}
