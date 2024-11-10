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
      <h2 className="text-h3-bold font-bold text-neutral-white-800 pb-[10px]">
        {textPin}
      </h2>
      <div className={`flex justify-center gap-5 mb-2 ${className}`}>
        {pin.map((digit, index) => (
          <input
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            className={`w-[72px] h-[102px] text-h2-bold text-center text-2xl rounded-md focus:outline-none ${
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
