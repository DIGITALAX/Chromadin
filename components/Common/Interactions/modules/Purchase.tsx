import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PurchaseProps } from "../types/interactions.types";
import { AiOutlineLoading } from "react-icons/ai";
import { Collection } from "@/components/Home/types/home.types";
import WaveformComponent from "@/components/Home/modules/Waveform";

const Purchase: FunctionComponent<PurchaseProps> = ({
  approved,
  currency,
  setCurrency,
  totalAmount,
  mainNFT,
  approveSpend,
  buyNFT,
  purchaseLoading,
  router,
  t
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      {!router?.asPath?.includes("/autograph/") && (
        <div
          className={
            "relative w-full h-full flex flex-col items-center justify-center pt-4"
          }
        >
          <div
            className="relative w-60 h-60 lg:w-2/3 lg:h-52 rounded-br-lg rounded-tl-lg border border-white cursor-pointer"
            id="staticLoad"
            onClick={() =>
              router.push(
                `/autograph/${
                  mainNFT?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )?.[1]
                }/collection/${mainNFT?.collectionMetadata?.title
                  ?.replaceAll(" ", "_")
                  .toLowerCase()}`
              )
            }
          >
            {mainNFT.collectionMetadata?.mediaTypes
              ?.toLowerCase()
              ?.includes("video") ? (
              <video
                playsInline
                className="rounded-br-lg rounded-tl-lg w-full h-full object-cover"
                loop
                key={mainNFT?.collectionMetadata?.video}
                id={mainNFT?.collectionMetadata?.video}
                muted
                poster={`${INFURA_GATEWAY}/ipfs/${mainNFT?.collectionMetadata?.mediaCover}`}
              >
                <source
                  src={`${INFURA_GATEWAY}/ipfs/${
                    mainNFT?.collectionMetadata?.video?.split("ipfs://")?.[1]
                  }`}
                  type="video/mp4"
                  draggable={false}
                />
              </video>
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  mainNFT?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1] ||
                  mainNFT?.collectionMetadata?.mediaCover?.split("ipfs://")?.[1]
                }`}
                className="rounded-br-lg rounded-tl-lg w-full h-full"
                layout="fill"
                draggable={false}
                objectFit="cover"
                key={
                  mainNFT?.collectionMetadata?.images?.[0] ||
                  mainNFT?.collectionMetadata?.mediaCover
                }
              />
            )}
            {mainNFT.collectionMetadata?.video && (
              <div
                className="absolute w-full h-fit flex bottom-0 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <WaveformComponent video={mainNFT.collectionMetadata?.video} />
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`relative w-full h-fit flex flex-col gap-3 pt-4 px-3 ${
          !router?.asPath?.includes("/autograph/")
            ? "justify-center items-center"
            : "justify-end items-end"
        }`}
      >
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
          {ACCEPTED_TOKENS.filter((item) =>
            mainNFT?.acceptedTokens?.includes(item[1].toLowerCase())
          ).map((item: string[], index: number) => {
            return (
              <div
                className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                  currency === item[0] ? "opacity-50" : "opacity-100"
                }`}
                key={index}
                onClick={() => setCurrency(item[0])}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${item[2]}`}
                  className="flex"
                  draggable={false}
                  width={30}
                  height={35}
                />
              </div>
            );
          })}
        </div>
        <div
          className={`relative w-1/2 h-fit font-digi text-white text-sm flex whitespace-nowrap ${
            !router?.asPath?.includes("/autograph/")
              ? "justify-center items-center"
              : "justify-end items-end"
          }`}
        >
          Total:{" "}
          {(totalAmount / (currency == "USDT" ? 10 ** 6 : 10 ** 18)).toFixed(2)}{" "}
          {currency}
        </div>
      </div>
      <div
        className={`relative w-full h-fit font-earl flex text-sm pt-4 ${
          !router?.asPath?.includes("/autograph/")
            ? "justify-center items-center"
            : "justify-end items-end"
        }`}
      >
        <div
          className={`relative rounded-lg p-1.5 w-24 text-center border-white border text-white h-8 hover:bg-moda cursor-pointer
          ${
            Number((mainNFT as Collection)?.soldTokens) ==
            Number((mainNFT as Collection)?.amount)
              ? " bg-verde/60"
              : "bg-verde/20"
          }`}
          onClick={
            Number((mainNFT as Collection)?.soldTokens) ==
            Number((mainNFT as Collection)?.amount)
              ? () => {}
              : !approved
              ? () => approveSpend()
              : () => buyNFT()
          }
        >
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              purchaseLoading && "animate-spin"
            }`}
          >
            {purchaseLoading ? (
              <AiOutlineLoading size={10} color="white" />
            ) : Number((mainNFT as Collection)?.soldTokens) ==
              Number((mainNFT as Collection)?.amount) ? (
              t("sold")
            ) : !approved ? (
              t("app")
            ) : (
              t("col")
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
