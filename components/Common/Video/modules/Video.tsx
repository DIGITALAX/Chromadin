import { FunctionComponent } from "react";
import Controls from "@/components/Common/Video/modules/Controls";
import { VideoProps } from "../types/controls.types";
import Player from "./Player";
import { Viewer } from "../../Interactions/types/interactions.types";

const Video: FunctionComponent<VideoProps> = ({
  viewer,
  hasMore,
  streamRef,
  formatTime,
  volume,
  handleVolumeChange,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  mirror,
  collect,
  like,
  wrapperRef,
  progressRef,
  handleSeek,
  videoSync,
  fetchMoreVideos,
  videosLoading,
  setVideosLoading,
  dispatch,
  lensProfile,
  allVideos,
  interactionsLoading,
}): JSX.Element => {
  return (
    <div
      className={`${
        viewer === Viewer.Autograph
          ? "h-fit preG:h-20 z-0 relative w-full bg-offBlack"
          : viewer === Viewer.Sampler
          ? "absolute top-0 z-2 w-0 h-0"
          : viewer === Viewer.Collect || viewer === Viewer.Chat
          ? "h-fit preG:h-28 bg-chroma bg-cover z-0 relative w-full"
          : "h-[15rem] galaxy:h-[20rem] preG:h-[25rem] sm:h-[30rem] mid:h-[35.8rem] z-0 relative w-full"
      } flex gap-2 justify-center items-center`}
    >
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center ${
          viewer === Viewer.Collect || viewer === Viewer.Chat
            ? "flex-col preG:flex-row bg-black/50 p-2"
            : viewer === Viewer.Autograph
            ? "flex-col preG:flex-row bg-offBlack p-2"
            : "flex-col"
        }`}
      >
        <Player
          viewer={viewer}
          streamRef={streamRef}
          volume={volume}
          wrapperRef={wrapperRef}
          allVideos={allVideos}
          fullScreen={false}
          videoSync={videoSync}
          muted={false}
          dispatch={dispatch}
          hasMore={hasMore}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
        />
        {viewer !== Viewer.Sampler && (
          <Controls
            formatTime={formatTime}
            volume={volume}
            lensProfile={lensProfile}
            handleVolumeChange={handleVolumeChange}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            handleHeart={handleHeart}
            mirror={mirror}
            collect={collect}
            like={like}
            interactionsLoading={interactionsLoading}
            progressRef={progressRef}
            handleSeek={handleSeek}
            allVideos={allVideos}
            videoSync={videoSync}
            dispatch={dispatch}
            hasMore={hasMore}
            fetchMoreVideos={fetchMoreVideos}
            videosLoading={videosLoading}
            setVideosLoading={setVideosLoading}
            viewer={viewer}
          />
        )}
      </div>
    </div>
  );
};

export default Video;
