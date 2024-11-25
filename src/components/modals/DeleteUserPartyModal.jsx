import React from "react";
import LogoSucceed from "@images/logo-Delete-User.svg";
import BtnYellow from "@components/BtnYellow";

export default function DeleteUserPartyModal({ onClose, onConfirm }) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]  bg-black/20 z-[100]">
        <div className="xl:w-[700px] xl:h-[542px] md:w-[614px] md:h-[516px] sm:w-[324px] sm:h-[290px] bg-neutral-white-100 rounded-3xl overflow-hidden shadow-main-shadow">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img
              className="md:w-[200px] sm:w-[100px] md:mb-[28px] sm:mb-[18px]"
              src={LogoSucceed}
              alt=""
            />
            <h2 className="md:text-h2 sm:text-h5 text-neutral-black-800 xl:mb-[34px] md:mb-[28px] sm:mb-[24px]">
              คุณต้องการลบสมาชิกท่านนี้ใช่หรือไม่
            </h2>
            <div className="flex justify-center xl:gap-[80px] md:gap-[76px] sm:gap-[24px] text-center">
              <BtnYellow
                className="xl:w-[176px] md:w-[174px] sm:w-[128px] bg-primary-200"
                text="ยกเลิก"
                onClick={onClose}
              />
              <BtnYellow
                className="xl:w-[176px] md:w-[174px] sm:w-[128px]"
                text="ลบ"
                onClick={onConfirm}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
