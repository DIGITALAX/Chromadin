import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import useMetrics from "../hooks/useMetrics";
import PlayerMetrics from "./PlayerMetrics";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const Metrics: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );

  return (
    <DndContext
      onDragEnd={(event) => {
        if (event.delta) {
          setPosition((prev) => ({
            x: prev.x + event.delta.x,
            y: prev.y + event.delta.y,
          }));
        }
      }}
      sensors={sensors}
    >
      <DraggableMetrics position={position} dict={dict} />
    </DndContext>
  );
};

export default Metrics;

export const DraggableMetrics = ({
  dict,
  position,
}: {
  dict: any;
  position: {
    x: number;
    y: number;
  };
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable-metrics",
  });
  const finalTransform = transform
    ? `translate3d(${position.x + transform.x}px, ${
        position.y + transform.y
      }px, 0)`
    : `translate3d(${position.x}px, ${position.y}px, 0)`;

  const context = useContext(ModalContext);
  const {
    metricsLoading,
    handleMetricsAdd,
    liveMetrics,
    onChainMetrics,
    currentMetricsLoading,
  } = useMetrics(dict);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: finalTransform }}
      {...listeners}
      {...attributes}
      className={
        "fixed z-20 w-full sm:w-[55vw] tablet:w-[40vw] h-[40rem] sm:h-[20rem] max-h-[90vh] p-4 cursor-grab active:cursor-grabbing items-start border-4 border-black rounded-lg bg-offBlack top-40 left-0 sm:left-10 flex flex-col"
      }
    >
      <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2">
        <div className="relative w-fit h-fit flex ml-auto">
          <div className="close" onClick={() => context?.setMetrics(false)}>
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
                    dict?.metA
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
            {dict?.mets}
          </div>
          <div className="relative w-1/2 h-px bg-cost flex"></div>
          <PlayerMetrics metrics={onChainMetrics} text={dict?.logged} />
        </div>
        <div className="relative flex items-center justify-start gap-1.5 flex-col w-full h-full">
          <div className="relative w-fit h-fit flex items-center justify-center font-dosis text-xs text-white">
            {dict?.live}
          </div>
          <div className="relative w-1/2 h-px bg-cost flex"></div>
          {currentMetricsLoading ? (
            <div className="relative w-full h-fit flex items-center justify-center opacity-80 pt-3">
              <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                <AiOutlineLoading size={12} color={"white"} />
              </div>
            </div>
          ) : (
            <PlayerMetrics metrics={liveMetrics} text={dict?.session} />
          )}
        </div>
      </div>
    </div>
  );
};
