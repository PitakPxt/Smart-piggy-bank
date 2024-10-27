import React from "react";
import { cn } from "../lib/tailwindcss";
import IconClose from "@images/icon-close.svg";

export default function BtnClose({ className }) {
  return (
    <>
      <div
        className={cn(
          "absolute top-0 right-0 cursor-pointer mt-[32px] mr-[32px]",
          className
        )}
      >
        <img src={IconClose} alt="icon-close" />
      </div>
    </>
  );
}
