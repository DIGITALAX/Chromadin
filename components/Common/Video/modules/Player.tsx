import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerProps } from "../types/controls.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { Viewer } from "../../Interactions/types/interactions.types";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { setChannelsRedux } from "@/redux/reducers/channelsSlice";
import { VideoMetadataV3 } from "kinora-sdk/dist/@types/generated";
import { Player as LivePeerPlayer } from "@livepeer/react";

const Player: FunctionComponent<PlayerProps> = ({
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
  setVideoControlsInfo,
}): JSX.Element => {
  return (
    <div
      className={`relative overflow-hidden justify-center items-center flex ${
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
      ref={wrapperRef}
    >
      {viewer !== Viewer.Sampler && videoSync?.heart && (
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
        <div className="relative z-0" id={allVideos?.main?.id}>
          <KinoraPlayerWrapper
            parentId={allVideos?.main?.id}
            key={
              allVideos?.channels?.[
                (videoSync?.currentIndex + 1) % allVideos?.channels?.length
              ]?.id
            }
            customControls={true}
            postId={allVideos?.main?.id}
            styles={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              position: "relative",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              zIndex: "0",
            }}
            fillWidthHeight
            volume={{
              id: Math.random() * 0.5,
              level: muted ? 0 : volume,
            }}
            seekTo={{
              id: Math.random() * 0.5,
              time: videoSync?.currentTime,
            }}
            play={videoSync?.isPlaying}
            onEnded={async () => {
              setVideoControlsInfo((prev) => ({
                ...prev,
                isPlaying: false,
              }));

              let nextIndex = videoSync?.currentIndex + 1;

              if (
                hasMore &&
                nextIndex % allVideos?.channels?.length === 0 &&
                !videosLoading
              ) {
                setVideosLoading(true);
                const more = await fetchMoreVideos();

                dispatch(
                  setChannelsRedux({
                    actionChannels: more,
                    actionMain: more?.[nextIndex],
                  })
                );

                setVideosLoading(false);

                setVideoControlsInfo((prev) => ({
                  ...prev,
                  isPlaying: true,
                  currentTime: 0,
                  currentIndex: nextIndex,
                }));
              } else if (!videoSync?.isPlaying) {
                dispatch(
                  setChannelsRedux({
                    actionChannels: allVideos?.channels,
                    actionMain:
                      allVideos?.channels?.[
                        nextIndex % allVideos?.channels?.length
                      ],
                  })
                );

                setVideoControlsInfo((prev) => ({
                  ...prev,
                  isPlaying: true,
                  currentTime: 0,
                  currentIndex: nextIndex % allVideos?.channels?.length,
                }));
              }
            }}
            onCanPlay={(e) =>
              !muted &&
              setVideoControlsInfo((prev) => ({
                ...prev,
                duration: (e.target as any)?.duration,
              }))
            }
            onTimeUpdate={(e) =>
              setVideoControlsInfo((prev) => ({
                ...prev,
                currentTime: (e.target as any)?.currentTime,
              }))
            }
          >
            {(setMediaElement: (node: HTMLVideoElement) => void) => (
              <LivePeerPlayer
                mediaElementRef={setMediaElement}
                // playbackId={videoPlaying?.playerId}
                src={
                  (
                    allVideos?.channels?.[videoSync?.currentIndex]
                      ?.metadata as VideoMetadataV3
                  )?.asset?.video?.optimized?.uri ||
                  (
                    allVideos?.channels?.[videoSync?.currentIndex]
                      ?.metadata as VideoMetadataV3
                  )?.asset?.video?.raw?.uri
                }
                showLoadingSpinner={false}
                objectFit="cover"
                // autoUrlUpload={{
                //   fallback: true,
                //   ipfsGateway: INFURA_GATEWAY,
                // }}
              />
            )}
          </KinoraPlayerWrapper>
        </div>
      )}
    </div>
  );
};

export default Player;
