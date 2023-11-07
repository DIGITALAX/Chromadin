import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { GraphsProps } from "../types/sampler.types";

const Graphs: FunctionComponent<GraphsProps> = ({
  graphData,
  graphLoading,
  setCanvas,
  canvas,
  graphsRedux,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full sm:h-100 xl:h-full flex bg-black/60 rounded-lg flex-col p-4 font-arcade gap-5">
      <div className="relative w-fit h-fit flex items-center justify-center">
        <div className="absolute w-full h-fit -top-1" id={"graphBack"}>
          {`Leading ${canvas}`}
        </div>
        <div className="relative w-full h-fit text-white">
          {`Leading ${canvas}`}
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col sm:flex-row gap-3 items-center justify-center">
        <div className="relative text-white flex flex-row sm:flex-col text-xs w-full h-fit sm:w-fit sm:h-full items-center justify-center gap-2 preG:flex-nowrap flex-wrap">
          {Array.from([
            ["QmVvG9A3GCFeBdhkAopWbf8ao9vgHofzjsHBtXyecP3u9J", "interests"],
            ["QmYYCBrqgMJgG1TDHfYqp3qsyVxD3EhFgTtu97CbboiwxQ", "music"],
            ["QmW2fNHHvhCXVAL3Wo5CBt1QyiKpczF5dX5Mj9Ja6N7Y4x", "images"],
            ["Qmaox51kA8vJ4db8vCALMCNg4EzawhLD7con39aqAkDTGj", "video"],
            ["QmduZ44Ece4CX2qNjkiAjcBNv4Uc95dTLyiSCQo61ajyu5", "hashtags"],
          ]).map((value: string[], index: number) => {
            return (
              <div
                className="relative w-fit h-fit preG:h-full flex flex-col items-center justify-center cursor-pointer active:scale-95"
                key={index}
                onClick={() => setCanvas(value[1])}
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
                <div className="relative w-fit h-fit items-center justify-center text-center flex">
                  {value[1]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative w-full h-full flex flex-row gap-4">
          <div className="relative w-10 h-full flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmbfTiWJyy4r9xi4EsxY5LN1pyW6D2TbFHJrBgmSY3vm8V`}
              layout="fill"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-full flex flex-row gap-3 justify-start items-end sm:overflow-x-visible overflow-x-scroll">
            {graphLoading
              ? Array.from({ length: 16 }).map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative cursor-cell w-full animate-pulse"
                      style={{ height: `${(16 - index) * 6.25}%` }}
                      id="borderGraph"
                    ></div>
                  );
                })
              : (graphData.length < 1 ? graphsRedux : graphData)
                  .find((item) => item.name === canvas)
                  ?.data?.slice()
                  .sort((a: any, b: any) => b.percentage - a.percentage)
                  ?.map((item: any, index: number) => {
                    const percentage =
                      (item.percentage /
                        ((graphData.length < 1 ? graphsRedux : graphData)
                          .find((item) => item.name === canvas)
                          ?.data?.slice()
                          .sort(
                            (a: any, b: any) => b.percentage - a.percentage
                          )?.[0]?.percentage ?? 0)) *
                      100;

                    return (
                      <div
                        className="relative w-full h-full flex flex-col justify-end items-end"
                        key={index}
                      >
                        <div className="relative w-fit h-fit text-xxs text-white font-arcade flex flex-col sm:hidden">
                          {canvas !== "interests" && canvas !== "hashtags" && (
                            <div
                              className="relative w-4 h-4 rounded-full"
                              id="crt"
                            >
                              {item?.label?.pfp && (
                                <Image
                                  className="rounded-full w-full h-full flex"
                                  layout="fill"
                                  draggable={false}
                                  src={
                                    item?.label?.pfp?.includes("imagekit")
                                      ? item?.label?.pfp
                                      : item?.label?.pfp?.includes("ipfs://")
                                      ? `${INFURA_GATEWAY}/ipfs/${
                                          item?.label?.pfp?.split("ipfs://")[1]
                                        }`
                                      : `${INFURA_GATEWAY}/ipfs/${
                                          item?.label?.pfp?.split("ipfs/")[1]
                                        }`
                                  }
                                  alt="pfp"
                                />
                              )}
                            </div>
                          )}
                          {canvas === "interests"
                            ? item.label
                                .replace(/_{2,}/g, " ")
                                .replace(/_/g, " ")
                            : canvas === "hashtags"
                            ? `#${item.label
                                .replace(/_{2,}/g, " ")
                                .replace(/_/g, " ")}`
                            : `@${item.label.handle}`}
                        </div>
                        <div
                          onClick={
                            canvas !== "interests" && canvas !== "hashtags"
                              ? () =>
                                  window.open(
                                    `https://www.chromadin.xyz/#chat?option=history&profile=${item?.label?.handle}`
                                  )
                              : () => {}
                          }
                          id="borderGraph"
                          className="relative cursor-cell"
                          style={{ height: `${percentage}%` }}
                          onMouseOver={(e) => {
                            const tooltip = document.createElement("div");
                            if (
                              canvas !== "interests" &&
                              canvas !== "hashtags"
                            ) {
                              const img = document.createElement("img");
                              if (item?.label?.pfp) {
                                img.src = item?.label?.pfp?.includes("imagekit")
                                  ? item?.label?.pfp
                                  : item?.label?.pfp?.includes("ipfs://")
                                  ? `${INFURA_GATEWAY}/ipfs/${
                                      item?.label?.pfp?.split("ipfs://")[1]
                                    }`
                                  : `${INFURA_GATEWAY}/ipfs/${
                                      item?.label?.pfp?.split("ipfs/")[1]
                                    }`;
                              }
                              img.classList.add("pfp");
                              tooltip.appendChild(img);
                            }
                            const label = document.createElement("span");
                            label.innerText =
                              canvas === "interests"
                                ? item.label
                                    .replace(/_{2,}/g, " ")
                                    .replace(/_/g, " ")
                                : canvas === "hashtags"
                                ? `#${item.label
                                    .replace(/_{2,}/g, " ")
                                    .replace(/_/g, " ")}`
                                : `@${item.label.handle}`;
                            label.style.marginLeft = "4px";
                            tooltip.appendChild(label);

                            tooltip.classList.add("tooltip");
                            tooltip.style.top = `${e.pageY}px`;
                            tooltip.style.left = `${e.pageX}px`;

                            document.body.appendChild(tooltip);
                          }}
                          onMouseOut={() => {
                            const tooltip = document.querySelector(".tooltip");
                            if (tooltip) {
                              document.body.removeChild(tooltip);
                            }
                          }}
                        ></div>
                      </div>
                    );
                  })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
