import React from "react";
import { cn } from "../lib/tailwindcss";
export default function btnYellow({ text, className, onClick, type }) {
  return (
    <>
      <button
        className={cn(
          "min-w-[100px py-[10px] bg-primary-500 md:text-h3-bold sm:text-h5-bold rounded-xl drop-shadow-lg hover:duration-200 hover:ease-in-out hover:bg-secondary-600 hover:text-neutral-white-100",
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
