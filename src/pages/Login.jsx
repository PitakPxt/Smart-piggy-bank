import Logo from "../components/Logo";
import BgImageDesktop from "../assets/images/background.png";
import BgImageTablet from "../assets/images/background-tablet.png";
import BgImageMobile from "../assets/images/background-mobile.png";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useScreen } from "../hooks/useScreen";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const { isMobile, isTablet, isDesktop } = useScreen();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await logIn(email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      const userData = userDoc.data();

      if (!userData.pin || userData.pin === null) {
        navigate("/unlock-pin");
        toast.info("กรุณาตั้งค่า PIN ก่อนเข้าใช้งาน");
      } else {
        navigate("/home");
        toast.success("เข้าสู่ระบบสำเร็จ");
      }
    } catch (error) {
      toast.error("อีเมล์ หรือ รหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div
          className=" bg-primary-100 rounded-3xl overflow-hidden drop-shadow-lg
          xl:w-[1196px] xl:h-[708px] 
        lg:w-[1040px] lg:h-[620px]
        md:w-[692px] md:h-[892px] 
        sm:w-[344px] sm:h-[564px]"
        >
          <div
            className="w-full h-full bg-no-repeat bg-contain bg-bottom content-center"
            style={{
              backgroundImage: `url(${
                !isMobile
                  ? BgImageDesktop
                  : isTablet
                  ? BgImageTablet
                  : BgImageMobile
              })`,
            }}
          >
            <div
              className="flex mx-auto overflow-hidden rounded-3xl gap-[40px]
              xl:w-[1036px] xl:h-[524px] 
              lg:w-[868px] lg:h-[568px]
              md:w-[568px] md:h-[768px] 
              sm:w-[300px] sm:h-[500px]
              xl:flex-row xl:justify-start xl:items-start
              lg:flex-row lg:justify-start lg:items-start 
              md:flex-col md:justify-center md:items-center 
              sm:flex-col sm:justify-center sm:items-center"
            >
              <div className="w-1/2 h-auto">
                <div className="flex flex-col items-center text-center justify-start">
                  <Logo />
                  <p className="text-h3 mt-7">
                    ยินดีต้องรับสู่ Smart Piggy Bank <br />
                    โลกที่จะพาคุณไปสนุกกับการออมเงิน
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-1/2 h-full flex justify-center items-center"
              >
                <div className="flex flex-col items-center justify-center px-[68px] h-full bg-neutral-white-100">
                  <h2 className="text-h2-bold text-center mb-[22px]">
                    เข้าสู่ระบบ
                  </h2>
                  <div className="w-[382px] mb-[38px]">
                    <div className="flex flex-col gap-2">
                      <InputLabel
                        text="อีเมล์"
                        placeHolder="กรอกอีเมล์"
                        isInline={false}
                        isEye={false}
                        value={email}
                        autoComplete="on"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <InputLabel
                        text="รหัสผ่าน"
                        placeHolder="กรอกรหัสผ่าน"
                        isInline={false}
                        isEye={true}
                        value={password}
                        autoComplete="on"
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <div className="w-full flex justify-end">
                        <Link to="/forget">
                          <span className="text-h4 cursor-pointer">
                            ลืมรหัสผ่าน?
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <BtnYellow
                    type="submit"
                    className={"px-[112px]"}
                    text={"เข้าสู่ระบบ"}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
