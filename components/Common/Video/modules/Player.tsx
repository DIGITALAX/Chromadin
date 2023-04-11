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
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].metadata.media[0].original.url.split("ipfs://")[1]
                }`,
                actionCollected:
                  videos[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].hasCollectedByMe,
                actionLiked:
                  likedArray[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ],
                actionMirrored:
                  mirroredArray[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ],
                actionId:
                  videos[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].id,
                actionLocal: `${
                  json[
                    currentIndex === videos.length - 1
                      ? 0
                      : currentIndex === 0
                      ? videos.length - 1
                      : currentIndex + 1
                  ].link
                }`,
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
