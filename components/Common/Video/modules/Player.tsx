import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/controls.types";
import dynamic from "next/dynamic";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { Viewer } from "../../Interactions/types/interactions.types";

const Component = dynamic(() => import("./Component"), { ssr: false });

const Player: FunctionComponent<PlayerProps> = ({
  streamRef,
  volume,
  wrapperRef,
  allVideos,
  fullScreen,
  muted,
  videoSync,
  dispatch,
  viewer,
  hasMore,
  fetchMoreVideos,
  setVideosLoading,
  videosLoading,
}): JSX.Element => {
  return (
    <div
      className={`relative justify-center items-center flex ${
        fullScreen
          ? "w-full h-full"
          : viewer === Viewer.Sampler
          ? "w-0 h-0"
          : viewer === Viewer.Collect ||
            viewer === Viewer.Chat ||
            viewer === Viewer.Autograph
          ? "w-24 h-1/2"
          : "w-full h-[10rem] galaxy:h-[15rem] preG:h-[20rem] sm:h-[26rem] mid:h-[33rem]"
      }`}
      key={allVideos?.main?.local!}
      ref={wrapperRef}
    >
      {viewer !== Viewer.Sampler && videoSync.heart && (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full flex object-cover z-1"
          draggable={false}
        />
      )}
      {videoSync.videosLoading && viewer !== Viewer.Sampler ? (
        <div
          className={`relative bg-offBlack flex flex-col items-center justify-center ${
            viewer !== Viewer.Collect ? "w-full h-full" : "w-20 h-14"
          }`}
        >
          <FetchMoreLoading size="4" />
        </div>
      ) : (
        <Component
          streamRef={streamRef}
          allVideos={allVideos}
          isPlaying={videoSync.isPlaying}
          volume={volume}
          muted={muted}
          videoSync={videoSync}
          dispatch={dispatch}
          hasMore={hasMore}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
        />
      )}
    </div>
  );
};

export default Player;
