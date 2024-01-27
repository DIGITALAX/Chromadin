import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import { PiesProps } from "../types/sampler.types";

const Pies: FunctionComponent<PiesProps> = ({
  topAccountsFollowed,
  piesRedux,
  piesLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-96 flex flex-col bg-black/60 rounded-lg gap-2 items-center justify-center p-3">
      <div className="relative w-full h-fit flex justify-center items-center font-arcade text-white text-sm py-2">
        Top Followed Profiles (48HRS)
      </div>
      <div className="relative grid grid-cols-2 galaxy:grid-cols-3 preG:grid-cols-4 gap-3 overflow-y-scroll h-fit w-full place-self-center">
        {Array.from({ length: 12 }).map((_, index: number) => {
          const percentage = Number(
            (topAccountsFollowed.length < 1 ? piesRedux : topAccountsFollowed)[
              index
            ]?.percentage || 0
          );
          const numBars =
            Math.ceil(percentage / 5) > 15 ? 15 : Math.ceil(percentage / 5);
          return (
            <div
              className="relative w-20 h-fit flex flex-col font-earl text-white items-center justify-center place-self-center cursor-pointer"
              key={index}
              onClick={() =>
                window.open(
                  `https://www.chromadin.xyz/#chat?option=history&profile=${piesRedux[index]?.handle?.suggestedFormatted?.localName?.split("@")?.[1]}`
                )
              }
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmcPJ3gLHsRAdpR4X33PqFLTfjNZ3WxChzuW83txg6KENt`}
                width={70}
                height={70}
                draggable={false}
                alt="pie"
                className={`${piesLoading && "animate-spin"}`}
              />
              <div className="absolute bottom-8 w-1/3 flex flex-col items-center justify-end gap-px h-full">
                {Array.from({ length: numBars }, (_, index: number) => (
                  <div
                    key={index}
                    className="w-full h-0.5 rounded-xl bg-gradient-to-r from-b1 to-b2"
                  ></div>
                ))}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-center text-xxs font-geom pt-1">
                {
                  (topAccountsFollowed.length < 1
                    ? piesRedux
                    : topAccountsFollowed)[index]?.percentage
                }
                %
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-center text-xs cursor-pointer">
                @
                {(topAccountsFollowed.length < 1
                  ? piesRedux
                  : topAccountsFollowed)[index]?.handle?.length > 13
                  ? (topAccountsFollowed.length < 1
                      ? piesRedux
                      : topAccountsFollowed)[index]?.handle.slice(0, 11) + "..."
                  : (topAccountsFollowed.length < 1
                      ? piesRedux
                      : topAccountsFollowed)[index]?.handle?.suggestedFormatted?.localName?.split("@")?.[1]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pies;
