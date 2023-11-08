import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PurchaseProps } from "../types/interactions.types";
import { AiOutlineLoading } from "react-icons/ai";
import { MainNFT } from "../../NFT/types/nft.types";
import { Collection } from "@/components/Home/types/home.types";
import WaveformComponent from "@/components/Home/modules/Waveform";

const Purchase: FunctionComponent<PurchaseProps> = ({
  acceptedtokens,
  approved,
  currency,
  setCurrency,
  totalAmount,
  mainNFT,
  approveSpend,
  buyNFT,
  purchaseLoading,
  router,
  push,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      {(mainNFT as MainNFT)?.media && (
        <div
          className={
            "relative w-full h-full flex flex-col items-center justify-center pt-4"
          }
        >
          <div
            className="relative w-60 h-60 lg:w-2/3 lg:h-52 rounded-br-lg rounded-tl-lg border border-white cursor-pointer"
            id="staticLoad"
            onClick={() =>
              router
                ? router.push(
                    `/autograph/${
                      (mainNFT as MainNFT)?.creator?.name?.split(".lens")[0]
                    }/collection/${(mainNFT as MainNFT)?.name
                      ?.replaceAll(" ", "_")
                      .toLowerCase()}`
                  )
                : push &&
                  push(
                    `/autograph/${
                      (mainNFT as MainNFT)?.creator?.name?.split(".lens")[0]
                    }/collection/${(mainNFT as MainNFT)?.name
                      ?.replaceAll(" ", "_")
                      .toLowerCase()}`
                  )
            }
          >
            {(mainNFT as MainNFT).media &&
              ((mainNFT as MainNFT).type === "video/mp4" ? (
                <video
                  playsInline
                  className="rounded-br-lg rounded-tl-lg w-full h-full object-cover"
                  loop
                  controls={(mainNFT as MainNFT).hasAudio ? false : true}
                  key={(mainNFT as MainNFT).media}
                  id={(mainNFT as MainNFT).media}
                  muted
                >
                  <source
                    src={`${INFURA_GATEWAY}/ipfs/${(mainNFT as MainNFT).media}`}
                    type="video/mp4"
                    draggable={false}
                  />
                </video>
              ) : (
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${(mainNFT as MainNFT).media}`}
                  className="rounded-br-lg rounded-tl-lg w-full h-full"
                  layout="fill"
                  draggable={false}
                  objectFit="cover"
                  key={(mainNFT as MainNFT).media}
                />
              ))}
            {((mainNFT as MainNFT).audio || (mainNFT as MainNFT).hasAudio) && (
              <div
                className="absolute w-full h-fit flex bottom-0 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <WaveformComponent
                  audio={(mainNFT as MainNFT).audio}
                  image={(mainNFT as MainNFT).media}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`relative w-full h-fit flex flex-col gap-3 pt-4  ${
          (mainNFT as MainNFT)?.media
            ? "justify-center items-center px-3"
            : "justify-center items-center lg:items-end lg:justify-end"
        }`}
      >
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
          {ACCEPTED_TOKENS.filter((item) =>
            acceptedtokens?.includes(item[1].toLowerCase())
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
            (mainNFT as MainNFT)?.media
              ? "justify-center items-center"
              : "justify-center items-center lg:items-end lg:justify-end"
          }`}
        >
          Total: {totalAmount} {currency}
        </div>
      </div>
      <div
        className={`relative w-full h-fit font-earl flex text-sm pt-4 ${
          (mainNFT as MainNFT)?.media
            ? "justify-center items-center"
            : "justify-center items-center lg:items-end lg:justify-end"
        }`}
      >
        {(mainNFT as MainNFT)?.media ? (
          <div
            className={`relative rounded-lg p-1.5 w-24 text-center border-white border text-white h-8 hover:bg-moda cursor-pointer
          ${
            (mainNFT as MainNFT)?.tokensSold &&
            mainNFT?.tokenIds?.length! -
              (mainNFT as MainNFT)?.tokensSold?.length! !==
              0
              ? " bg-verde/60"
              : "bg-verde/20"
          }`}
            onClick={
              (mainNFT as MainNFT)?.tokensSold &&
              mainNFT?.tokenIds?.length! -
                (mainNFT as MainNFT)?.tokensSold?.length! ===
                0
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
              ) : (mainNFT as MainNFT)?.tokensSold &&
                (mainNFT as MainNFT)?.tokenIds?.length! -
                  (mainNFT as MainNFT)?.tokensSold?.length! ===
                  0 ? (
                "SOLD OUT"
              ) : !approved ? (
                "APPROVE"
              ) : (
                "COLLECT"
              )}
            </div>
          </div>
        ) : (
          <div
            className={`relative rounded-lg p-1.5 w-24 text-center border-white border text-white h-8 hover:bg-moda cursor-pointer
        ${
          (mainNFT as Collection)?.soldTokens &&
          mainNFT?.tokenIds?.length! -
            (mainNFT as Collection)?.soldTokens?.length! !==
            0
            ? "bg-verde/60"
            : "bg-verde/20"
        }`}
            onClick={
              (mainNFT as Collection)?.soldTokens &&
              mainNFT?.tokenIds?.length! -
                (mainNFT as Collection)?.soldTokens?.length! ===
                0
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
              ) : (mainNFT as Collection)?.tokenIds?.length! -
                  (mainNFT as Collection)?.soldTokens?.length! ===
                0 ? (
                "SOLD OUT"
              ) : !approved ? (
                "APPROVE"
              ) : (
                "COLLECT"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;
