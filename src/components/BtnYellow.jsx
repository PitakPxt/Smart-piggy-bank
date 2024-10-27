import React from "react";
import { cn } from "../lib/tailwindcss";
export default function btnYellow({ text, className, onClick, type }) {
  return (
    <>
      <button
        className={cn(
          "py-[10px] bg-primary-500 text-h3-bold  rounded-xl drop-shadow-lg hover:duration-200 hover:ease-in-out hover:bg-secondary-600 hover:text-neutral-white-100",
          className
        )}
        onClick={onClick}
        type={type}
      >
        {text}
      </button>
    </>
  );
}
