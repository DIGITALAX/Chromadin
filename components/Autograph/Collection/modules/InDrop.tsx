import { FunctionComponent } from "react";
import { InDropProps } from "../types/collection.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const InDrop: FunctionComponent<InDropProps> = ({
  otherCollectionsDrop,
  autoCollection,
  autoProfile,
  router,
  t
}): JSX.Element => {
  if (!autoCollection) {
    return <></>;
  }
  return (
    <div className="relative w-full h-40 flex flex-col justify-center items-end text-right">
      <div className="relative w-fit h-fit text-white font-arcade text-base">{`${t("more")} ${autoCollection?.dropMetadata?.dropTitle}`}</div>
      <div className="relative w-full sm:w-128 h-fit flex overflow-x-scroll justify-end">
        <div className="relative grid grid-flow-col auto-cols-auto gap-2 overflow-x-scroll overflow-y-hidden">
          {otherCollectionsDrop?.map((coll: Collection, index: number) => {
            return (
              <div
                key={index}
                className="relative rounded-md cursor-pointer active:scale-95 h-28 w-28 flex-shrink-0"
                id="staticLoad"
                onClick={() =>
                  router.push(
                    `/autograph/${
                      autoProfile?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )[1]
                    }/collection/${coll?.collectionMetadata?.title
                      ?.replace(/\s/g, "_")
                      ?.toLowerCase()}`
                  )
                }
              >
                {!coll.collectionMetadata?.mediaTypes?.toLowerCase().includes("video") ? (
                  <Image
                    layout="fill"
                    className="rounded-md w-full h-full flex"
                    objectFit="cover"
                    objectPosition={"center"}
                    src={`${INFURA_GATEWAY}/ipfs/${
                      coll.collectionMetadata?.images?.[0]?.split("ipfs://")[1]
                    }`}
                    draggable={false}
                    
                  />
                ) : (
                  <video
                    muted
                    autoPlay
                    playsInline
                    loop
                    key={coll.collectionMetadata.video}
                    className="w-full h-full object-cover rounded-md flex"
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        coll?.collectionMetadata?.video?.split("ipfs://")[1]
                      }`}
                      type="video/mp4"
                    />
                  </video>
                )}
                <div className="relative absolute top-0 left-0 bg-black opacity-60 w-full h-full rounded-md hover:opacity-0"></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InDrop;
