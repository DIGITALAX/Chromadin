import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { CoinOpProps } from "../types/autograph.types";
import { setNftScreen } from "@/redux/reducers/nftScreenSlice";

const CoinOp: FunctionComponent<CoinOpProps> = ({
  coinOpItems,
  autoProfile,
  router,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div className="relative flex flex-col gap-1 w-fit h-fit items-start justify-start font-earl text-white break-words">
        <div className="relative w-fit h-fit items-start justify-start  text-2xl">
          {`IRL Fashion by ${autoProfile?.handle?.localName?.toLowerCase()}`}
        </div>
        <div
          className="relative text-xxs w-fit h-fit items-start justify-start break-words cursor-pointer"
          onClick={() => window.open("https://www.themanufactory.xyz/")}
        >
          {`( Fulfilled locally in NYC at The Manufactory )`}
        </div>
      </div>
      <div className="relative w-full md:w-2/3 h-fit overflow-x-scroll flex items-start justify-start">
        <div className="flex flex-row gap-2 w-fit h-fit">
          {coinOpItems?.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex flex-col gap-1.5 cursor-pointer hover:opacity-70"
                onClick={() => {
                  dispatch(setNftScreen(false));
                  router.push(
                    `/autograph/${
                      autoProfile?.handle?.suggestedFormatted?.localName?.split("@")[1]
                    }/collection/${item?.name
                      ?.replaceAll(" ", "_")
                      ?.toLowerCase()}`
                  );
                }}
              >
                <div
                  className="w-52 h-52 relative flex rounded-md border border-ama"
                  id="staticLoad"
                >
                  {item?.uri?.image?.[0]?.split("ipfs://")[1] && (
                    <Image
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${
                        item?.uri?.image?.[0]?.split("ipfs://")[1]
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
                      {item?.name?.length > 12
                        ? item?.name?.slice(0, 10) + "..."
                        : item?.name}
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

export default CoinOp;
