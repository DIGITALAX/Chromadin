import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { RatesProps } from "../types/sampler.types";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";

const Rates: FunctionComponent<RatesProps> = ({
  totalChanges,
  ratesRedux,
  ratesLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-2/3 flex bg-black/60 rounded-lg flex-col preG:flex-row gap-3 font-arcade p-2">
      {Array.from([
        [
          (totalChanges.length < 1 ? ratesRedux : totalChanges)[0],
          "Δ 48 HR PUB REVENUE",
        ],
        [
          (totalChanges.length < 1 ? ratesRedux : totalChanges)[1],
          "Δ 48 HR PUB AMOUNT",
        ],
      ]).map((value: any[], index: number) => {
        return (
          <div
            className="relative w-full h-full flex flex-col items-center justify-center gap-2"
            key={index}
          >
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div className="absolute w-full h-fit -top-1" id={"amountBack"}>
                {value[1]}
              </div>
              <div className="relative w-full h-fit text-white">{value[1]}</div>
            </div>
            {ratesLoading ? (
              <div className="relative w-4/5 h-16 py-3 px-1 bg-black rounded-xl flex items-center justify-center flex flex-row gap-4">
                <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                  <FetchMoreLoading size="4" />
                </div>
              </div>
            ) : (
              <div className="relative w-4/5 h-16 py-3 px-1 bg-black rounded-xl flex items-center justify-center flex flex-row gap-4">
                <div className="relative w-4 h-1/2 flex items-center justify-center">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${
                      value[0] < 1
                        ? "QmXfTo7frXU1aBh4ppnXSRk212xCbuBqApYRo78VFy4m13"
                        : "QmU3865HsaPwgUzvkFNrqy9iP91yWxm3XaA9y6hmRsXkfA"
                    }`}
                    layout="fill"
                    className="flex items-center justify-center"
                    draggable={false}
                  />
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center whitespace-nowrap">
                  <div
                    className="absolute w-full h-fit text-3xl -top-1"
                    id="percent2Back"
                  >
                    {value[0]?.toFixed(2)}%
                  </div>
                  <div className={`relative w-full h-fit text-white text-3xl`}>
                    {value[0]?.toFixed(2)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rates;
