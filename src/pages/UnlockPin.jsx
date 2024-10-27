import React from "react";
import InputPin from "../components/InputPin";
import LogoPicUnlockPin from "../assets/images/logo-pic-unlockPin.png";
import BtnYellow from "../components/BtnYellow";
import BtnBack from "../components/BtnBack";
// import Layout from "../components/Layout";
// import Navbar from "../components/Navbar";

export default function UnlockPin() {
  return (
    <>
      {/* <Layout>
        <Navbar /> */}
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[856px] h-[828px] bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div className="w-full h-full flex flex-col justify-center items-center ">
            <BtnBack />
            <div className="flex flex-col justify-center text-center gap-2 mb-[38px]">
              <div className="flex flex-col gap-[18px]">
                <img src={LogoPicUnlockPin} alt="" className="" />
                <h2 className="text-h3 font-bold text-neutral-white-800 text-center">
                  ปลดล็อคกระปุก
                </h2>
              </div>
              <h2 className="text-h2-bold text-neutral-white-800 text-center">
                Smart Piggy Bank
              </h2>
            </div>
            <div className="mb-[52px]">
              <h2 className="text-h3-bold font-bold text-neutral-white-800 pb-[10px]">
                กรุณากรอก PIN :
              </h2>
              <InputPin />
              <h4 className="text-right text-h4">ลืมรหัสผ่าน?</h4>
            </div>
            <BtnYellow className={"px-[136px]"} text={"ปลดล็อคกระปุก"} />
          </div>
        </div>
      </div>
      {/* </Layout> */}
    </>
  );
}
