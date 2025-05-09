"use client";

import Image from "next/legacy/image";
import Link from "next/link";
import { FunctionComponent, JSX, useContext } from "react";
import RouterChange from "./RouterChange";
import Bar from "./Bar";
import NotFoundEntry from "../../Common/modules/NotFoundEntry";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import WaveformComponent from "../../Common/modules/Waveform";
import { ModalContext } from "@/app/providers";
import { useAccount } from "wagmi";
import useLens from "../../Common/hooks/useLens";
import { useModal } from "connectkit";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import useCollection from "../hooks/useCollection";
import InDrop from "./InDrop";
import Purchase from "../../Market/modules/Purchase";

const CollectEntry: FunctionComponent<{
  dict: any;
  autograph: string;
  collectionName: string;
}> = ({ autograph, collectionName, dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const { isConnected, address, chainId } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding, openSwitchNetworks } = useModal();
  const { collectionLoading, dropCollections, collection } = useCollection(
    collectionName,
    autograph
  );

  if (collectionLoading || !collection) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Bar dict={dict} />
      {collection ? (
        <div
          className={`relative w-full h-full flex flex-col lg:flex-row bg-black items-center lg:items-start justify-center gap-12 lg:gap-8 lg:pl-20 pt-10`}
        >
          <div
            className={`relative w-5/6 h-128 flex flex-col items-center justify-center gap-3`}
          >
            <div className="relative flex flex-col w-full h-full bg-offBlack/50 p-2 items-center justify-center">
              <div className="relative w-full h-full flex">
                {collection?.metadata?.mediaTypes
                  ?.toLowerCase()
                  ?.toLowerCase()
                  ?.includes("video") ? (
                  <video
                    playsInline
                    muted
                    loop
                    className="flex flex-col w-full h-full object-contain"
                    id={collection?.metadata?.video}
                    key={collection?.metadata?.video}
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.metadata?.video?.split("ipfs://")[1]
                      }`}
                      type="video/mp4"
                      draggable={false}
                    />
                  </video>
                ) : (
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      collection?.metadata?.images?.[0]?.split("ipfs://")[1] ||
                      collection?.metadata?.mediaCover?.split("ipfs://")[1]
                    }`}
                    layout="fill"
                    objectFit="contain"
                    className="flex flex-col w-full h-full"
                    draggable={false}
                  />
                )}

                {collection?.metadata?.video && (
                  <div
                    className="absolute w-full h-fit flex bottom-0 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <WaveformComponent video={collection?.metadata?.video} />
                  </div>
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-row gap-3 justify-end items-end">
              <div
                className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
                onClick={() =>
                  context?.setVerImagen({
                    item: `${INFURA_GATEWAY}/ipfs/${
                      collection?.metadata?.images?.[0]?.split("ipfs://")[1] ||
                      collection?.metadata?.video?.split("ipfs://")[1]
                    }`,
                    type: collection?.metadata?.mediaTypes,
                  })
                }
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
                  alt="expand"
                  layout="fill"
                  className="flex items-center"
                  draggable={false}
                />
              </div>
              <div
                className={`relative text-ama items-center flex cursor-pointer justify-center top-1 rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
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
          </div>
          <div className="relative w-full h-fit flex flex-col lg:items-end items-center lg:justify-start justify-center px-6 sm:px-10 pb-8 lg:overflow-y-scroll">
            <div className="relative flex flex-col gap-3 text-center lg:text-right items-center lg:items-end lg:justify-end w-full h-fit">
              <div className="relative flex flex-col gap-0.5 items-center lg:items-end w-fit h-fit text-center lg:text-right">
                <div className="relative w-fit h-fit text-white font-earl text-4xl">
                  {collection?.metadata?.title}
                </div>
                <div className="relative w-fit h-fit font-digi text-lg text-verde">
                  {collection?.drop?.metadata?.title}
                </div>
              </div>

              {collection && (
                <div className="relative w-fit h-fit text-white font-earl text-2xl">
                  {Number(collection?.tokenIdsMinted?.length || 0) ===
                  Number(collection?.amount)
                    ? dict?.Common?.sold
                    : `${Number(collection?.tokenIdsMinted?.length || 0)} /
                  ${Number(collection?.amount)}`}
                </div>
              )}
              {collection && (
                <Link
                  className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                  href={`/autograph/${collection?.publication?.author?.username?.localName}`}
                >
                  <div
                    className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                    id="crt"
                  >
                    <Image
                      src={handleProfilePicture(
                        collection?.publication?.author?.metadata?.picture
                      )}
                      layout="fill"
                      alt="pfp"
                      className="rounded-full w-full h-full flex"
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                    {
                      collection?.publication?.author?.username?.localName
                    }
                  </div>
                </Link>
              )}
              <div className="relative w-5/6 break-words h-fit max-h-80 text-white font-earl text-base overflow-y-scroll">
                {collection?.metadata?.description}
              </div>
            </div>
            <div className="relative w-full h-fit flex justify-center items-center lg:justify-end lg:items-end py-10">
              <Purchase dict={dict} collection={collection} />
            </div>
            {dropCollections?.length > 0 && (
              <InDrop
                dict={dict}
                collection={collection}
                dropCollections={dropCollections}
              />
            )}
          </div>
        </div>
      ) : (
        <NotFoundEntry dict={dict} />
      )}
    </div>
  );
};

export default CollectEntry;
