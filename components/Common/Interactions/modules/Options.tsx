import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

const Options: FunctionComponent = (): JSX.Element => {
  const router = useRouter();
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
          >
            <div
              className={`relative w-12 h-12 grid grid-flow-col auto-cols-auto row-start-1 justify-self-center items-center flex cursor-pointer active:scale-95`}
              onClick={() =>
                router.asPath.includes("&profile=")
                  ? router.asPath.includes("?option=")
                    ? router.push(
                        router.asPath.split("?option=")[0] +
                          "?option=" +
                          value[1] +
                          "&profile=" +
                          router.asPath.split("&profile=")[1]
                      )
                    : router.push(
                        router.asPath.split("&profile=")[0] +
                          "?option=" +
                          value[1] +
                          "&profile=" +
                          router.asPath.split("&profile=")[1]
                      )
                  : router.asPath.includes("&post=")
                  ? router.asPath.includes("?option=")
                    ? router.push(
                        router.asPath.split("?option=")[0] +
                          "?option=" +
                          value[1] +
                          "&post=" +
                          router.asPath.split("&post=")[1]
                      )
                    : router.push(
                        router.asPath.split("&post=")[0] +
                          "?option=" +
                          value[1] +
                          "&profile=" +
                          router.asPath.split("&post=")[1]
                      )
                  : router.asPath.includes("?option=")
                  ? router.push(
                      router.asPath.split("?option=")[0] + "?option=" + value[1]
                    )
                  : router.push(router.asPath + "?option=" + value[1])
              }
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
