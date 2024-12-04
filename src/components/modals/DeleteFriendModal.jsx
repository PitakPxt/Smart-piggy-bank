import React from "react";
import DeleteFriend from "@images/logo-Delete-Friend.svg";
import BtnYellow from "@components/BtnYellow";

export default function DeleteFriendModal({ onClose, onConfirm }) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px] z-[100] bg-black/20 shadow-main-shadow">
        <div className="md:w-[660px] md:h-[544px] sm:w-[324px] sm:h-[290px] bg-neutral-white-100 rounded-3xl overflow-hidden">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img
              className="md:w-[266px] sm:w-[130px] md:mb-[28px] sm:mb-[18px]"
              src={DeleteFriend}
              alt=""
            />
            <h2 className="md:text-h2 sm:text-h5 text-neutral-black-800 md:mb-[34px] sm:mb-[24px]">
              คุณต้องการลบเพื่อนท่านนี้ใช่หรือไม่
            </h2>
            <div className="flex justify-center md:gap-[80px] sm:gap-[28px] text-center">
              <BtnYellow
                className="md:w-[176px] sm:w-[128px] bg-transparent border-2 border-secondary-500 text-secondary-500"
                text="ยกเลิก"
                onClick={onClose}
              />
              <BtnYellow
                className="md:w-[176px] sm:w-[128px]"
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
