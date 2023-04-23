import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { History, HistoryProps } from "../types/interactions.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Link from "next/link";
import moment from "moment";

const History: FunctionComponent<HistoryProps> = ({
  history,
  historyReducer,
  historyLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full xl:h-[45.8rem] flex flex-col items-center justify-center bg-black border-t border-white">
      {historyLoading ? (
        <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 preG:gap-4 lg:gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap opacity-30 animate-pulse">
          {Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full preG:w-fit lg:w-full h-full preG:h-fit lg:h-full flex flex-row gap-3 cursor-pointer items-center justify-center"
              >
                <div
                  className="flex relative w-36 h-24 rounded-lg"
                  id="staticLoad"
                ></div>
                <div className="relative flex flex-col w-full preG:w-fit lg:w-full h-full gap-2 items-start justify-center">
                  <div className="relative w-fit h-fit flex flex-row gap-2">
                    <div
                      className="relative w-6 h-6 border border-white flex justify-start items-center rounded-full"
                      id="crt"
                    ></div>
                    <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                      @TboPcMv^&fN
                    </div>
                  </div>
                  <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    boPH!lPnPcMv^&fN...
                  </div>
                  <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    $H!lPn&bQ@f
                  </div>
                  <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                    v^&fNboPH!lPnN
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : history?.length === 0 && historyReducer?.length === 0 ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3">
          Nothing to see here.
          <br />
          <br />
          Looks like you haven’t made history, yet.
          <br />
          <br />
          Let’s change that by picking up the remote and dialing in to some good
          old channel surfing.
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 preG:gap-4 lg:gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap">
          {(history?.length < 1 ? historyReducer : history)?.map(
            (value: History, index: number) => {
              const pfp = createProfilePicture(value.profile);
              return (
                <Link
                  key={index}
                  className="relative w-full preG:w-fit lg:w-full h-full preG:h-fit lg:h-full flex flex-row gap-3 cursor-pointer items-center justify-center"
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={`https://polygonscan.com/tx/${value.transactionHash}`}
                >
                  <div
                    className="flex relative w-36 h-24 rounded-lg"
                    id="staticLoad"
                  >
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        value.uri.image.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="relative flex flex-col w-full preG:w-fit lg:w-full h-full gap-2 items-start justify-center">
                    <div className="relative w-fit h-fit flex flex-row gap-2">
                      <div
                        className="relative w-6 h-6 border border-white flex justify-start items-center rounded-full"
                        id="crt"
                      >
                        {pfp !== "" && (
                          <Image
                            objectFit="cover"
                            alt="pfp"
                            layout="fill"
                            className="relative w-full h-full flex rounded-full"
                            src={pfp}
                            draggable={false}
                          />
                        )}
                      </div>
                      <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                        @
                        {value?.profile?.handle?.split(".lens")[0].length > 15
                          ? value?.profile?.handle
                              ?.split(".lens")[0]
                              .slice(0, 13) + "..."
                          : value?.profile?.handle?.split(".lens")[0]}
                      </div>
                    </div>
                    <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                      {value.transactionHash.slice(0, 14) + "..."}
                    </div>
                    <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                      ${Number(value.totalPrice) / 10 ** 18}
                    </div>
                    <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                      {moment(Number(value.blockTimestamp), 'X').format("lll")}
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </div>
      )}
      {history?.length === 0 && historyReducer?.length === 0 && (
        <div className="relative w-full h-[29.4rem] flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmPKeuGZU2QZQm8GVhp7X3WvhzELLnmL5VNCFitgzCP6od`}
            layout="fill"
            objectFit="cover"
            draggable={false}
          />
        </div>
      )}
      <div className="relative bottom-0 w-full h-fit py-2 border-y border-white text-white font-arcade uppercase items-end justify-center flex">
        CHROMADIN HISTORY
      </div>
    </div>
  );
};

export default History;
