import { FunctionComponent } from "react";
import { ChannelsProps } from "../types/sidebar.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import {
  Post,
  PublicationMetadata,
  VideoMetadataV3,
} from "@/components/Home/types/generated";
import json from "./../../../../public/videos/local.json";
import InfiniteScroll from "react-infinite-scroll-component";

const Channels: FunctionComponent<ChannelsProps> = ({
  dispatch,
  videoSync,
  dispatchVideos,
  fetchMoreVideos,
  hasMore,
  scrollHeight,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 lg:h-128 flex flex-col overflow-y-scroll border border-white/80">
      {videoSync.videosLoading ? (
        <>
          {Array.from({ length: 10 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-full min-w-full h-32 flex flex-col galaxy:flex-row hover:opacity-80 cursor-pointer border-b border-white animate-pulse"
                key={index}
              >
                <div
                  className="relative w-full h-32 lg:h-full"
                  id="staticLoad"
                ></div>
                <div className="relative w-full h-32 galaxy:h-full p-1">
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
                          className="relative w-full h-fit text-lg lg:text-sm font-arcade flex justify-start lg:justify-center"
                          id={`record${(index % 3) + 1}`}
                        >
                          h&Jg3k^qaSdP4f#hLmN!o
                        </div>
                      </div>
                      <div className="relative w-full h-full flex font-earl text-xs preG:text-base lg:text-xs text-white leading-none">
                        t8g#sL% k^y*JH! lPn&b Q@f Z m$x ^aE#sGp +D^ jKd!rT boP
                        cMv^& fN
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <InfiniteScroll
          next={fetchMoreVideos}
          hasMore={hasMore}
          height={scrollHeight}
          loader={""}
          dataLength={dispatchVideos.length}
          className="relative w-full h-full overflow-y-scroll"
          scrollThreshold={1}
        >
          {dispatchVideos?.length > 0 &&
            dispatchVideos?.map((content: Post, index: number) => {
              const metadata: VideoMetadataV3 =
                content?.metadata as VideoMetadataV3;
              return (
                <div
                  className="relative w-full min-w-full h-fit galaxy:h-32 flex flex-col galaxy:flex-row hover:opacity-80 cursor-pointer border-b border-white"
                  key={index}
                  onClick={() =>
                    dispatch(
                      setMainVideo({
                        actionCollected: videoSync.collectedArray[index],
                        actionLiked: videoSync.likedArray[index],
                        actionMirrored: videoSync.mirroredArray[index],
                        actionId: content?.id,
                        actionLocal: `${json[index].link}`,
                      })
                    )
                  }
                >
                  {content?.metadata?.marketplace?.animationUrl?.split(
                    "ipfs://"
                  )[1] && (
                    <div className="relative w-full h-32">
                      <video
                        muted
                        playsInline
                        preload="metadata"
                        className="relative object-cover w-full h-full"
                        poster={`${INFURA_GATEWAY}/ipfs/${json[index]?.poster}`}
                      >
                        <source
                          src={`${INFURA_GATEWAY}/ipfs/${
                            content?.metadata?.marketplace?.animationUrl?.split(
                              "ipfs://"
                            )[1]
                          }`}
                          type="video/mp4"
                        />
                      </video>
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
                          {metadata?.content?.includes("\n\n")
                            ? metadata?.content
                                ?.split("\n\n")[1]
                                ?.slice(0, 55) + "..."
                            : metadata?.content?.slice(0, 55) + "..."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Channels;
