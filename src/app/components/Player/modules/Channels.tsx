import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { Post, VideoMetadata } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChannelsProps } from "../types/player.types";

const Channels: FunctionComponent<ChannelsProps> = ({
  fetchMoreVideos,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  return (
    <div className="relative w-full h-full flex flex-col overflow-y-scroll border border-white/80">
      {context?.videoControlsInfo?.videosLoading ||
      Number(context?.videoInfo?.channels?.length) < 1 ? (
        <>
          {Array.from({ length: 10 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-full min-w-full h-fit flex hover:opacity-80 cursor-pointer border-b border-white animate-pulse"
                key={index}
              >
                <div className="relative w-full h-fit sm:h-32 flex flex-col sm:flex-row">
                  <div
                    className="relative w-full h-32 sm:h-full"
                    id="staticLoad"
                  ></div>
                  <div className="relative w-full h-fit sm:h-full p-1">
                    <div className="relative border border-white w-full h-full p-px rounded-lg">
                      <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2 rounded-lg">
                        <div className="relative w-full h-fit flex flex-col sm:flex-row items-center lg:gap-0 gap-4">
                          <div className="relative w-fit h-1/2 flex">
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                              height={5}
                              width={10}
                              alt="stripes"
                              draggable={false}
                            />
                          </div>
                          <div
                            className="relative w-full h-fit text-lg lg:text-sm font-arcade flex justify-start lg:justify-center break-all"
                            id={`record${(index % 3) + 1}`}
                          >
                            h&Jg3k^qaSdP4f#hLmN!o
                          </div>
                        </div>
                        <div className="relative w-full h-full flex font-earl text-xs preG:text-base lg:text-xs text-white leading-none break-all">
                          t8g#sL% k^y*JH! lPn&b Q@f Z m$x ^aE#sGp +D^ jKd!rT boP
                          cMv^& fN
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        Number(context?.videoInfo?.channels?.length) > 0 && (
          <InfiniteScroll
            next={fetchMoreVideos}
            hasMore={context?.videoInfo?.hasMore!}
            height={
              typeof window !== "undefined" && window.innerWidth > 1024
                ? "36rem"
                : "27rem"
            }
            loader={""}
            dataLength={context?.videoInfo?.channels?.length!}
            className="relative w-full h-full overflow-y-scroll"
            scrollThreshold={0.8}
          >
            {context?.videoInfo?.channels?.map(
              (content: Post, index: number) => {
                const metadata: VideoMetadata =
                  content?.metadata as VideoMetadata;
                return (
                  <div
                    className="relative w-full flex h-fit min-w-full"
                    key={index}
                  >
                    <div
                      className="relative w-full min-w-full h-fit galaxy:h-32 flex flex-col galaxy:flex-row hover:opacity-80 cursor-pointer border-b border-white"
                      onClick={() => {
                        const videoId = search?.get("video");
                        const params = new URLSearchParams(search?.toString());
                        if (videoId) {
                          params.set("video", content?.id);
                        } else {
                          params.append("video", content?.id);
                        }

                        router.replace(`${path}?${params?.toString()}`);
                        context?.setVideoInfo((prev) => ({
                          ...prev,
                          currentIndex: index,
                        }));
                      }}
                    >
                      {(content?.metadata as VideoMetadata)?.video?.cover && (
                        <div className="relative w-full h-32">
                          <Image
                            layout="fill"
                            objectFit="cover"
                            src={`${INFURA_GATEWAY}/ipfs/${
                              (
                                content?.metadata as VideoMetadata
                              )?.video?.cover?.split("ipfs://")?.[1]
                            }`}
                          />
                        </div>
                      )}
                      <div className="relative w-full h-fit galaxy:h-32 p-1">
                        <div className="relative border border-white w-full h-full p-px rounded-lg">
                          <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2 rounded-lg">
                            <div className="relative w-full h-fit flex flex-row items-center lg:gap-0 gap-4">
                              <div className="relative w-fit h-1/2 flex">
                                <Image
                                  src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                                  height={5}
                                  width={10}
                                  alt="stripes"
                                  draggable={false}
                                />
                              </div>
                              <div
                                className="relative w-full h-fit text-lg lg:text-sm font-arcade flex justify-start lg:justify-start lg:px-1.5"
                                id={`record${(index % 3) + 1}`}
                              >
                                {metadata?.title?.includes(
                                  "Post by @chromadin.lens"
                                )
                                  ? metadata?.content
                                      .split("\n\n")[0]
                                      ?.slice(0, 13) + "..."
                                  : metadata?.title?.slice(0, 13) + "..."}
                              </div>
                            </div>
                            <div className="relative w-full h-full flex font-earl text-xs preG:text-base lg:text-xs text-white leading-none">
                              {metadata?.content?.includes("\n\n") &&
                              parseInt(content?.id?.split("-")[0], 16) < 30
                                ? metadata?.content
                                    ?.split("\n\n")[1]
                                    ?.slice(0, 55) + "..."
                                : metadata?.content?.slice(0, 55) + "..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </InfiniteScroll>
        )
      )}
    </div>
  );
};

export default Channels;
