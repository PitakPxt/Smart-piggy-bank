import BgImage from "@images/background-Blur.png";
import Navbar from "@components/Navbar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout() {
  return (
    <>
      <ToastContainer position="top-center" />
      <div
        style={{ backgroundImage: `url(${BgImage})` }}
        className="bg-primary-100 bg-no-repeat bg-contain bg-bottom"
      >
        <main className="w-full h-screen flex flex-col container overflow-hidden">
          <Navbar />
          <Outlet />
        </main>
      </div>
    </>
  );
}
