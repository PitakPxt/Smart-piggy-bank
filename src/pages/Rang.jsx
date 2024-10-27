import React from "react";
import Whawha from "../assets/images/whawha.jpg";
import LogoRang from "../assets/images/rang-number-1.png";
import BtnYellow from "../components/BtnYellow";
export default function Rang() {
  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className="w-[756px] h-[840px] flex flex-col justify-center items-center
          bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg"
        >
          <div className="w-[620px] h-[714px] flex flex-col justify-center items-center text-center">
            <div className="flex flex-col size-full">
              <h2 className="text-h2-bold mb-[28px]">การจัดอันดับ</h2>
              <div class="grid grid-cols-3 gap-6 h-full mb-[34px]">
                <div className="flex flex-col justify-end">
                  <div className="flex flex-col text-center items-center mb-4">
                    <img
                      className="size-[120px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2 "
                      src={Whawha}
                      alt=""
                    />
                    <h3 className="text-h3-bold">Mina</h3>
                    <h2 className="text-h2-bold">550 ฿</h2>
                  </div>
                  <div className="flex justify-center items-end bg-[#F36B39] h-[276px] rounded-t-2xl">
                    <h1 className="text-[128px] font-bold">2</h1>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-col text-center items-center mb-4">
                    <img
                      className="size-[120px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2 "
                      src={Whawha}
                      alt=""
                    />
                    <h3 className="text-h3-bold">Wha</h3>
                    <h2 className="text-h2-bold">550 ฿</h2>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-primary-400 h-[368px] rounded-t-2xl">
                    <h1 className="text-[128px] font-bold">1</h1>
                    <img className="size-[148px] " src={LogoRang} alt="" />
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex flex-col text-center items-center mb-4">
                    <img
                      className="size-[120px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2 "
                      src={Whawha}
                      alt=""
                    />
                    <h3 className="text-h3-bold">Whawha</h3>
                    <h2 className="text-h2-bold">550 ฿</h2>
                  </div>
                  <div className="flex justify-center items-end bg-[#9BD0F2] h-[276px] rounded-t-2xl">
                    <h1 className="text-[128px] font-bold">3</h1>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <BtnYellow textBtnYel="กลับไปหน้าหลัก" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
