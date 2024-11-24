import React, { useState, useRef, useEffect } from "react";

export default function InputPin({
  textPin,
  className,
  data: initialData,
  onChange,
}) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  // สร้าง refs สำหรับแต่ละ input
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (index, value) => {
    // รับเฉพาะตัวเลข
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // ส่งค่า PIN กลับไปยัง parent component
    const completedPin = newPin.join("");
    onChange(completedPin);

    // ถ้ามีการใส่ตัวเลข ให้ focus ไปช่องถัดไป
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // ถ้ากด Backspace และช่องว่างเปล่า ให้ย้อนกลับไปช่องก่อนหน้า
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = "";
      setPin(newPin);
      onChange(newPin.join(""));
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div>
      <h2 className="md:text-h3-bold sm:text-h5-bold font-bold text-neutral-white-800 xl:mb-[10px] sm:mb-2">
        {textPin}
      </h2>
      <div
        className={`flex justify-center md:gap-5 sm:gap-[6px] mb-2 ${className}`}
      >
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            className={`md:w-[72px] md:h-[102px] sm:w-[44px] sm:h-[62px] text-h2-bold text-center md:text-h2-bold sm:text-h4-bold rounded-md focus:outline-none ${
              digit
                ? "border border-neutral-white-800 text-neutral-white-800"
                : "border border-neutral-white-300 text-neutral-white-300"
            }`}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
