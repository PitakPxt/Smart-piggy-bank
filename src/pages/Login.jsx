import Logo from "../components/Logo";
import BgImage from "../assets/images/background.png";
import BtnYellow from "../components/BtnYellow";
import InputLabel from "../components/InputLabel";
import React, { useState } from "react";
import { useUserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { logIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/home");
      toast.success("เข้าสู่ระบบสำเร็จ");

      console.log(user);
    } catch (error) {
      console.log(error);
      toast.error("อีเมล์ หรือ รหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="w-[1196px] h-[708px] bg-primary-100 rounded-3xl overflow-hidden drop-shadow-lg">
          <div
            className="w-full h-full bg-no-repeat bg-contain bg-bottom content-center"
            style={{ backgroundImage: `url(${BgImage})` }}
          >
            <div className="w-[1036px] h-[524px] flex mx-auto overflow-hidden rounded-3xl">
              <div className="w-[518px] h-full">
                <div className="flex flex-col items-center text-center">
                  <Logo />
                  <p className="text-h3 mt-7">
                    ยินดีต้องรับสู่ Smart Piggy Bank <br />
                    โลกที่จะพาคุณไปสนุกกับการออมเงิน
                  </p>
                </div>
              </div>
              <form
                onSubmit={handleSubmit}
                className="w-1/2 bg-neutral-white-100 flex items-center"
              >
                <div className="flex flex-col items-center w-[380px] h-[420px]  mx-auto">
                  <h2 className="text-h2-bold text-center mb-[22px]">
                    เข้าสู่ระบบ
                  </h2>
                  <div className="w-full mb-[38px]">
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
                          <h4 className="text-h4 w-fit cursor-pointer">
                            ลืมรหัสผ่าน?
                          </h4>
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
