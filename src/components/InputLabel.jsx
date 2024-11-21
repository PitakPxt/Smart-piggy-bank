import React from "react";
import IconEyeClose from "@images/icon-EyeClose.svg";
import IconEye from "@images/icon-Eye.svg";
import { cn } from "../lib/tailwindcss";
import { useState } from "react";

export default function InputLabel({
  text,
  placeHolder,
  name,
  className,
  required = false,
  isInline = false,
  value,
  onChange,
  autoComplete,
  isEye = true,
  textLabelClassName,
  inputBorderClassName,
  inputClassName,
}) {
  const [eye, setEye] = useState(isEye);
  const handleEye = () => {
    setEye(!eye);
  };
  return (
    <>
      <div className={cn(isInline ? "flex gap-3.5 items-center" : "w-full")}>
        <h3 className={cn("mb-2 text-h3-bold", textLabelClassName)}>{text}</h3>
        <div
          className={cn(
            "py-[8px] pl-3 pr-3 rounded-[12px] border-[1px] text-h3 relative",
            inputBorderClassName,
            isInline && "flex-1"
          )}
        >
          <input
            className={cn("w-full", inputClassName)}
            name={name}
            type={eye ? "password" : "text"}
            required={required}
            placeholder={placeHolder}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
          />
          {isEye && (
            <img
              className="size-[24px] absolute right-0 bottom-3.5 mr-3 cursor-pointer"
              src={eye ? IconEyeClose : IconEye}
              alt=""
              onClick={handleEye}
            />
          )}
        </div>
      </div>
    </>
  );
}
