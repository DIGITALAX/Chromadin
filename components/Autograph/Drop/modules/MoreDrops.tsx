import { FunctionComponent } from "react";
import { MoreDropsProps } from "../type/drop.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const MoreDrops: FunctionComponent<MoreDropsProps> = ({
  otherDrops,
  autoProfile,
  push,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start">
      <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words text-lg">
        {`Other Collections by ${autoProfile?.handle?.localName?.toLowerCase()}`}
      </div>
      <div className="relative w-full sm:w-2/3 h-fit overflow-x-scroll flex items-start justify-start">
        <div className="flex flex-row gap-2 w-fit h-fit">
          {otherDrops?.map((collection: Collection, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex flex-col gap-1.5 cursor-pointer hover:opacity-70 border border-ama rounded-md"
                onClick={() =>
                  push(
                    `/autograph/${
                      autoProfile?.handle?.suggestedFormatted?.localName?.split("@")[1]
                    }/collection/${collection.name
                      ?.replaceAll(" ", "_")
                      ?.toLowerCase()}`
                  )
                }
              >
                <div
                  className="w-24 h-24 relative flex rounded-md"
                  id="staticLoad"
                >
                  {collection?.uri?.image &&
                  collection?.uri?.type?.includes("video") ? (
                    <video
                      muted
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover rounded-md"
                    >
                      <source
                        src={`${INFURA_GATEWAY}/ipfs/${
                          collection?.uri?.image?.split("ipfs://")[1]
                        }`}
                        type="video/mp4"
                      />
                    </video>
                  ) : (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.uri?.image?.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )}
                  <div className="absolute w-full h-fit flex flex-col gap-2 justify-end ml-auto items-end right-0 top-4">
                    <div
                      className={`relative flex w-fit p-1 rounded-l-md h-fit text-ama font-mana items-end justify-end whitespace-nowrap text-xxs bg-black right-0 border border-ama`}
                    >
                      {Number(collection?.tokenIds?.length) -
                        (collection?.soldTokens?.length
                          ? collection?.soldTokens?.length
                          : 0) ===
                      0
                        ? "SOLD OUT"
                        : `${
                            Number(collection?.tokenIds?.length) -
                            (collection?.soldTokens?.length
                              ? collection?.soldTokens?.length
                              : 0)
                          } /
                  ${Number(collection?.tokenIds?.length)}`}
                    </div>
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 flex flex-col w-full h-fit text-center items-end justify-end ml-auto`}
                  >
                    <div
                      className={`relative w-fit h-fit text-white font-mana words-break flex text-xxs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
                    >
                      {collection?.uri?.name?.length! > 8
                        ? collection?.uri?.name?.slice(0, 6) + "..."
                        : collection?.uri?.name}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoreDrops;
