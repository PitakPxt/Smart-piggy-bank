/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      // padding: "6.75rem",
      // margin: "0 auto",
    },
    // dropShadow: {
    //   "main-shadow": "0 3px 4px rgba(0, 0, 0, 0.25)",
    // },
    screens: {
      sm: "376px",
      md: "744px",
      lg: "1134px",
      xl: "1512px",
    },

    colors: {
      primary: {
        100: "#fff8e9",
        200: "#ffeeca",
        300: "#ffe4ab",
        400: "#ffd06e",
        500: "#ffbc31",
        600: "#ffb212",
        700: "#f3a400",
        800: "#d48f00",
      },
      secondary: {
        100: "#bb9d8a",
        200: "#aa846d",
        300: "#936d55",
        400: "#765845",
        500: "#594234",
        600: "#1f1712",
        700: "#020101",
        800: "#020101",
      },
      "neutral-white": {
        100: "#f9f9f9",
        200: "#efefee",
        300: "#cdccc9",
        400: "#aaa8a5",
        500: "#63615d",
      },
      "neutral-black": {
        100: "3c3a38",
        100: "141413",
        100: "0E0E0E",
      },
      success: {
        100: "#CAF4D5",
        200: "#95E9AA",
        300: "#7BE495",
        400: "#64C07B",
        500: "#4D9B61",
      },
      error: {
        100: "#FFCBCB",
        200: "#FF7373",
        300: "#FF5050",
        400: "#D44040",
        500: "#A93030",
      },
      info: {
        100: "#CCE1FD",
        200: "#98C2FA",
        300: "#76AEF9",
        400: "#549AF7",
        500: "#447ECC",
      },
      warning: {
        100: "#FDF3CB",
        200: "#FCEFBA",
        300: "#FBE697",
        400: "#F9DE75",
        500: "#F8D652",
      },
    },
    fontFamily: {
      sans: ["FC Iconic", "sans-serif"],
      serif: ["Merriweather", "serif"],
    },
  },
  plugins: [],
};
