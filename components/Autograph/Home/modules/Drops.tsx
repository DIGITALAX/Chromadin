import { Drop } from "@/components/Home/types/home.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { DropsProps } from "../types/autograph.types";

const Drops: FunctionComponent<DropsProps> = ({
  allDrops,
  autoProfile,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words text-2xl">
        {`All Drops by ${autoProfile?.handle?.suggestedFormatted?.localName
          ?.split("@")[1]
          ?.toLowerCase()}`}
      </div>
      <div className="relative w-full md:w-2/3 h-fit overflow-x-scroll flex items-start justify-start">
        <div className="flex flex-row gap-2 w-fit h-fit">
          {allDrops?.map((drop: Drop, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex flex-col gap-1.5 cursor-pointer hover:opacity-70"
                onClick={() =>
                  router.push(
                    `/autograph/${
                      autoProfile?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )[1]
                    }/drop/${drop?.dropDetails?.dropTitle
                      ?.replaceAll(" ", "_")
                      ?.toLowerCase()}`
                  )
                }
              >
                <div
                  className="w-52 h-52 relative flex rounded-md border border-ama"
                  id="staticLoad"
                >
                  {drop?.dropDetails?.dropCover && (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        drop?.dropDetails?.dropCover?.split("ipfs://")[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-md"
                    />
                  )}
                  <div
                    className={`absolute bottom-0 right-0 flex flex-col w-full h-fit text-center items-end justify-end ml-auto`}
                  >
                    <div
                      className={`relative w-fit h-fit text-white font-mana words-break flex text-xs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
                    >
                      {drop?.dropDetails?.dropTitle?.length > 12
                        ? drop?.dropDetails?.dropTitle?.slice(0, 10) + "..."
                        : drop?.dropDetails?.dropTitle}
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

export default Drops;
