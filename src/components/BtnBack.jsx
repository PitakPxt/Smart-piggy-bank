import React from "react";
import IconBack from "../assets/images/icon-back.svg";
import { useNavigate } from "react-router-dom";

export default function btnBack() {
  return (
    <>
      <div className="flex gap-3 absolute xl:left-[42px] xl:top-[42px] md:left-[40px] md:top-[42px] sm:left-[26px] sm:top-[26px] cursor-pointer">
        <img className="md:size-[34px] sm:size-[24px]" src={IconBack} alt="" />
        <h2 className="md:text-h3-bold sm:text-h5-bold text-neutral-white-500">
          Back
        </h2>
      </div>
    </>
  );
}
