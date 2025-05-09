import { INFURA_GATEWAY } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import { ModalContext } from "@/app/providers";
import { CollectionCaseProps } from "../types/autograph.types";

const CollectionCaseLarge: FunctionComponent<CollectionCaseProps> = ({
  dict,
  collection,
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
    <div
      className={`relative flex rounded-md w-full h-[40rem]`}
      id="staticLoad"
    >
      {!collection?.metadata?.mediaTypes
        ?.toLowerCase()
        ?.includes("video") ? (
        <Image
          src={`${INFURA_GATEWAY}/ipfs/${
            collection?.metadata?.images?.[0]?.split("ipfs://")[1]
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
          onClick={() =>
            router.push(
              `/autograph/${
                profile?.username?.localName
              }/collection/${collection?.metadata?.title
                ?.replaceAll(" ", "_")
                ?.toLowerCase()}`
            )
          }
          className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
        >
          <source
            src={`${INFURA_GATEWAY}/ipfs/${
              collection?.metadata?.video?.split("ipfs://")[1]
            }`}
            type="video/mp4"
          />
        </video>
      )}
      <div
        className={`absolute w-5/6 h-fit flex preG:items-center preG:justify-center justify-start items-start z-1 bg-black md:left-20 rounded-t-lg bottom-0`}
      >
        <div
          className={`relative w-full h-fit flex preG:items-center preG:justify-center justify-start items-start p-2 flex-col preG:flex-row`}
        >
          <div className="relative w-fit h-fit hidden md:flex flex-row gap-3 preG:items-center preG:justify-center justify-start items-start">
            <div
              className="relative w-10 h-10 border border-ama rounded-full flex preG:items-center preG:justify-center justify-start items-start"
              id="crt"
            >
              <Image
                src={handleProfilePicture(profile?.metadata?.picture)}
                layout="fill"
                alt="pfp"
                className="rounded-full w-full h-full flex"
                draggable={false}
                onError={(e) => handleImageError(e)}
              />
            </div>
            <div className="relative w-fit h-fit text-ama font-arcade text-sm flex preG:items-center preG:justify-center justify-start items-start">
              {profile?.username?.localName &&
              profile?.username?.localName?.length > 14
                ? profile?.username?.localName?.slice(0, 12) + "..."
                : profile?.username?.localName}
            </div>
          </div>
          <div
            className={`relative flex flex-col w-full h-fit justify-start items-start text-left preG:text-center preG:items-center preG:justify-center ml-auto pr-2 pb-2`}
          >
            <div
              className={`relative w-fit h-fit text-white font-mana words-break flex text-lg`}
            >
              {collection?.metadata?.title?.length! > 15
                ? collection?.metadata?.title?.slice(0, 12) + "..."
                : collection?.metadata?.title}
            </div>

            <div
              className={`relative w-fit h-fit text-verde font-mana text-sm words-break flex`}
            >
              {collection?.drop?.metadata?.title?.length! > 18
                ? collection?.drop?.metadata?.title?.slice(0, 16) + "..."
                : collection?.drop?.metadata?.title}
            </div>
          </div>
          <div className="relative w-fit h-fit justify-start items-start preG:items-center preG:justify-center gap-2 flex flex-row preG:flex-col">
            <div
              className={`relative flex w-full h-fit text-ama font-mana justify-start whitespace-nowrap pb-2 text-sm`}
            >
              {Number(collection?.tokenIdsMinted?.length || 0) === Number(collection?.amount)
                ? dict?.Common?.sold
                : `${Number(collection?.tokenIdsMinted?.length|| 0)} /
                  ${Number(collection?.amount)}`}
            </div>
            <div
              className={`relative text-ama items-start preG:items-center flex cursor-pointer hover:opacity-70 active:scale-95 flex-row gap-1`}
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
              <div className="relative w-6 h-4 flex items-center justify-center preG:items-center preG:justify-center">
                <Image
                  layout="fill"
                  alt="post to lens"
                  src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
                  draggable={false}
                />
              </div>
              <div className="relative w-4 h-4 flex items-center justify-center preG:items-center preG:justify-center">
                <Image
                  layout="fill"
                  alt="post to lens"
                  src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCaseLarge;
