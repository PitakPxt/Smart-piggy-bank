import React from "react";
import LogoImage from "../assets/images/logo-pic.svg";
import { cn } from "../lib/tailwindcss";

export default function Logo({ className }) {
  return (
    <>
      <div className={cn("flex items-center gap-[6px]", className)}>
        <img src={LogoImage} alt="" className="size-[88px] font-bold" />
        <h1 className="text-[48px] leading-[38px] font-bold">
          Smart Piggy Bank
        </h1>
      </div>
    </>
  );
}
