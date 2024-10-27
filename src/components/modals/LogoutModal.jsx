import React from "react";
import Logo from "@components/Logo";
import BtnYellow from "@components/BtnYellow";

export default function LogoutModal() {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[662px] h-[366px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center">
          <div className="flex flex-col">
            <Logo className="mb-[28px]" />
            <h3 className="text-h2 text-neutral-black-800 text-center mb-[58px]">
              คุณต้องการออกจากระบบใช่หรือไม่
            </h3>
            <div className="flex gap-[58px] text-center">
              <BtnYellow
                className="w-[192px] py-3 bg-primary-200"
                text="ยกเลิก"
              />
              <BtnYellow className="w-[192px] py-3" text="ออกจากระบบ" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
