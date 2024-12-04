import React from "react";
import Logo from "@components/Logo";
import BtnYellow from "@components/BtnYellow";

export default function LogoutModal({ onCancel, onConfirm }) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px] shadow-main-shadow bg-black/20">
        <div className="xl:w-[662px] xl:h-[366px] md:w-[540px] md:h-[312px] sm:w-[318px] sm:h-[188px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Logo className="md:mb-[28px] sm:mb-[18px]" />
            <h3 className="md:text-h3 sm:text-h5 text-neutral-black-800 text-center md:mb-[58px] sm:mb-[18px]">
              คุณต้องการออกจากระบบใช่หรือไม่
            </h3>
            <div className="flex md:gap-[58px] sm:gap-[26px] text-center">
              <BtnYellow
                className="md:w-[192px] sm:w-[128px] py-3 sm:py-2 bg-transparent border-2 border-secondary-500 text-secondary-500"
                text="ยกเลิก"
                onClick={onCancel}
              />
              <BtnYellow
                className="md:w-[192px] sm:w-[128px] py-3 sm:py-2"
                text="ออกจากระบบ"
                onClick={onConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
