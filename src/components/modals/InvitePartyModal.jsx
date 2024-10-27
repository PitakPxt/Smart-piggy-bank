import React from "react";
import Logo from "@components/Logo";
import BtnYellow from "@components/BtnYellow";
import BtnClose from "@components/BtnClose";
import ImgFriend from "@images/whawha.jpg";

export default function InvitePartyModal({ name = "Whawha" }) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center fixed top-0 left-0 backdrop-blur-[2px]">
        <div className="w-[426px] h-[332px] px-[52px] py-[40px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <BtnClose />
          <div className="flex flex-col">
            <h3 className=" text-h3-bold text-neutral-black-800 mb-[30px]">
              เชิญเพื่อนเข้าปาร์ตี้
            </h3>
            <div className="flex flex-col items-center gap-[18px] justify-between">
              <InviteItem />
              <InviteItem />
              <InviteItem />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const InviteItem = ({ name = "Whawha" }) => {
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            className="size-[54px] border-neutral-white-500 object-cover rounded-full p-[2px] border-2"
            src={ImgFriend}
            alt=""
          />
          <h4 className="w-[96px] text-h4-bold text-neutral-black-800 truncate">
            {name}
          </h4>
        </div>
        <button className="bg-success-400 px-[34px] py-[4px] rounded-xl">
          <h4 className="text-h4-bold text-neutral-white-100">เชิญ</h4>
        </button>
      </div>
    </>
  );
};
