import LogoImage from "@images/logo-pic.svg";
import HamburgerMenu from "@images/hamburger-menu.svg";
import FriendPartyModal from "@modals/FriendPartyModal";
import BtnYellow from "../components/BtnYellow";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import { cn } from "../lib/tailwindcss";
import { Link } from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const [showFriendPartyModal, setShowFriendPartyModal] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFriendPartyModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleShowFriendPartyModal = () => {
    setShowFriendPartyModal(true);
  };

  const handleRegister = async () => {
    try {
      navigate("/register");
      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogin = async () => {
    try {
      logOut();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex pt-[20px] pb-[16px] items-center justify-between">
        <Link to="/login" className="flex items-center gap-[6px]">
          <img src={LogoImage} alt="" className="size-[88px]" />
          <h1 className="text-h3-bold">Smart Piggy Bank</h1>
        </Link>

        <div className="flex gap-5 text-h3-bold ">
          {user ? (
            <>
              <NavbarItem text="ปลดล็อค" href="/unlock" />
              <NavbarItem text="สร้างปาร์ตี้" href="/create-party" />
              <div role="button" className="px-4 py-2">
                <div className="relative" ref={modalRef}>
                  <span
                    onClick={handleShowFriendPartyModal}
                    className="text-secondary-300"
                  >
                    คอมมูนิตี้
                  </span>
                  {showFriendPartyModal && <FriendPartyModal />}
                </div>
              </div>
              <NavbarItem text="โปรไฟล์" href="/profile" />
              <a className="px-4 py-2" style={{ display: "none" }}>
                <img src={HamburgerMenu} alt="" className="size-[34px]" />
              </a>
              <BtnYellow
                className="px-7"
                text={"ออกจากระบบ"}
                onClick={handleLogin}
              />
            </>
          ) : (
            <>
              <BtnYellow
                className="px-7"
                text="สมัครสมาชิก"
                onClick={handleRegister}
              />
            </>
          )}
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
