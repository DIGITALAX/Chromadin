import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import Link from "next/link";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { useAccount } from "wagmi";
import useHistory from "../hooks/useHistory";
import FetchMoreLoading from "../../Common/modules/FetchMoreLoading";
import { BuyerHistory } from "../types/market.types";

const History: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const { address } = useAccount();
  const {
    historyLoading,
    history,
    historySwitch,
    getMoreUserHistory,
    setHistorySwitch,
    getMoreBuyerHistory,
  } = useHistory(address);
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center bg-black border-t border-white h-[45.8rem]`}
    >
      <div className="relative w-full h-16 max-h-20 flex flex-row border-white border-b text-white font-earl text-sm sm:flex-nowrap flex-wrap">
        <div
          className="relative w-full h-full flex items-center justify-center border-r border-white cursor-pointer hover:opacity-70"
          onClick={() => setHistorySwitch(false)}
        >
          {dict?.Common?.his}
        </div>
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-70"
          onClick={() => setHistorySwitch(true)}
        >
          {dict?.Common?.min}
        </div>
      </div>
      {historyLoading ? (
        <div className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 preG:gap-4 lg:gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap opacity-30 animate-pulse">
          {Array.from({ length: 4 }).map((_: any, index: number) => {
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
      ) : (
          historySwitch
            ? history?.buyerHistory?.length === 0
            : history?.allHistory?.length === 0
        ) ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3">
          {dict?.Common?.nothing}
          <br />
          <br />
          {dict?.Common?.history}
          <br />
          <br />
          {dict?.Common?.change}
        </div>
      ) : (
        <InfiniteScroll
          hasMore={
            historySwitch
              ? history?.hasMoreBuyerHistory
              : history?.hasMoreHistory
          }
          height={"20rem"}
          loader={<FetchMoreLoading size="3" />}
          dataLength={
            historySwitch
              ? history?.buyerHistory?.length
              : history?.allHistory?.length
          }
          next={historySwitch ? getMoreBuyerHistory : getMoreUserHistory}
          className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap items-start"
        >
          {(historySwitch ? history?.buyerHistory : history?.allHistory)?.map(
            (value: BuyerHistory, index: number) => {
              return (
                <Link
                  key={index}
                  className="relative w-full preG:w-fit lg:w-full h-fit flex flex-row gap-3 cursor-pointer items-start justify-center"
                  target={"_blank"}
                  rel={"noreferrer"}
                  href={`https://explorer.lens.xyz/tx/${value.transactionHash}`}
                >
                  <div
                    className="flex relative w-36 h-full rounded-tl-lg rounded-br-lg items-center justify-center"
                    id="staticLoad"
                  >
                    <Image
                      src={`${INFURA_GATEWAY_INTERNAL}${
                        value?.collection?.metadata?.images?.[0].split(
                          "ipfs://"
                        )[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      draggable={false}
                      className="rounded-tl-lg rounded-br-lg"
                    />
                  </div>
                  <div className="relative flex flex-col w-full preG:w-fit lg:w-full h-full gap-2 items-start justify-center">
                    <div className="relative w-fit h-fit flex flex-row gap-2">
                      <div
                        className="relative w-6 h-6 border border-white flex justify-start items-center rounded-full"
                        id="crt"
                      >
                        <Image
                          objectFit="cover"
                          alt="pfp"
                          layout="fill"
                          className="relative w-full h-full flex rounded-full"
                          src={`${INFURA_GATEWAY_INTERNAL}${value}`}
                          onError={(e) => handleImageError(e)}
                          draggable={false}
                        />
                      </div>
                      <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                        {value?.profile?.username?.localName?.length! > 15
                          ? value?.profile?.username?.localName?.slice(0, 13) +
                            "..."
                          : value?.profile?.username?.localName}
                      </div>
                    </div>
                    <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                      {value.transactionHash.slice(0, 14) + "..."}
                    </div>
                    <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                      {Number(value.totalPrice) / 10 ** 18}{" "}
                      {value.currency ===
                      "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
                        ? "MONA"
                        : "WETH"}
                    </div>
                    <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                      {moment(Number(value.blockTimestamp), "X").format("lll")}
                    </div>
                  </div>
                </Link>
              );
            }
          )}
        </InfiniteScroll>
      )}
      <div className={`relative w-full h-full flex`}>
        <Image
          src={`${INFURA_GATEWAY_INTERNAL}QmPKeuGZU2QZQm8GVhp7X3WvhzELLnmL5VNCFitgzCP6od`}
          layout="fill"
          objectFit="cover"
          draggable={false}
          priority
        />
      </div>
      {!historyLoading && (
        <div className="relative bottom-0 w-full h-fit py-2 border-y border-white text-white font-arcade uppercase items-end justify-center flex">
          CHROMADIN HISTORY
        </div>
      )}
    </div>
  );
};

export default History;
