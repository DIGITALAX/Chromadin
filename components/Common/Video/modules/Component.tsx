import { FunctionComponent } from "react";
import json from "./../../../../public/videos/local.json";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { useDispatch } from "react-redux";
import lodash from "lodash";
import { INFURA_GATEWAY } from "@/lib/constants";
import { ComponentProps } from "../types/controls.types";
import ReactPlayer from "react-player/lazy";


const Component: FunctionComponent<ComponentProps> = ({
  streamRef,
  mainVideo,
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
            actionMirrored: mirroredArray[(currentIndex + 1) % videos.length],
            actionId: videos[(currentIndex + 1) % videos.length].id,
            actionLocal: `${json[(currentIndex + 1) % videos.length].link}`,
          })
        )
      }
      volume={volume}
      onDuration={(duration) => setDuration(duration)}
      onProgress={(progress) => setCurrentTime(progress.playedSeconds)}
    />
  );
};

export default Component;
