import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { History as HistoryType, HistoryProps } from "../types/interactions.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Link from "next/link";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroll-component";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import handleImageError from "@/lib/helpers/handleImageError";

const History: FunctionComponent<HistoryProps> = ({
  historyLoading,
  historySwitch,
  setHistorySwitch,
  getMoreUserHistory,
  getMoreBuyerHistory,
  historyData,
  t,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full flex flex-col items-center justify-center bg-black border-t border-white h-full xl:h-[45.8rem]`}
    >
      <div className="relative w-full h-16 max-h-20 flex flex-row border-white border-b text-white font-earl text-sm">
        <div
          className="relative w-full h-full flex items-center justify-center border-r border-white cursor-pointer hover:opacity-70"
          onClick={() => setHistorySwitch(false)}
        >
          {t("his")}
        </div>
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-70"
          onClick={() => setHistorySwitch(true)}
        >
          {t("min")}
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
            ? historyData?.buyerHistory?.length === 0
            : historyData?.allHistory?.length === 0
        ) ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3">
          {t("nothing")}
          <br />
          <br />
          {t("history")}
          <br />
          <br />
          {t("change")}
        </div>
      ) : (
        <InfiniteScroll
          hasMore={
            historySwitch
              ? historyData?.hasMoreBuyerHistory
              : historyData?.hasMoreAllHistory
          }
          height={"20rem"}
          loader={<FetchMoreLoading size="3" />}
          dataLength={
            historySwitch
              ? historyData?.buyerHistory?.length
              : historyData?.allHistory?.length
          }
          next={historySwitch ? getMoreBuyerHistory : getMoreUserHistory}
          className="relative w-full h-full flex flex-col overflow-y-scroll gap-8 p-3 lg:flex-nowrap flex-nowrap preG:flex-wrap items-start"
        >
          {(historySwitch
            ? historyData?.buyerHistory
            : historyData?.allHistory
          )?.map((value: HistoryType, index: number) => {
            const pfp = createProfilePicture(value.profile?.metadata?.picture);
            return (
              <Link
                key={index}
                className="relative w-full preG:w-fit lg:w-full h-fit flex flex-row gap-3 cursor-pointer items-start justify-center"
                target={"_blank"}
                rel={"noreferrer"}
                href={`https://polygonscan.com/tx/${value.transactionHash}`}
              >
                <div
                  className="flex relative w-36 h-full rounded-tl-lg rounded-br-lg items-center justify-center"
                  id="staticLoad"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      value.collection?.collectionMetadata?.images?.[0].split(
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
                      {pfp && (
                        <Image
                          objectFit="cover"
                          alt="pfp"
                          layout="fill"
                          className="relative w-full h-full flex rounded-full"
                          src={pfp}
                          onError={(e) => handleImageError(e)}
                          draggable={false}
                        />
                      )}
                    </div>
                    <div className="relative w-fit h-fit text-ama font-arcade text-sm">
                      {value?.profile?.handle?.suggestedFormatted?.localName
                        ?.length! > 15
                        ? value?.profile?.handle?.suggestedFormatted?.localName
                            ?.split("@")?.[1]
                            ?.slice(0, 13) + "..."
                        : value?.profile?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )?.[1]}
                    </div>
                  </div>
                  <div className="relative text-moda font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    {value.transactionHash.slice(0, 14) + "..."}
                  </div>
                  <div className="relative text-white font-arcade flex items-center justify-start text-sm w-fit h-fit">
                    {Number(value.totalPrice) / 10 ** 18}{" "}
                    {value.currency ===
                    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"
                      ? "USDT"
                      : value.currency ===
                        "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
                      ? "MONA"
                      : value.currency ===
                        "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
                      ? "WMATIC"
                      : "WETH"}
                  </div>
                  <div className="relative text-verde font-arcade flex items-center justify-start text-xs w-fit h-fit">
                    {moment(Number(value.blockTimestamp), "X").format("lll")}
                  </div>
                </div>
              </Link>
            );
          })}
        </InfiniteScroll>
      )}
      <div className={`relative w-full h-full hidden xl:flex`}>
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmPKeuGZU2QZQm8GVhp7X3WvhzELLnmL5VNCFitgzCP6od`}
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
