import React, { useState, useRef } from "react";
import { cn } from "../lib/tailwindcss";

export default function InputPin({
  textPin,
  className,
  data: initialData,
  onChange,
}) {
  const [data, setData] = useState(initialData || "");
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newData = data.slice(0, index) + value + data.slice(index + 1);
      setData(newData.slice(0, 6));
      onChange(newData);

      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newData = data.slice(0, index) + data.slice(index + 1);
      setData(newData);
      onChange(newData);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  return (
    <>
      <div>
        <h2 className="text-h3-bold font-bold text-neutral-white-800 pb-[10px]">
          {textPin}
        </h2>
        <div className={cn("flex justify-center gap-5 mb-2", className)}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={data[index] || ""}
              className={`w-[72px] h-[102px] text-h2-bold text-center text-2xl rounded-md focus:outline-none ${
                data[index]
                  ? "border border-neutral-white-800 text-neutral-white-800"
                  : "border border-neutral-white-300 text-neutral-white-300"
              }`}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
