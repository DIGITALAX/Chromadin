import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import WaveformComponent from "../../Common/modules/Waveform";
import useFulfillment from "../hooks/useFulfillment";
import { Collection } from "../../Common/types/common.types";
import { useModal } from "connectkit";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";

const Purchase: FunctionComponent<{ dict: any; collection?: Collection }> = ({
  dict,
  collection,
}): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const context = useContext(ModalContext);
  const { isConnected, chainId, address } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding, openSwitchNetworks } = useModal();
  const {
    currency,
    setCurrency,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  } = useFulfillment(dict, collection);
  return (
    <div className="relative w-full h-fit flex flex-col">
      {!path?.includes("/autograph/") && (
        <div
          className={
            "relative w-full h-full flex flex-col items-center justify-center pt-4 px-2"
          }
        >
          <div
            className="relative w-full sm:w-60 h-60 lg:w-2/3 lg:h-52 rounded-br-lg rounded-tl-lg border border-white cursor-pointer"
            id="staticLoad"
            onClick={() =>
              router.push(
                `/autograph/${
                  context?.collectionInfo?.main?.publication?.author?.username
                    ?.localName
                }/collection/${context?.collectionInfo?.main?.metadata?.title
                  ?.replaceAll(" ", "_")
                  .toLowerCase()}`
              )
            }
          >
            {context?.collectionInfo?.main?.metadata?.mediaTypes
              ?.toLowerCase()
              ?.includes("video") ? (
              <video
                playsInline
                className="rounded-br-lg rounded-tl-lg w-full h-full object-cover"
                loop
                key={context?.collectionInfo?.main?.metadata?.video}
                id={context?.collectionInfo?.main?.metadata?.video}
                muted
                poster={`${INFURA_GATEWAY}/ipfs/${context?.collectionInfo?.main?.metadata?.mediaCover}`}
              >
                <source
                  src={`${INFURA_GATEWAY}/ipfs/${
                    context?.collectionInfo?.main?.metadata?.video?.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  type="video/mp4"
                  draggable={false}
                />
              </video>
            ) : (
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${
                  context?.collectionInfo?.main?.metadata?.images?.[0]?.split(
                    "ipfs://"
                  )?.[1] ||
                  context?.collectionInfo?.main?.metadata?.mediaCover?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                className="rounded-br-lg rounded-tl-lg w-full h-full"
                layout="fill"
                draggable={false}
                objectFit="cover"
                key={
                  context?.collectionInfo?.main?.metadata?.images?.[0] ||
                  context?.collectionInfo?.main?.metadata?.mediaCover
                }
              />
            )}
            {context?.collectionInfo?.main?.metadata?.video && (
              <div
                className="absolute w-full h-fit flex bottom-0 cursor-default"
                onClick={(e) => e.stopPropagation()}
              >
                <WaveformComponent
                  video={context?.collectionInfo?.main?.metadata?.video}
                />
              </div>
            )}
          </div>
        </div>
      )}
      <div
        className={`relative w-full h-fit flex flex-col gap-3 pt-4 px-3 ${
          !path?.includes("/autograph/")
            ? "justify-center items-center"
            : "justify-end items-end"
        }`}
      >
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
          {ACCEPTED_TOKENS.filter((item) =>
            (path?.includes("/autograph/")
              ? collection
              : context?.collectionInfo?.main
            )?.acceptedTokens?.includes(item[1].toLowerCase())
          ).map((item: string[], index: number) => {
            return (
              <div
                className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                  currency === item[1] ? "opacity-50" : "opacity-100"
                }`}
                key={index}
                onClick={() => setCurrency(item[1])}
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
            !path?.includes("/autograph/")
              ? "justify-center items-center"
              : "justify-end items-end"
          }`}
        >
          Total: {(totalAmount / 10 ** 18).toFixed(3)}{" "}
          {
            ACCEPTED_TOKENS?.find(
              (token) => token?.[1]?.toLowerCase() == currency?.toLowerCase()
            )?.[0]
          }
        </div>
      </div>
      <div
        className={`relative w-full h-fit font-earl flex text-sm pt-4 ${
          !path?.includes("/autograph/")
            ? "justify-center items-center"
            : "justify-end items-end"
        }`}
      >
        <div
          className={`relative rounded-lg p-1.5 w-24 text-center border-white border text-white h-8 hover:bg-moda cursor-pointer
          ${
            Number(
              (path?.includes("/autograph/")
                ? collection
                : context?.collectionInfo?.main
              )?.tokenIdsMinted?.length
            ) ==
            Number(
              (path?.includes("/autograph/")
                ? collection
                : context?.collectionInfo?.main
              )?.amount
            )
              ? " bg-verde/60"
              : "bg-verde/20"
          }`}
          onClick={() =>
            Number(
              (path?.includes("/autograph/")
                ? collection
                : context?.collectionInfo?.main
              )?.tokenIdsMinted?.length
            ) ==
            Number(
              (path?.includes("/autograph/")
                ? collection
                : context?.collectionInfo?.main
              )?.amount
            )
              ? {}
              : !isConnected
              ? chainId !== 232
                ? openSwitchNetworks?.()
                : openOnboarding?.()
              : context?.lensConectado?.profile
              ? !approved
                ? approveSpend()
                : buyNFT()
              : !lensCargando && handleConectarse()
          }
        >
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              purchaseLoading && "animate-spin"
            }`}
          >
            {purchaseLoading ? (
              <AiOutlineLoading size={10} color="white" />
            ) : Number(
                (path?.includes("/autograph/")
                  ? collection
                  : context?.collectionInfo?.main
                )?.tokenIdsMinted?.length
              ) ==
              Number(
                (path?.includes("/autograph/")
                  ? collection
                  : context?.collectionInfo?.main
                )?.amount
              ) ? (
              dict?.Common?.sold
            ) : !approved ? (
              dict?.Common?.app
            ) : (
              dict?.Common?.col
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
