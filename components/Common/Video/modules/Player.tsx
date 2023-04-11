import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/controls.types";

const Player: FunctionComponent<PlayerProps> = ({
  viewer,
  heart,
  streamRef,
  mainVideo,
  videoLoading,
  setVideoLoading,
}): JSX.Element => {
  return (
    <div
      className={`relative justify-center items-center flex ${
        viewer === "collect" ? "w-24 h-1/2" : "w-full h-[10rem] galaxy:h-[15rem] preG:h-[20rem] sm:h-[26rem] mid:h-[33rem]"
      }`}
      key={mainVideo.local}
    >
      {heart && (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full flex object-cover z-1"
          draggable={false}
        />
      )}
      {videoLoading ? (
        <div className="relative w-full h-full bg-offBlack"></div>
      ) : (
        <video
          loop
          playsInline
          className={`relative object-fit w-full h-full`}
          ref={streamRef}
          onCanPlayThrough={() => setVideoLoading(false)}
          onWaiting={() => setVideoLoading(true)}
        >
          <source src={mainVideo.local} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default Player;
