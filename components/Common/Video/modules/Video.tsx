import { FunctionComponent } from "react";
import Controls from "@/components/Common/Video/modules/Controls";
import { VideoProps } from "../types/controls.types";
import Player from "./Player";
import { Viewer } from "../../Interactions/types/interactions.types";

const Video: FunctionComponent<VideoProps> = ({
  viewer,
  hasMore,
  setVideoControlsInfo,
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
  router
}): JSX.Element => {
  return (
    <div
      className={`${
        viewer === Viewer.Autograph
          ? "h-fit sm:h-20 z-0 relative w-full bg-offBlack"
          : viewer === Viewer.Sampler
          ? "absolute top-0 z-2 w-0 h-0"
          : viewer === Viewer.Collect || viewer === Viewer.Chat
          ? "h-fit sm:h-28 bg-chroma bg-cover z-0 relative w-full"
          : "h-[15rem] galaxy:h-[20rem] sm:h-[25rem] sm:h-[30rem] mid:h-[35.8rem] z-0 relative w-full"
      } flex gap-2 justify-center items-center`}
    >
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center ${
          viewer === Viewer.Collect || viewer === Viewer.Chat
            ? "flex-col sm:flex-row bg-black/50 p-2"
            : viewer === Viewer.Autograph
            ? "flex-col sm:flex-row bg-offBlack p-2"
            : "flex-col"
        }`}
      >
        <Player
          setVideoControlsInfo={setVideoControlsInfo}
          viewer={viewer}
          volume={volume}
          router={router}
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
            setVideoControlsInfo={setVideoControlsInfo}
            volume={volume}
            router={router}
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
