/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arcade: "Arcade Classic",
        geom: "Geometria",
        digi: "DS Digital",
        earl: "Earls Revenge",
      },
      colors: {
        verde: "#25EC68",
        rosa: "#f62ada",
        light: "#DDC2DE",
        azul: "#B9D9FF",
        lensLight: "#ABFE2C",
        offBlack: "#131313",
        pink: "#F06AAF",
        pesa: "#C9D8E4",
        ama: "#FBDB86",
        moda: "#CFB0FA",
        playa: "#0D3DFF",
        rojo: "#DD3950",
        leche: "#FFFFF2",
      },
      backgroundImage: {
        chroma:
          "url('https://chromadin.infura-ipfs.io/ipfs/QmbfVYvza1xVqGRWiremt4LVKkTPDA8bnURdu39cgP71gd')",
      },
      fontSize: {
        xxs: "0.5rem",
      },
      height: {
        100: "27rem",
        128: "32rem",
      },
      zIndex: {
        1: "1",
        2: "2",
      },
      screens: {
        galaxy: "300px",
        preG: "480px",
        mid: "950px",
        tablet: "1260px",
        wrap: "1360px",
      },
    },
  },
  plugins: [],
};
