import { INFURA_GATEWAY } from "@/lib/constants";
import { setOptions } from "@/redux/reducers/optionsSlice";
import Image from "next/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";

const Options: FunctionComponent = (): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-28 flex flex-row items-center gap-1 justify-center bg-black xl:py-0 py-4">
      {Array.from([
        ["QmRdgKnemc66dMuhL4ZFBzhfjwTpFCcMxQ7cmSs9SKCi9z", "history"],
        ["QmWEhVTWTEwYjJc1g6Wdm2qNNAhYT4wGA6azbGMTTmX8BB", "fulfillment"],
        ["QmQ5txk78C2RxWrqSwXcH9H3DEQag5nJWpqA6FnZD4FTsf", "account"],
      ]).map((value: string[], index: number) => {
        return (
          <div
            className="relative w-full h-full grid grid-flow-row auto-rows-auto flex items-center"
            key={index}
            onClick={() => dispatch(setOptions(value[1]))}
          >
            <div
              className={`relative w-12 h-12 grid grid-flow-col auto-cols-auto row-start-1 justify-self-center items-center flex cursor-pointer active:scale-95`}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmPoXfm1VgBsE4eE3UZw6uGoFAVwShnz6zaEuXkHdryoc9`}
                alt="border"
                fill
                draggable={false}
              />
              <div className="relative place-self-center col-start-1 w-fit h-fit flex">
                <Image
                  alt="border"
                  src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                  height={23}
                  width={20}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Options;
