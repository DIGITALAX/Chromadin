import Image from "next/legacy/image";
import { FunctionComponent, JSX, Ref, useContext } from "react";
import { Viewer } from "../../Common/types/common.types";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import FetchMoreLoading from "../../Common/modules/FetchMoreLoading";
import { PlayerProps } from "../types/player.types";
import { ModalContext } from "@/app/providers";
import { VideoMetadata } from "@lens-protocol/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player as LivePeerPlayer } from "@livepeer/react";

const Player: FunctionComponent<PlayerProps> = ({
  wrapperRef,
  fetchMoreVideos,
  volume,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const search = useSearchParams();


  return (
    <div
      className={`relative overflow-hidden justify-start items-start flex ${
        context?.viewer === Viewer.Collect ||
        context?.viewer === Viewer.Chat ||
        context?.viewer === Viewer.Autograph ||
        context?.viewer === Viewer.Sampler
          ? "w-24 h-1/2"
          : "w-full h-full"
      }`}
      ref={wrapperRef as Ref<HTMLDivElement>}
    >
      {context?.videoControlsInfo?.heart && (
        <Image
          src={`${INFURA_GATEWAY_INTERNAL}QmNPPsBttGAxvu6cX3gWT4cnFF8PMF9C55GgJUehGp3nCA`}
          layout="fill"
          objectFit="cover"
          className="absolute w-full h-full flex object-cover z-1"
          draggable={false}
        />
      )}
      {context?.videoControlsInfo?.videosLoading ? (
        <div
          className={`relative bg-offBlack flex flex-col items-center justify-center ${
            context?.viewer !== Viewer.Collect ? "w-full h-full" : "w-20 h-14"
          }`}
        >
          <FetchMoreLoading size="4" />
        </div>
      ) : (
        <div
          className="relative z-0"
          id={
            context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id
          }
        >
          <KinoraPlayerWrapper
            parentId={
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                ?.id!
            }
            postId={
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                ?.id!
            }
            fillWidthHeight
            key={
              (
                context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                  ?.metadata as VideoMetadata
              )?.video?.item
            }
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
            volume={{
              id: Math.random() * 0.5,
              level: volume,
            }}
            seekTo={{
              id: Math.random() * 0.5,
              time: context?.videoControlsInfo?.currentTime!,
            }}
            play={context?.videoControlsInfo?.isPlaying}
            customControls={true}
            onEnded={
              context?.videoInfo?.hasMore &&
              (Number(context?.videoInfo?.currentIndex) + 1) %
                context?.videoInfo?.channels?.length ===
                0 &&
              !context?.videoControlsInfo?.videosLoading
                ? async () => {
                    context?.setVideoControlsInfo((prev) => ({
                      ...prev,
                      videosLoading: true,
                    }));
                    const more = await fetchMoreVideos();
                    if (more) {
                      context?.setVideoInfo((prev) => ({
                        ...prev,
                        channels: more,
                        currentIndex:
                          Number(context?.videoInfo?.currentIndex) + 1,
                      }));
                    }

                    const params = new URLSearchParams(search.toString());

                    if (params.has("video")) {
                      params.set(
                        "video",
                        more?.[Number(context?.videoInfo?.currentIndex) + 1]
                          ?.id!
                      );
                    } else {
                      params.append(
                        "video",
                        more?.[Number(context?.videoInfo?.currentIndex) + 1]
                          ?.id!
                      );
                    }

                    router.replace(`${path}?${params.toString()}`);

                    context?.setVideoControlsInfo((prev) => ({
                      ...prev,
                      videosLoading: false,
                    }));
                  }
                : () => {
                    if (!context?.videoControlsInfo?.videosLoading) {
                      context?.setVideoInfo((prev) => ({
                        ...prev,
                        currentIndex:
                          (Number(context?.videoInfo?.currentIndex) + 1) %
                          Number(context?.videoInfo?.channels?.length),
                      }));

                      const params = new URLSearchParams(search?.toString());

                      if (search?.get("video")) {
                        params.set(
                          "video",
                          context?.videoInfo?.channels?.[
                            (Number(context?.videoInfo?.currentIndex) + 1) %
                              context?.videoInfo?.channels?.length
                          ]?.id!
                        );
                      } else {
                        params.append(
                          "video",
                          context?.videoInfo?.channels?.[
                            (Number(context?.videoInfo?.currentIndex) + 1) %
                              context?.videoInfo?.channels?.length
                          ]?.id!
                        );
                      }

                      router.replace(`${path}?${params?.toString()}`);
                    }
                  }
            }
            onCanPlay={(e) =>
              context?.setVideoControlsInfo((prev) => ({
                ...prev,
                duration: (e.target as any)?.duration,
              }))
            }
            onTimeUpdate={(e) =>
              context?.setVideoControlsInfo((prev) => ({
                ...prev,
                currentTime: (e.target as any)?.currentTime,
              }))
            }
          >
            {(setMediaElement: (node: HTMLVideoElement) => void) => (
              <LivePeerPlayer
                mediaElementRef={setMediaElement}
                src={
                  (
                    context?.videoInfo?.channels?.[
                      context?.videoInfo?.currentIndex
                    ]?.metadata as VideoMetadata
                  )?.video?.item ||
                  (
                    context?.videoInfo?.channels?.[
                      context?.videoInfo?.currentIndex
                    ]?.metadata as VideoMetadata
                  )?.video?.item
                }
                showLoadingSpinner={false}
                objectFit="cover"
              />
            )}
          </KinoraPlayerWrapper>
        </div>
      )}
    </div>
  );
};

export default Player;
