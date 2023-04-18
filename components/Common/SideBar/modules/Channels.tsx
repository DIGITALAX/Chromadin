import { FunctionComponent } from "react";
import { ChannelsProps } from "../types/sidebar.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { setMainVideo } from "@/redux/reducers/mainVideoSlice";
import { Publication } from "@/components/Home/types/lens.types";
import json from "./../../../../public/videos/local.json";

const Channels: FunctionComponent<ChannelsProps> = ({
  videos,
  dispatch,
  liked,
  mirrored,
  videosLoading,
  dispatchVideos,
  collected,
}): JSX.Element => {
  return (
    <div className="relative w-full h-100 lg:h-128 flex flex-col overflow-y-scroll border border-white/80">
      {videosLoading ? (
        <>
          {Array.from({ length: 10 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-full min-w-full h-32 flex flex-col galaxy:flex-row hover:opacity-80 cursor-pointer border-b border-white animate-pulse"
                key={index}
              >
                <div
                  className="relative w-full h-44 lg:h-full"
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
        (videos?.length > 0 || dispatchVideos?.length > 0) &&
        (videos?.length > 0 ? videos : dispatchVideos)?.map(
          (content: Publication, index: number) => {
            return (
              <div
                className="relative w-full min-w-full h-fit lg:h-32 flex flex-col galaxy:flex-row hover:opacity-80 cursor-pointer border-b border-white"
                key={index}
                onClick={() =>
                  dispatch(
                    setMainVideo({
                      actionVideo: `${INFURA_GATEWAY}/ipfs/${
                        content?.metadata?.media?.[0]?.original?.url.split(
                          "ipfs://"
                        )[1]
                      }`,
                      actionCollected: collected[index],
                      actionLiked: liked[index],
                      actionMirrored: mirrored[index],
                      actionId: content?.id,
                      actionLocal: `${json[index].link}`,
                    })
                  )
                }
              >
                <div className="relative w-full h-44 lg:h-full">
                  <video
                    muted
                    playsInline
                    preload="metadata"
                    className="relative object-cover w-full h-full"
                    poster={`${INFURA_GATEWAY}/ipfs/${json[index].poster}`}
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        content?.metadata?.media?.[0]?.original?.url?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      type="video/mp4"
                    />
                  </video>
                </div>
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
                          {content?.metadata?.content?.split("\n\n")[0]
                            ?.length > 13
                            ? content?.metadata?.content
                                ?.split("\n\n")[0]
                                ?.slice(0, 13) + "..."
                            : content?.metadata?.content?.split("\n\n")[0]}
                        </div>
                      </div>
                      <div className="relative w-full h-full flex font-earl text-xs preG:text-base lg:text-xs text-white leading-none">
                        {content?.metadata?.content?.split("\n\n")[1]?.length >
                        55
                          ? content?.metadata?.content
                              ?.split("\n\n")[1]
                              ?.slice(0, 55) + "..."
                          : content?.metadata?.content?.split("\n\n")[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )
      )}
    </div>
  );
};

export default Channels;
