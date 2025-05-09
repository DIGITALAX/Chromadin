import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { CollectionCaseProps } from "../types/autograph.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { useModal } from "connectkit";

const CollectionCaseSmall: FunctionComponent<CollectionCaseProps> = ({
  collection,
  dict,
  profile,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const { isConnected, address, chainId } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding, openSwitchNetworks } = useModal();
  return (
    <div className={`relative flex rounded-md w-40 h-40`} id="staticLoad">
      <div className="relative w-full h-full border border-ama rounded-md">
        {!collection?.metadata?.mediaTypes?.includes("video") ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              collection?.metadata?.images[0]?.split("ipfs://")[1]
            }`}
            layout="fill"
            objectFit="cover"
            className="rounded-md cursor-pointer hover:opacity-80"
            draggable={false}
            onClick={() =>
              router.push(
                `/autograph/${
                  profile?.username?.localName
                }/collection/${collection?.metadata?.title
                  ?.replaceAll(" ", "_")
                  ?.toLowerCase()}`
              )
            }
          />
        ) : (
          <video
            muted
            autoPlay
            playsInline
            className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
            onClick={() =>
              router.push(
                `/autograph/${
                  profile?.username?.localName
                }/collection/${collection?.metadata?.title
                  ?.replaceAll(" ", "_")
                  ?.toLowerCase()}`
              )
            }
          >
            <source
              src={`${INFURA_GATEWAY}/ipfs/${
                collection?.metadata?.video?.split("ipfs://")[1]
              }`}
              type="video/mp4"
            />
          </video>
        )}
      </div>

      <div className="absolute w-fit h-fit flex flex-col gap-2 justify-end ml-auto items-end right-0 top-4">
        <div
          className={`relative flex w-fit p-1 rounded-l-md h-fit text-ama font-mana items-end justify-end whitespace-nowrap text-xs bg-black right-0 border border-ama`}
        >
          {Number(collection?.tokenIdsMinted?.length || 0) === Number(collection?.amount)
            ? dict?.Common?.sold
            : `${Number(collection?.tokenIdsMinted?.length || 0)} /
                  ${Number(collection?.amount)}`}
        </div>
        <div
          className={`relative text-ama items-center flex cursor-pointer bg-black border border-ama rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
          onClick={() =>
            !isConnected
              ? chainId !== 232
                ? openSwitchNetworks?.()
                : openOnboarding?.()
              : context?.lensConectado?.profile
              ? context?.setMakePost({
                  open: true,
                  quote: collection?.publication,
                })
              : !lensCargando && handleConectarse()
          }
        >
          <div className="relative w-6 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
              draggable={false}
            />
          </div>
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 right-0 flex flex-col w-fit h-fit text-center items-end justify-end ml-auto`}
      >
        <div
          className={`relative w-fit h-fit text-white font-mana words-break flex text-xs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
        >
          {collection?.metadata?.title?.length! > 12
            ? collection?.metadata?.title?.slice(0, 12) + "..."
            : collection?.metadata?.title}
        </div>
      </div>
    </div>
  );
};

export default CollectionCaseSmall;
