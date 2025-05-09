import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { InDropProps } from "../types/autograph.types";
import { useRouter } from "next/navigation";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";

const InDrop: FunctionComponent<InDropProps> = ({
  dict,
  collection,
  dropCollections,
}): JSX.Element => {
  const router = useRouter();
  if (!collection) {
    return <></>;
  }
  return (
    <div className="relative w-full h-40 flex flex-col justify-center items-end text-right">
      <div className="relative w-fit h-fit text-white font-arcade text-base">{`${dict?.Common?.more} ${collection?.drop?.metadata?.title}`}</div>
      <div className="relative w-full sm:w-128 h-fit flex overflow-x-scroll justify-end">
        <div className="relative grid grid-flow-col auto-cols-auto gap-2 overflow-x-scroll overflow-y-hidden">
          {dropCollections?.map((coll, index: number) => {
            return (
              <div
                key={index}
                className="relative rounded-md cursor-pointer active:scale-95 h-28 w-28 flex-shrink-0"
                id="staticLoad"
                onClick={() =>
                  router.push(
                    `/autograph/${
                      collection?.publication?.author?.username?.localName
                    }/collection/${coll?.metadata?.title
                      ?.replace(/\s/g, "_")
                      ?.toLowerCase()}`
                  )
                }
              >
                {!coll.metadata?.mediaTypes?.toLowerCase().includes("video") ? (
                  <Image
                    layout="fill"
                    className="rounded-md w-full h-full flex"
                    objectFit="cover"
                    objectPosition={"center"}
                    src={`${INFURA_GATEWAY_INTERNAL}${
                      coll.metadata?.images?.[0]?.split("ipfs://")[1]
                    }`}
                    draggable={false}
                  />
                ) : (
                  <video
                    muted
                    autoPlay
                    playsInline
                    loop
                    key={coll.metadata?.video}
                    className="w-full h-full object-cover rounded-md flex"
                  >
                    <source
                      src={`${INFURA_GATEWAY_INTERNAL}${
                        coll?.metadata?.video?.split("ipfs://")[1]
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
