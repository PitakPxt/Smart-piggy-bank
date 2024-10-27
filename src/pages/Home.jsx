import React from "react";
import Coin1 from "../assets/images/coin-1.png";
import Coin2 from "../assets/images/coin-2.png";
import Coin5 from "../assets/images/coin-5.png";
import Coin10 from "../assets/images/coin-10.png";
import BtnYellow from "../components/BtnYellow";

export default function Home() {
  return (
    <>
      <div className="flex flex-col w-full h-full justify-center items-center ">
        <div
          className="flex flex-col w-[856px] h-[649px] bg-neutral-white-100 opacity-95 rounded-3xl drop-shadow-lg 
        mx-auto overflow-hidden justify-center items-center mb-[50px]"
        >
          <h1 className="w-[384px] h-[96px] mb-[76px] bg-primary-400 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
            ยอดรวม : 99999999
          </h1>
          <div className="grid grid-cols-2 gap-4 ">
            <div className="flex items-center gap-5">
              <img src={Coin1}></img>
              <h1 className="w-[226px] h-[72px] bg-neutral-white-200 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
                2321
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <img src={Coin2}></img>
              <h1 className="w-[226px] h-[72px] bg-neutral-white-200 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
                10312
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <img src={Coin5}></img>
              <h1 className="w-[226px] h-[72px] bg-neutral-white-200 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
                505166
              </h1>
            </div>
            <div className="flex items-center gap-5">
              <img src={Coin10}></img>
              <h1 className="w-[226px] h-[72px] bg-neutral-white-200 text-center text-h2-bold rounded-3xl content-center drop-shadow-lg">
                1000515
              </h1>
            </div>
          </div>
        </div>
        <BtnYellow className={"px-[98px]"} text={"ดูปาร์ตี้"} />
      </div>
    </>
  );
}
