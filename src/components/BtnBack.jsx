import React from "react";
import IconBack from "../assets/images/icon-back.svg";
import { useNavigate } from "react-router-dom";

export default function btnBack() {
  return (
    <>
      <div className="flex gap-3 absolute left-[42px] top-[42px]">
        <img src={IconBack} alt="" />
        <h2 className="text-h3-bold font-bold text-neutral-white-500">Back</h2>
      </div>
    </>
  );
}
