import LogoImage from "@images/logo-pic.svg";

import HamburgerMenu from "@images/hamburger-menu.svg";
import FriendRequstModal from "@modals/FriendPartyModal";

import { cn } from "../lib/tailwindcss";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <div className="w-full flex pt-[20px] pb-[16px] items-center justify-between">
        <Link to="/login" className="flex items-center gap-[6px]">
          <img src={LogoImage} alt="" className="size-[88px]" />
          <h1 className="text-h3-bold">Smart Piggy Bank</h1>
        </Link>
        <div className="flex gap-5 text-h3-bold ">
          <NavbarItem text="ปลดล็อค" href="/unlock" />
          <NavbarItem text="สร้างปาร์ตี้" href="/create-party" />
          <a href="#" role="button" className="px-4 py-2  ">
            <div className="relative">
              <span className="text-secondary-300">คอมมูนิตี้</span>{" "}
              {/* <FriendRequstModal /> */}
            </div>
          </a>
          <NavbarItem text="โปรไฟล์" href="/profile" />
          <a className="px-4 py-2" style={{ display: "none" }}>
            <img src={HamburgerMenu} alt="" className="size-[34px]" />
          </a>
        </div>
      </div>
    </>
  );
}

const NavbarItem = ({ text, className, href }) => {
  return (
    <Link className={cn("px-4 py-2 ", className)} href={href}>
      <span className="text-secondary-300">{text}</span>
    </Link>
  );
};
