import { useEffect, useState } from "react";

export const useScreen = () => {
  const [screen, setScreen] = useState({
    isMobile: window.innerWidth < 744,
    isTablet: window.innerWidth >= 744 && window.innerWidth < 1134,
    isDesktop: window.innerWidth >= 1134,
  });

  const resize = () => {
    setScreen({
      isMobile: window.innerWidth < 744,
      isTablet: window.innerWidth >= 744 && window.innerWidth < 1134,
      isDesktop: window.innerWidth >= 1134,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return screen;
};
