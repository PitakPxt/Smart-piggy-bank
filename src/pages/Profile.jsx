import React from "react";
import BtnBack from "../components/BtnBack";
import Whawha from "../assets/images/whawha.jpg";
import EditProfile from "../assets/images/edit-porfile.png";
import BtnYellow from "../components/BtnYellow";
export default function Profile() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[768px] h-[754px] flex flex-col justify-center items-center
    bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <BtnBack />
          <div className="absolute top-[42px] right-[42px]">
            <img src={EditProfile} alt="edit-profile" />
          </div>
          <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-h2-bold mb-[36px]">โปรไฟล์</h2>
            <div className="mb-[62px]">
              <img
                className="size-[276px] border-neutral-white-500 object-cover rounded-full p-[10px] border-2 mb-[28px]"
                src={Whawha}
                alt=""
              />
              <div className="flex flex-col gap-[18px]">
                <h1 className="text-h1-bold">WhaWha</h1>
                <h2 className="text-h2">0991451914</h2>
              </div>
            </div>
            <BtnYellow className={"px-[192px]"} text="ออกจากระบบ" />
          </div>
        </div>
      </div>
    </>
  );
}
