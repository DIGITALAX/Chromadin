import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/controls.types";
import dynamic from "next/dynamic";
import json from "./../../../../public/videos/local.json";
import { useDispatch } from "react-redux";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import lodash from "lodash";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });

const Player: FunctionComponent<PlayerProps> = ({
  viewer,
  heart,
  streamRef,
  mainVideo,
  videoLoading,
  setVideoLoading,
  isPlaying,
  videos,
  likedArray,
  mirroredArray,
  volume,
  setCurrentTime,
  setDuration,
  wrapperRef,
}): JSX.Element => {
  const dispatch = useDispatch();
  const currentIndex = lodash.findIndex(videos, { id: mainVideo.id });
  return (
    <div
      className={`relative justify-center items-center flex ${
        viewer === "collect"
          ? "w-24 h-1/2"
          : "w-full h-[10rem] galaxy:h-[15rem] preG:h-[20rem] sm:h-[26rem] mid:h-[33rem]"
      }`}
      key={mainVideo.local}
      ref={wrapperRef}
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
        <ReactPlayer
          url={mainVideo.local}
          playing={isPlaying}
          playsinline
          light={false}
          ref={streamRef}
          style={{
            width: "100%",
            height: "100%",
          }}
          width="100%"
          height="100%"
          onEnded={() =>
            dispatch(
              setMainVideo({
                actionVideo: `${INFURA_GATEWAY}/ipfs/${
                  videos[
                    (currentIndex + 1) % videos.length
                  ].metadata.media[0].original.url.split("ipfs://")[1]
                }`,
                actionCollected:
                  videos[(currentIndex + 1) % videos.length].hasCollectedByMe,
                actionLiked: likedArray[(currentIndex + 1) % videos.length],
                actionMirrored:
                  mirroredArray[(currentIndex + 1) % videos.length],
                actionId: videos[(currentIndex + 1) % videos.length].id,
                actionLocal: `${json[(currentIndex + 1) % videos.length].link}`,
              })
            )
          }
          volume={volume}
          onDuration={(duration) => setDuration(duration)}
          onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
        />
      )}
    </div>
  );
};

export default Player;
