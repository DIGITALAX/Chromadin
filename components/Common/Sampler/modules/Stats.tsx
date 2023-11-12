import { FunctionComponent } from "react";
import { StatsProps } from "../types/sampler.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";

const Stats: FunctionComponent<StatsProps> = ({
  statsTitles,
  statsRedux,
  statsLoading,
}): JSX.Element => {
  return (
    <div className="w-full h-96 xl:h-full relative flex flex-row gap-3 overflow-x-scroll">
      {(statsTitles.length < 1 ? statsRedux : statsTitles)
        ?.map((innerArr) => innerArr[0])
        ?.map((statValue: string, indexOne: number) => {
          return (
            <div
              key={indexOne}
              className="relative w-full h-full flex bg-black/60 rounded-lg p-3 flex flex-col"
            >
              <div className="relative w-full h-fit justify-end items-center flex animate-pulse">
                <div className="relative h-2 w-2 rounded-full bg-verde/50"></div>
              </div>
              <div className="relative w-full h-fit text-white font-arcade text-xs flex items-center justify-start pb-2">
                {statValue}
              </div>
              <div className="relative w-60 h-full gap-2 grid grid-flow-row auto-rows-auto overflow-y-scroll p-4">
                {statsLoading
                  ? Array.from({ length: 10 }).map((_, index: number) => {
                      return (
                        <div
                          className="relative bg-black rounded-lg flex flex-row w-full h-10 py-1.5 px-2 gap-3 items-center justify-center cursor-pointer"
                          key={index}
                        >
                          <FetchMoreLoading size="2" />
                        </div>
                      );
                    })
                  : (!statsTitles?.[0]?.[1] ? statsRedux : statsTitles)
                      ?.map((innerArr) => innerArr[1])
                      [indexOne]?.map((value: any, indexTwo: number) => {
                        return (
                          <div
                            key={indexTwo}
                            className="relative bg-black rounded-lg flex flex-row w-full h-full py-1.5 px-2 gap-3 items-center justify-center cursor-pointer"
                            onClick={() =>
                              window.open(
                                indexOne === 4 || indexOne === 5
                                  ? `https://www.chromadin.xyz/#chat?option=history&post=${value?.publication_id}`
                                  : `https://www.chromadin.xyz/#chat?option=history&profile=${value?.handle}`
                              )
                            }
                          >
                            {indexOne === 4 || indexOne === 5 ? (
                              <div className="relative w-full  flex flex-col h-fit items-center justify-start">
                                <div className="relative w-full h-fit text-moda font-arcade text-sm">
                                  id: {value?.publication_id}
                                </div>
                                <div className="relative w-full h-fit flex text-ama font-earl text-xs">
                                  {(
                                    (Number(value?.amount) / 10 ** 18) *
                                    value?.total_amount_of_collects
                                  ).toFixed(3)}{" "}
                                  matic
                                </div>
                                <div className="relative w-full h-fit flex flex-row gap-2 justify-start items-center">
                                  <div className="relative w-fit h-fit flex">
                                    <Image
                                      src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                                      width={12}
                                      height={12}
                                      alt="collect"
                                      draggable={false}
                                    />
                                  </div>
                                  <div className="relative w-fit h-fit font-earl text-white text-sm">
                                    {value?.total_amount_of_collects} @{" "}
                                    {(Number(value?.amount) / 10 ** 18).toFixed(
                                      2
                                    )}{" "}
                                    ea.
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div
                                  className="relative w-10 h-3/4 rounded-tr-lg flex items-center justify-center"
                                  id="crt"
                                >
                                  {value?.profile_picture_s3_url && (
                                    <Image
                                      src={`${
                                        value?.profile_picture_s3_url.includes(
                                          "ipfs://"
                                        )
                                          ? `${INFURA_GATEWAY}/ipfs/${
                                              value?.profile_picture_s3_url.split(
                                                "ipfs://"
                                              )[1]
                                            }`
                                          : `${INFURA_GATEWAY}/ipfs/${
                                              value?.profile_picture_s3_url?.split(
                                                "ipfs/"
                                              )[1]
                                            }`
                                      }`}
                                      layout="fill"
                                      objectFit="cover"
                                      className="rounded-tr-lg flex"
                                      priority
                                      draggable={false}
                                    />
                                  )}
                                </div>
                                <div className="relative w-full h-full justify-start items-center flex font-earl text-sm lowerCase flex-col">
                                  <div className="relative w-full h-fit justify-start items-center  text-ama flex">
                                    @
                                    {value?.handle?.length >= 12
                                      ? value?.handle?.slice(0, 9) + "..."
                                      : value?.handle[0]}
                                  </div>
                                  <div className="relative text-moda justify-start w-full h-fit items-center">
                                    {indexOne === 0
                                      ? value?.total_mirrors
                                      : indexOne === 1
                                      ? value?.total_collects
                                      : indexOne === 2
                                      ? value?.total_posts
                                      : indexOne === 3
                                      ? value?.unique_collects_24h
                                      : `${
                                          Number(value?.total_amount) / 10 ** 18
                                        } matic`}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Stats;
