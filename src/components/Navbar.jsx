import LogoImage from "@images/logo-pic.svg";
import HamburgerMenu from "@images/hamburger-menu.svg";
import FriendPartyModal from "@modals/FriendPartyModal";
import BtnYellow from "../components/BtnYellow";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import { cn } from "../lib/tailwindcss";
import { Link } from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const [showFriendPartyModal, setShowFriendPartyModal] = useState(false);
  const modalRef = useRef(null);
  const [userPin, setUserPin] = useState(null);
  const [showNavItems, setShowNavItems] = useState(false);

  useEffect(() => {
    const fetchAndWatchUserPin = async () => {
      if (user?.uid) {
        const userDocRef = doc(db, "users", user.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const pin = docSnap.data().pin;
            setUserPin(pin);
            setShowNavItems(pin !== null);
          }
        });

        return () => unsubscribe();
      } else {
        setUserPin(null);
        setShowNavItems(false);
      }
    };

    fetchAndWatchUserPin();
  }, [user]);

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

  const handleCreateParty = async () => {
    try {
      navigate("/create-party");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="w-full flex pt-[20px] pb-[16px] items-center justify-between">
        <Link to="/home" className="flex items-center gap-[6px]">
          <img src={LogoImage} alt="" className="size-[88px]" />
          <h1 className="text-h3-bold">Smart Piggy Bank</h1>
        </Link>

        <div className="flex gap-5 text-h3-bold">
          {user && showNavItems && (
            <>
              <NavbarItem text="ปลดล็อค" to="/unlock-pin" />
              <NavbarItem text="สร้างปาร์ตี้" to="/create-party" />
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
              <NavbarItem text="โปรไฟล์" to="/profile" />
            </>
          )}
          {!user && (
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

const NavbarItem = ({ text, className, to }) => {
  return (
    <Link className={cn("px-4 py-2 ", className)} to={to}>
      <span className="text-secondary-300">{text}</span>
    </Link>
  );
};
