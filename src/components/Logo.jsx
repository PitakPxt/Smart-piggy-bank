import React from "react";
import LogoImage from "../assets/images/logo-pic.svg";
import { cn } from "../lib/tailwindcss";

export default function Logo({ className }) {
  return (
    <>
      <div className={cn("flex items-center gap-[6px]", className)}>
        <img
          src={LogoImage}
          alt=""
          className="lg:size-[88px] md:size-[88px] sm:size-[52px]"
        />
        <h1 className="md:text-h3-bold sm:text-h4-bold">Smart Piggy Bank</h1>
      </div>
    </>
  );
}
