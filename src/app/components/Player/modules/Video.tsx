import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext, useRef } from "react";
import { Viewer } from "../../Common/types/common.types";
import Controls from "./Controls";
import Player from "./Player";
import { VideoProps } from "../types/player.types";
import useControls from "../hooks/useControls";

const Video: FunctionComponent<VideoProps> = ({
  dict,
  fetchMoreVideos,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const wrapperRef = useRef<HTMLVideoElement | null>(null);
  const {
    progressRef,
    handleSeek,
    handleHeart,
    handleVolumeChange,
    volume,
    setVolumeOpen,
    volumeOpen,
    interactionsLoading,
    like,
    simpleCollect,
    mirror,
  } = useControls(dict, wrapperRef);

  return (
    <div
      className={`${
        context?.viewer === Viewer.Autograph
          ? "h-fit sm:h-20 z-0 relative w-full bg-offBlack"
          : context?.viewer === Viewer.Collect ||
            context?.viewer === Viewer.Chat ||
            context?.viewer === Viewer.Sampler
          ? "h-fit sm:h-28 bg-chroma bg-cover z-0 relative w-full"
          : "z-0 relative w-full h-full"
      } flex gap-2 justify-center items-center`}
    >
      <div
        className={`relative w-full h-full flex gap-2 items-center justify-center ${
          context?.viewer === Viewer.Collect ||
          context?.viewer === Viewer.Chat ||
          context?.viewer === Viewer.Sampler
            ? "flex-col sm:flex-row bg-black/50 p-2"
            : context?.viewer === Viewer.Autograph
            ? "flex-col sm:flex-row bg-offBlack p-2"
            : "flex-col pb-1"
        }`}
      >
        <Player
          volume={volume}
          fetchMoreVideos={fetchMoreVideos}
          wrapperRef={wrapperRef}
        />
        <Controls
          fetchMoreVideos={fetchMoreVideos}
          progressRef={progressRef}
          handleSeek={handleSeek}
          handleHeart={handleHeart}
          handleVolumeChange={handleVolumeChange}
          volume={volume}
          setVolumeOpen={setVolumeOpen}
          volumeOpen={volumeOpen}
          interactionsLoading={interactionsLoading}
          like={like}
          simpleCollect={simpleCollect}
          mirror={mirror}
        />
      </div>
    </div>
  );
};

export default Video;
