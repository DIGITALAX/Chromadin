import { FunctionComponent } from "react";
import json from "./../../../../public/videos/local.json";
import lodash from "lodash";
import { ComponentProps } from "../types/controls.types";
import ReactPlayer from "react-player/lazy";
import { setChannelsRedux } from "@/redux/reducers/channelsSlice";
import { setFullScreenVideo } from "@/redux/reducers/fullScreenVideoSlice";

const Component: FunctionComponent<ComponentProps> = ({
  streamRef,
  allVideos,
  isPlaying,
  volume,
  muted,
  videoSync,
  dispatch,
  hasMore,
  fetchMoreVideos,
  videosLoading,
  setVideosLoading,
}): JSX.Element => {
  const currentIndex = lodash.findIndex(allVideos?.channels, {
    id: allVideos?.main?.video?.id,
  });
  return (
    <ReactPlayer
      url={allVideos?.main?.local}
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
        (currentIndex + 1) % allVideos?.channels?.length === 0 &&
        !videosLoading
          ? async () => {
              setVideosLoading(true);
              const more = await fetchMoreVideos();

              dispatch(
                setChannelsRedux({
                  actionChannels: allVideos?.channels,
                  actionMain: {
                    video: more?.[(currentIndex + 1) % more?.length!],
                    local: `${json[(currentIndex + 1) % more?.length!]?.link}`,
                  },
                })
              );

              setVideosLoading(false);
            }
          : () =>
              dispatch(
                setChannelsRedux({
                  actionChannels: allVideos?.channels,
                  actionMain: {
                    video:
                      allVideos?.channels?.[
                        (currentIndex + 1) % allVideos?.channels?.length
                      ],
                    local: `${
                      json[(currentIndex + 1) % allVideos?.channels?.length]
                        ?.link
                    }`,
                  },
                })
              )
      }
      volume={volume}
      onDuration={(duration) =>
        !muted &&
        dispatch(
          setFullScreenVideo({
            actionOpen: videoSync.open,
            actionHeart: videoSync.heart,
            actionDuration: duration,
            actionCurrentTime: videoSync.currentTime,
            actionIsPlaying: videoSync.isPlaying,
            actionSeek: videoSync.seek,
            actionVideosLoading: videoSync.videosLoading,
          })
        )
      }
      onProgress={(progress) =>
        !muted &&
        dispatch(
          setFullScreenVideo({
            actionOpen: videoSync.open,
            actionHeart: videoSync.heart,
            actionDuration: videoSync.duration,
            actionCurrentTime: progress.playedSeconds,
            actionIsPlaying: videoSync.isPlaying,
            actionSeek: videoSync.seek,
            actionVideosLoading: videoSync.videosLoading,
          })
        )
      }
      muted={muted}
    />
  );
};

export default Component;
