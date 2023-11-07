import { FunctionComponent } from "react";
import json from "./../../../../public/videos/local.json";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import lodash from "lodash";
import { INFURA_GATEWAY } from "@/lib/constants";
import { ComponentProps } from "../types/controls.types";
import ReactPlayer from "react-player/lazy";
import { setVideoSync } from "@/redux/reducers/videoSyncSlice";

const Component: FunctionComponent<ComponentProps> = ({
  streamRef,
  mainVideo,
  isPlaying,
  volume,
  dispatchVideos,
  muted,
  videoSync,
  dispatch,
  hasMore,
  fetchMoreVideos,
  videosLoading,
  setVideosLoading,
}): JSX.Element => {
  const currentIndex = lodash.findIndex(dispatchVideos, { id: mainVideo.id });
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
      onEnded={
        hasMore &&
        (currentIndex + 1) % dispatchVideos?.length === 0 &&
        !videosLoading
          ? async () => {
              setVideosLoading(true);
              const more = await fetchMoreVideos();

              dispatch(
                setMainVideo({
                  actionVideo: `${INFURA_GATEWAY}/ipfs/${
                    more?.videos[
                      (currentIndex + 1) % more?.videos?.length!
                    ]?.metadata?.media[0]?.original?.url?.split("ipfs://")[1]
                  }`,
                  actionCollected:
                    more?.collects[(currentIndex + 1) % more?.videos?.length!],
                  actionLiked:
                    more?.likes[(currentIndex + 1) % more?.videos?.length!],
                  actionMirrored:
                    more?.mirrors[(currentIndex + 1) % more?.videos?.length!],
                  actionId:
                    more?.videos[(currentIndex + 1) % more?.videos?.length!]
                      ?.id,
                  actionLocal: `${
                    json[(currentIndex + 1) % more?.videos?.length!]?.link
                  }`,
                })
              );
              setVideosLoading(false);
            }
          : () =>
              dispatch(
                setMainVideo({
                  actionCollected:
                    videoSync.collectedArray[
                      (currentIndex + 1) % dispatchVideos?.length
                    ],
                  actionLiked:
                    videoSync.likedArray[
                      (currentIndex + 1) % dispatchVideos?.length
                    ],
                  actionMirrored:
                    videoSync.mirroredArray[
                      (currentIndex + 1) % dispatchVideos?.length
                    ],
                  actionId:
                    dispatchVideos[(currentIndex + 1) % dispatchVideos?.length]
                      .id,
                  actionLocal: `${
                    json[(currentIndex + 1) % dispatchVideos?.length].link
                  }`,
                })
              )
      }
      volume={volume}
      onDuration={(duration) =>
        !muted &&
        dispatch(
          setVideoSync({
            actionHeart: videoSync.heart,
            actionDuration: duration,
            actionCurrentTime: videoSync.currentTime,
            actionIsPlaying: videoSync.isPlaying,
            actionLikedArray: videoSync.likedArray,
            actionMirroredArray: videoSync.mirroredArray,
            actionCollectedArray: videoSync.collectedArray,
            actionVideosLoading: videoSync.videosLoading,
          })
        )
      }
      onProgress={(progress) =>
        !muted &&
        dispatch(
          setVideoSync({
            actionHeart: videoSync.heart,
            actionDuration: videoSync.duration,
            actionCurrentTime: progress.playedSeconds,
            actionIsPlaying: videoSync.isPlaying,
            actionLikedArray: videoSync.likedArray,
            actionMirroredArray: videoSync.mirroredArray,
            actionCollectedArray: videoSync.collectedArray,
            actionVideosLoading: videoSync.videosLoading,
          })
        )
      }
      muted={muted}
    />
  );
};

export default Component;
