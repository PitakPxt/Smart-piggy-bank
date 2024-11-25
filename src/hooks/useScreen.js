import { useEffect, useState } from "react";

export const useScreen = () => {
  const [screen, setScreen] = useState({
    isMobile: window.innerWidth < 744,
    isTablet: window.innerWidth >= 744 && window.innerWidth < 1134,
    isTabletHorizontal:
      window.innerWidth >= 1024 &&
      window.innerWidth < 1367 &&
      window.innerHeight >= 768 &&
      window.innerHeight < 1025,
    isDesktop: window.innerWidth >= 1134,
  });

  const resize = () => {
    setScreen({
      isMobile: window.innerWidth < 744,
      isTablet: window.innerWidth >= 744 && window.innerWidth < 1134,
      isTabletHorizontal:
        window.innerWidth >= 1024 &&
        window.innerWidth < 1367 &&
        window.innerHeight >= 768 &&
        window.innerHeight < 1025,
      isDesktop: window.innerWidth >= 1134,
    });
  };

  useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return screen;
};
