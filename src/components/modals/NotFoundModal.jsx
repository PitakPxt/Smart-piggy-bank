import React from "react";
import BtnBack from "../BtnBack";
import { Link } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFoundModal({
  src,
  text,
  className,
  to,
  showBackButton = true,
}) {
  return (
    <>
      <div className="w-full h-full flex justify-center items-center">
        <div
          className="flex flex-col gap-[24px] justify-center items-center bg-neutral-white-100 
        rounded-3xl drop-shadow-lg p-[24px]"
        >
          {showBackButton && (
            <Link to={to}>
              <BtnBack />
            </Link>
          )}
          <DotLottieReact
            renderConfig={{
              autoResize: true,
            }}
            className={className}
            src={src}
            loop
            autoplay
          />
          <h2 className="text-h2-bold p-2">{text}</h2>
        </div>
      </div>
    </>
  );
}
