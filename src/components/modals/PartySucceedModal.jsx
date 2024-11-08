import React from "react";
import LogoSucceed from "@images/logo-PartySucc.svg";
import BtnYellow from "@components/BtnYellow";

export default function PartySucceedModal({
  setShowPartySucceedModal,
  onEndParty,
}) {
  const handleCancel = () => {
    setShowPartySucceedModal(false);
  };

  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[700px] h-[542px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <img className="w-[429px] mb-[28px]" src={LogoSucceed} alt="" />
            <h2 className="text-h2-bold text-neutral-white-800 mb-[34px]">
              คุณต้องการสิ้นสุดปาร์ตี้นี้ใช่หรือไม่
            </h2>
            <div className="flex justify-center gap-[80px] text-center">
              <BtnYellow
                className="w-[176px] bg-primary-200"
                text="ยกเลิก"
                onClick={handleCancel}
              />
              <BtnYellow
                className="w-[176px]"
                text="สิ้นสุดปาร์ตี้"
                onClick={onEndParty}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
