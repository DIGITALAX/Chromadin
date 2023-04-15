import { FunctionComponent } from "react";
import Controls from "@/components/Common/Video/modules/Controls";
import useControls from "../hooks/useControls";
import { VideoProps } from "../types/controls.types";
import Player from "./Player";
import useChannels from "../../SideBar/hooks/useChannels";

const Video: FunctionComponent<VideoProps> = ({ viewer }): JSX.Element => {
  const {
    fullScreen,
    setFullScreen,
    streamRef,
    formatTime,
    duration,
    currentTime,
    volume,
    handleVolumeChange,
    isPlaying,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    heart,
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorLoading,
    collectLoading,
    likeLoading,
    profileId,
    authStatus,
    mainVideo,
    videoLoading,
    setVideoLoading,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    wrapperRef,
  } = useControls();
  const { videos, mirrored, liked } = useChannels();
  return (
    <div
      className={`relative w-full ${
        viewer === "collect"
          ? "h-28 bg-chroma bg-cover"
          : "h-[15rem] galaxy:h-[20rem] preG:h-[25rem] sm:h-[30rem] mid:h-[35.8rem]"
      } flex gap-2 justify-center items-center`}
    >
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center ${
          viewer === "collect" ? "flex-row bg-black/50 p-2" : "flex-col"
        }`}
      >
        <Player
          viewer={viewer}
          heart={heart}
          streamRef={streamRef}
          mainVideo={mainVideo}
          videoLoading={videoLoading}
          setVideoLoading={setVideoLoading}
          isPlaying={isPlaying}
          setCurrentTime={setCurrentTime}
          setDuration={setDuration}
          videos={videos}
          likedArray={liked}
          mirroredArray={mirrored}
          volume={volume}
          wrapperRef={wrapperRef}
        />
        <Controls
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
          formatTime={formatTime}
          duration={duration}
          currentTime={currentTime}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          isPlaying={isPlaying}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          handleHeart={handleHeart}
          collected={mainVideo.collected}
          mirrored={mainVideo.mirrored}
          liked={mainVideo.liked}
          mirrorVideo={mirrorVideo}
          collectVideo={collectVideo}
          likeVideo={likeVideo}
          likeLoading={likeLoading}
          collectLoading={collectLoading}
          mirrorLoading={mirrorLoading}
          authStatus={authStatus}
          profileId={profileId}
          mainVideo={mainVideo}
          likedArray={liked}
          mirroredArray={mirrored}
          videos={videos}
          setIsPlaying={setIsPlaying}
        />
      </div>
    </div>
  );
};

export default Video;
