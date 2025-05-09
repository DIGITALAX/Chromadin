"use client";

import { INFURA_GATEWAY, MOSH_VIDEOS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useContext } from "react";
import useFrequency from "../hooks/useFrequency";
import { Collection, Viewer } from "../types/common.types";
import useDrop from "../hooks/useDrop";

export default function FrequencyEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const {
    moveBackward,
    moveForward,
    currentIndex,
    moshVideoRef,
    currentVideoIndex,
  } = useFrequency();
  const { handleGetMoreCollections } = useDrop();
  return (
    <div className="relative w-full h-fit preG:h-60 flex flex-row items-center md:pt-0 pt-6">
      <div className="relative w-[80%] h-full flex flex-col">
        <div className="relative w-full h-fit flex flex-col preG:flex-row preG:items-center gap-2 preG:gap-4 pb-2 pt-2">
          <div className="relative w-fit h-fit text-white font-geom uppercase whitespace-nowrap justify-start preG:justify-center text-xl px-3">
            {dict?.Common?.freq}
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2 items-center preG:px-0 px-3 preG:pb-0 pb-2">
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmfSx7sos7eWqZ17VcMVPdZj2v6CKqT1dytojWULoLYi7F`}
              width={20}
              height={20}
              className="flex cursor-pointer active:scale-95"
              onClick={async () => {
                if (context?.collectionInfo?.moreCollectionsLoading) return;
                if (context?.collectionInfo?.hasMore && currentIndex === 0) {
                  await handleGetMoreCollections();
                }
                moveBackward();
              }}
              draggable={false}
            />
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmdQ34Qn4hCdzpZmUoEsaqxGoD2hTVwDFVv2V2MiQiTEPV`}
              width={20}
              height={20}
              className="flex"
              draggable={false}
            />
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmZxBo1yBTsikqgeV8EqJBgYxcCzHULDi2R1XphqvmoxaJ`}
              width={20}
              height={20}
              className="flex cursor-pointer active:scale-95"
              onClick={async () => {
                if (context?.collectionInfo?.moreCollectionsLoading) return;
                if (
                  context?.collectionInfo?.hasMore &&
                  currentIndex ===
                    Number(context?.collectionInfo?.collections?.length) - 6
                ) {
                  await handleGetMoreCollections();
                }
                moveForward();
              }}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-px flex" id="raincode"></div>
        <div className="relative w-[80%] h-full p-4 flex flex-row gap-4">
          {context?.collectionInfo?.collectionsLoading ||
          context?.collectionInfo?.moreCollectionsLoading
            ? Array.from({ length: 7 }).map((_: any, index: number) => {
                return (
                  <div
                    className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                    key={index}
                  >
                    <div
                      className="relative w-full h-full border-white border"
                      id="staticLoad"
                    ></div>
                    <div className="relative w-full h-fit flex flex-row items-center gap-2">
                      <div className="rounded-full bg-verde h-2 w-2"></div>
                      <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                        TboPcMv^&fN
                      </div>
                      <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                        {" "}
                        — H!lPn&bQ@f
                      </div>
                    </div>
                  </div>
                );
              })
            : [
                ...context?.collectionInfo?.collections!?.slice(currentIndex),
                ...context?.collectionInfo?.collections!?.slice(
                  0,
                  currentIndex
                ),
              ]?.map((collection: Collection, index: number) => {
                return (
                  <div
                    className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                    key={index}
                    onClick={() => {
                      context?.setCollectionInfo((prev) => ({
                        ...prev,
                        main: collection,
                      }));
                      context?.setViewer(Viewer.Collect);
                    }}
                  >
                    <div
                      className="relative w-full h-full border-white border"
                      id="staticLoad"
                    >
                      {collection?.metadata?.mediaTypes
                        ?.toLowerCase()
                        ?.includes("video") ? (
                        <video
                          playsInline
                          autoPlay
                          className={`w-full h-36 object-cover`}
                          muted
                          loop
                          key={collection?.metadata?.video}
                        >
                          <source
                            src={`${INFURA_GATEWAY}/ipfs/${collection?.metadata?.video
                              ?.split("ipfs://")[1]
                              ?.replace(/"/g, "")
                              ?.trim()}`}
                            type="video/mp4"
                            draggable={false}
                          />
                        </video>
                      ) : (
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            collection?.metadata?.images?.[0]?.split(
                              "ipfs://"
                            )[1]
                          }`}
                          layout="fill"
                          objectFit="cover"
                          objectPosition="top"
                          className="w-full h-full"
                          draggable={false}
                          key={collection?.metadata?.images?.[0]}
                        />
                      )}
                    </div>
                    <div className="relative w-full h-fit flex flex-row items-center gap-2">
                      <div className="rounded-full bg-verde h-2 w-2"></div>
                      <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                        {collection?.drop?.metadata?.title?.length > 15
                          ? collection?.drop?.metadata?.title?.slice(0, 15) +
                            "..."
                          : collection?.drop?.metadata?.title}
                      </div>
                      <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                        {" "}
                        —{" "}
                        {collection?.metadata?.title?.length > 7
                          ? collection?.metadata?.title.slice(0, 7) +
                            "..."
                          : collection?.metadata?.title}
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <div
        className="absolute w-80 h-full hidden md:flex bg-offBlack border-l border-white/70 right-0"
        id="staticLoad"
      >
        <div className="relative w-full h-full justify-center flex">
          <video
            muted
            playsInline
            autoPlay
            className="flex w-full h-full"
            ref={moshVideoRef}
            key={currentVideoIndex}
          >
            <source
              src={`${INFURA_GATEWAY}/ipfs/${MOSH_VIDEOS[currentVideoIndex]}`}
              type="video/mp4"
              id="staticLoad"
              key={currentVideoIndex}
            />
          </video>
        </div>
      </div>
    </div>
  );
}
