import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import Draggable from "react-draggable";
import { MetricsProps } from "../types/modals.types";
import { setMetrics } from "@/redux/reducers/metricsSlice";
import PlayerMetrics from "../../Video/modules/PlayerMetrics";
import { AiOutlineLoading } from "react-icons/ai";
import useMetrics from "../../Video/hooks/useMetrics";

const Metrics: FunctionComponent<MetricsProps> = ({
  dispatch,
  mainVideo,
  lensProfile,
  address,
  metricsOpen,
  t
}): JSX.Element => {
  const {
    metricsLoading,
    handleMetricsAdd,
    metricsRef,
    liveMetrics,
    onChainMetrics,
    currentMetricsLoading,
  } = useMetrics(dispatch, mainVideo, lensProfile, address, metricsOpen);
  return (
    <Draggable
      cancel=".close, .metrics"
      enableUserSelectHack={false}
      nodeRef={metricsRef as any}
    >
      <div
        className={
          "fixed z-20 w-full sm:w-[55vw] tablet:w-[40vw] h-[40rem] sm:h-[20rem] max-h-[90vh] p-4 cursor-grab active:cursor-grabbing items-start border-4 border-black rounded-lg bg-offBlack top-40 left-0 sm:left-10 flex flex-col"
        }
        ref={metricsRef as any}
      >
        <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2">
          <div className="relative w-fit h-fit flex ml-auto">
            <div className="close" onClick={() => dispatch(setMetrics(false))}>
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmRtXzfqbJXXZ6fReUihpauh9nz6pmjUv5CKGm3oXquzh4`}
                // layout="fill"
                width={25}
                height={25}
                draggable={false}
              />
            </div>
          </div>
          {liveMetrics && (
            <div className="absolute left-0 w-fit h-fit flex">
              <div className="metrics">
                <div
                  className="relative w-20 h-6 flex items-center px-2 py-1 justify-center rounded-sm bg-black border border-cost cursor-pointer active:scale-95 text-white font-dosis"
                  onClick={() => !metricsLoading && handleMetricsAdd()}
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center text-xxs ${
                      metricsLoading && "animate-spin"
                    }`}
                  >
                    {metricsLoading ? (
                      <AiOutlineLoading size={10} color="#847FF2" />
                    ) : (
                      t("metA")
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="relative w-full h-full flex items-center justify-start flex-col gap-4 overflow-y-scroll max-h-[35rem]">
          <div className="relative flex items-center justify-start gap-1.5 flex-col w-full h-full">
            <div className="relative w-fit h-fit flex items-center justify-center font-dosis text-xs text-white">
              {t("mets")}
            </div>
            <div className="relative w-1/2 h-px bg-cost flex"></div>
            <PlayerMetrics
              metrics={onChainMetrics}
              text={
                t("logged")
              }
            />
          </div>
          <div className="relative flex items-center justify-start gap-1.5 flex-col w-full h-full">
            <div className="relative w-fit h-fit flex items-center justify-center font-dosis text-xs text-white">
              {t("live")}
            </div>
            <div className="relative w-1/2 h-px bg-cost flex"></div>
            {currentMetricsLoading ? (
              <div className="relative w-full h-fit flex items-center justify-center opacity-80 pt-3">
                <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                  <AiOutlineLoading size={12} color={"white"} />
                </div>
              </div>
            ) : (
              <PlayerMetrics
                metrics={liveMetrics}
                text={t("session")}
              />
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Metrics;
