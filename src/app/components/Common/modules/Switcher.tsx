import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import MarqueeText from "react-fast-marquee";
import { Viewer } from "../types/common.types";
import { ModalContext } from "@/app/providers";

const Switcher: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex-col flex-wrap">
      <video
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        poster={`${INFURA_GATEWAY_INTERNAL}QmdAo2VbLNBcso528sGYBKLWdfN7FDBZWqakphLGxXTppU`}
        className="absolute w-full h-full object-cover"
      >
        <source src={"/videos/glitch.mp4"} type="video/mp4" />
      </video>
      <div className="relative w-full h-fit px-2 flex flex-row gap-4">
        <div className="relative w-full h-full flex flex-col">
          <div className="relative w-full h-fit flex flex-row py-2">
            <div className="relative w-4 lg:w-10 h-4 lg:h-8">
              <Image
                src={`${INFURA_GATEWAY_INTERNAL}QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
                layout="fill"
                alt="player"
                draggable={false}
              />
            </div>
            <div className="relative w-full h-fit font-geom flex text-white flex flex-col">
              <div className="relative w-full h-fit flex justify-end text-xxs lg:text-sm text-right">
                {dict?.Common?.trans}
              </div>
              <div className="relative w-full h-fit flex justify-end text-xxs lg:text-sm">
                24 - 7 - 365
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row gap-1 items-center justify-end lg:flex-nowrap flex-wrap lg:pb-0 pb-2">
            {[
              {
                image: "QmZxFboSxnP4AL4YgYVrRLri2JrvGTn3fEHjbYB5gVBuTA",
                title: {
                  en: "sampler",
                  es: "sampler",
                },
              },
              {
                image: "QmeE6aepU7wpHdjH8L3tpFwtV5jBhoytE3NhHWmi3qGDjo",
                title: {
                  en: "stream",
                  es: "flujo",
                },
              },
              {
                image: "QmTZ5Rj837exSGmt4FxEcth8uJMZFaYYDv9h6C67xx1yDg",
                title: {
                  en: "collect",
                  es: "acumular",
                },
              },
              {
                image: "QmNpdJ2nak6TTb452swiUuQWMoFqhm3kqoYxH4er2zh6s4",
                title: {
                  en: "chat",
                  es: "chat",
                },
              },
            ].map(
              (
                values: { image: string; title: { en: string; es: string } },
                index: number
              ) => {
                return (
                  <div
                    className="relative w-fit justify-center lg:w-full h-full grid grid-flow-row auto-rows-auto flex items-center"
                    key={index}
                    onClick={() =>
                      context?.setViewer(values.title.en as Viewer)
                    }
                  >
                    <div
                      className={`relative w-8 lg:w-12 h-8 lg:h-12 grid grid-flow-col auto-cols-auto justify-self-center items-center  ${"cursor-pointer active:scale-95"}`}
                    >
                      <Image
                        src={`${INFURA_GATEWAY_INTERNAL}QmPoXfm1VgBsE4eE3UZw6uGoFAVwShnz6zaEuXkHdryoc9`}
                        alt="border"
                        layout="fill"
                        draggable={false}
                      />
                      <div className="relative place-self-center col-start-1 w-3 h-3 lg:w-6 lg:h-6 flex">
                        <Image
                          alt="border"
                          src={`${INFURA_GATEWAY_INTERNAL}${values.image}`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div className="relative w-fit h-fit justify-self-center font-digi text-white text-xxs lg:text-sm row-start-2 flex">
                      {values.title[path.includes("/en/") ? "en" : "es"]}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
        <div className="relative w-fit h-full font-arcade word-break uppercase text-sm sm:text-2xl flex items-center justify-between flex flex-col gap-2">
          <span className="rainbow">CHR</span>
          <span className="rainbow">OMA</span>
          <span className="static">DIN</span>
        </div>
      </div>
      <div className="relative w-full h-fit border-white border">
        <MarqueeText
          gradient={false}
          speed={70}
          direction={"right"}
          className="z-0"
        >
          <div className="relative w-full h-fit text-white font-arcade font-digiB uppercase text-xxs lg:text-base py-px lg:py-2">
            {dict?.Common?.whis}{" "}
          </div>
        </MarqueeText>
      </div>
    </div>
  );
};

export default Switcher;
