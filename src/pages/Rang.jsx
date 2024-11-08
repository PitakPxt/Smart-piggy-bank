import React from "react";
import Whawha from "../assets/images/whawha.jpg";
import LogoRang from "../assets/images/rang-number-1.png";
import BtnYellow from "../components/BtnYellow";

const RankCard = ({ rank, name, amount, bgColor }) => {
  const isFirstPlace = rank === 1;

  return (
    <div className="flex flex-col justify-end">
      <div className="flex flex-col text-center items-center mb-4">
        <img
          className="size-[120px] border-neutral-white-500 object-cover rounded-full p-[6px] border-2"
          src={Whawha}
          alt={`${name}'s profile`}
        />
        <h3 className="text-h3-bold">{name}</h3>
        <h2 className="text-h2-bold">{amount} ฿</h2>
      </div>
      <div
        className={`flex ${
          isFirstPlace ? "flex-col items-center" : ""
        } justify-center items-end ${bgColor} h-[${
          isFirstPlace ? "368" : "276"
        }px] rounded-t-2xl`}
      >
        <h1 className="text-[128px] font-bold">{rank}</h1>
        {isFirstPlace && (
          <img
            className="size-[148px]"
            src={LogoRang}
            alt="First place badge"
          />
        )}
      </div>
    </div>
  );
};

export default function Rang() {
  const rankData = [
    { rank: 2, name: "Mina", amount: 550, bgColor: "bg-[#F36B39]" },
    { rank: 1, name: "Wha", amount: 550, bgColor: "bg-primary-500" },
    { rank: 3, name: "Whawha", amount: 550, bgColor: "bg-[#9BD0F2]" },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-[756px] h-[840px] flex flex-col justify-center items-center bg-neutral-white-100 rounded-3xl overflow-hidden drop-shadow-lg">
        <div className="w-[620px] h-[714px] flex flex-col justify-center items-center text-center">
          <div className="flex flex-col size-full">
            <h2 className="text-h2-bold mb-[28px]">การจัดอันดับ</h2>
            <div className="grid grid-cols-3 gap-6 h-full mb-[34px]">
              {rankData.map((player) => (
                <RankCard key={player.rank} {...player} />
              ))}
            </div>
            <div className="w-full">
              <BtnYellow
                className="px-[36px]"
                text="กลับไปหน้าหลัก"
                onClick={() => navigate("/home")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
