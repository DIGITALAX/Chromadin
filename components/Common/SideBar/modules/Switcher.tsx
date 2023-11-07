import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import MarqueeText from "react-fast-marquee";
import { SwitcherProps } from "../types/sidebar.types";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";

const Switcher: FunctionComponent<SwitcherProps> = ({
  options,
  dispatch,
}): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-fit flex-col flex-wrap">
      <video
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
        poster={`${INFURA_GATEWAY}/ipfs/QmdAo2VbLNBcso528sGYBKLWdfN7FDBZWqakphLGxXTppU`}
        className="absolute w-full h-full object-cover"
      >
        <source src={"/videos/glitch.mp4"} type="video/mp4" />
      </video>
      <div className="relative w-full h-full flex flex-row px-2 gap-4">
        <div className="relative w-full h-full flex flex-col">
          <div className="relative w-full h-fit flex flex-row py-2">
            <div className="relative w-4 lg:w-10 h-4 lg:h-8">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
                layout="fill"
                alt="player"
                draggable={false}
              />
            </div>
            <div className="relative w-full h-fit font-geom flex text-white flex flex-col">
              <div className="relative w-full h-fit flex justify-end text-xxs lg:text-sm text-right">
                LIVE TRANSMISSION
              </div>
              <div className="relative w-full h-fit flex justify-end text-xxs lg:text-sm">
                24 - 7 - 365
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row gap-1 items-center justify-end lg:flex-nowrap flex-wrap lg:pb-0 pb-2">
            {Array.from([
              ["QmZxFboSxnP4AL4YgYVrRLri2JrvGTn3fEHjbYB5gVBuTA", "sampler"],
              ["QmeE6aepU7wpHdjH8L3tpFwtV5jBhoytE3NhHWmi3qGDjo", "stream"],
              ["QmTZ5Rj837exSGmt4FxEcth8uJMZFaYYDv9h6C67xx1yDg", "collect"],
              ["QmNpdJ2nak6TTb452swiUuQWMoFqhm3kqoYxH4er2zh6s4", "chat"],
            ]).map((values: string[], index: number) => {
              return (
                <div
                  className="relative w-fit justify-center lg:w-full h-full grid grid-flow-row auto-rows-auto flex items-center"
                  key={index}
                  onClick={() => {
                    dispatch(setCollectOpen(false));
                    if (router.asPath.includes("&profile=")) {
                      router.push(
                        `#${values[1]}` +
                          "?option=" +
                          (options ? options : "history") +
                          "&profile=" +
                          router.asPath.split("&profile=")[1]
                      );
                    } else if (router.asPath.includes("&post=")) {
                      router.push(
                        `#${values[1]}` +
                          "?option=" +
                          (options ? options : "history") +
                          "&post=" +
                          router.asPath.split("&post=")[1]
                      );
                    } else {
                      router.push(
                        `#${values[1]}` +
                          "?option=" +
                          (options ? options : "history")
                      );
                    }
                  }}
                >
                  <div
                    className={`relative w-8 lg:w-12 h-8 lg:h-12 grid grid-flow-col auto-cols-auto justify-self-center items-center  ${"cursor-pointer active:scale-95"}`}
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/QmPoXfm1VgBsE4eE3UZw6uGoFAVwShnz6zaEuXkHdryoc9`}
                      alt="border"
                      layout="fill"
                      draggable={false}
                    />
                    <div className="relative place-self-center col-start-1 w-3 h-3 lg:w-6 lg:h-6 flex">
                      <Image
                        alt="border"
                        src={`${INFURA_GATEWAY}/ipfs/${values[0]}`}
                        layout="fill"
                        draggable={false}
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit justify-self-center font-digi text-white text-xxs lg:text-sm row-start-2 flex">
                    {values[1]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-fit h-full font-arcade word-break uppercase text-sm lg:text-4xl flex justify-center grid grid-flow-row auto-rows-auto leading-3 pt-2 lg:pt-0">
          <span className="rainbow">CHR</span>
          <span className="rainbow">OMA</span>
          <span className="static">DIN</span>
        </div>
      </div>
      <div className="relative w-full h-full border-white border">
        <MarqueeText
          gradient={false}
          speed={70}
          direction={"right"}
          className="z-0"
        >
          <div className="relative w-full h-fit text-white font-arcade font-digiB uppercase text-xxs lg:text-base py-px lg:py-2">
            There are whispers of new apps that can&apos;t be taken away from
            you. Stirrings of resistance decentralized in code. Where users own
            the network, direct messages are reliably private, and the channels
            we see the world through can be counted on to stay fully
            independent. Engagement and influence flow back to you. Like it was
            always meant to be.{" "}
          </div>
        </MarqueeText>
      </div>
    </div>
  );
};

export default Switcher;
