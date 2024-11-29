import React from "react";
import DeleteFriend from "@images/logo-Delete-Friend.svg";
import BtnYellow from "@components/BtnYellow";

export default function DeleteFriendModal({ onClose, onConfirm }) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px] z-[100] bg-black/20">
        <div className="xl:w-[660px] xl:h-[544px]  bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img className="w-[266px] mb-[28px]" src={DeleteFriend} alt="" />
            <h2 className="text-h2-bold text-neutral-black-800 mb-[34px]">
              คุณต้องการลบเพื่อนท่านนี้ใช่หรือไม่
            </h2>
            <div className="flex justify-center gap-[80px] text-center">
              <BtnYellow
                className="w-[176px] bg-primary-200"
                text="ยกเลิก"
                onClick={onClose}
              />
              <BtnYellow className="w-[176px]" text="ลบ" onClick={onConfirm} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
