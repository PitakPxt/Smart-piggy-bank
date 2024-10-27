import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { cn } from "../lib/tailwindcss";

export default function InputPhone({
  text,
  value,
  onChange,
  placeHolder,
  autoComplete,
  isInline,
  className,
}) {
  return (
    <>
      <div
        className={cn(
          isInline ? "flex gap-3.5 items-center" : "w-full",
          className
        )}
      >
        <h3 className="text-h3-bold mb-2">{text}</h3>
        <PhoneInput
          className="text-h3 mb-[42px]"
          country={"th"}
          value={value}
          placeholder={placeHolder}
          onChange={onChange}
          autoComplete={autoComplete}
        />
      </div>
    </>
  );
}
