import LogoImage from "@images/logo-pic.svg";
import HamburgerMenu from "@images/hamburger-menu.svg";
import FriendPartyModal from "@modals/FriendPartyModal";
import BtnYellow from "../components/BtnYellow";
import CloseIcon from "@images/icon-close.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import { cn } from "../lib/tailwindcss";
import { Link } from "react-router-dom";

import React, { useEffect, useRef, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useScreen } from "@/hooks/useScreen";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logOut } = useUserAuth();
  const [showFriendPartyModal, setShowFriendPartyModal] = useState(false);
  const modalRef = useRef(null);
  const [userPin, setUserPin] = useState(null);
  const [showNavItems, setShowNavItems] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation().pathname;

  const { isMobile } = useScreen();

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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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
          <img
            src={LogoImage}
            alt=""
            className="lg:size-[88px] md:size-[64px] sm:size-[56px]"
          />
          <h1 className="md:text-h3-bold sm:text-h4-bold">Smart Piggy Bank</h1>
        </Link>

        <div className="flex gap-1 lg:gap-5 items-center text-h4-bold lg:text-h3-bold">
          {user && showNavItems && (
            <>
              {!isMobile ? (
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
              ) : (
                <>
                  <button onClick={() => setIsOpen(true)} className="px-4 py-2">
                    <div className="relative" ref={modalRef}>
                      <img src={HamburgerMenu} alt="" className="size-[36px]" />
                    </div>
                  </button>

                  <div
                    className={cn(
                      "fixed inset-0 z-50 transition-transform duration-300 translate-x-full flex justify-end backdrop-blur-[2px]",
                      isOpen && "translate-x-0"
                    )}
                  >
                    <div className="max-w-[246px] w-full bg-primary-100 rounded-lg shadow-main-shadow ">
                      <div className="flex flex-col gap-2 w-full h-full justify-between">
                        <div className="flex flex-col">
                          <div className="flex justify-end pt-[50px] pr-[28px] pb-[20px]">
                            <button onClick={() => setIsOpen(false)}>
                              <img
                                src={CloseIcon}
                                alt=""
                                className="size-[14px]"
                              />
                            </button>
                          </div>
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
                        </div>

                        <div className="flex justify-center gap-2 pb-[17px] items-center">
                          <img
                            src={LogoImage}
                            alt=""
                            className="lg:size-[28px] md:size-[28px] size-[28px]"
                          />
                          <h1 className="text-h5-bold lg:text-h1-bold">
                            Smart Piggy Bank
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
  const location = useLocation();
  const isActive = location.pathname === to;
  const { isMobile } = useScreen();

  return (
    <Link
      className={cn(
        "px-4 py-2",
        isActive && !isMobile && "border-b-4 border-primary-500",
        className
      )}
      to={to}
    >
      <span
        className={cn("text-secondary-300", isActive && "text-primary-500")}
      >
        {text}
      </span>
    </Link>
  );
};
