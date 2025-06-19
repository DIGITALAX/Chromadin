import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const QuestSuccess: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);

  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] rounded-md sm:w-[50vw] tablet:w-[25vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() => context?.setQuestSuccess(undefined)}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4 text-white font-dosis">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words text-sm">
              {dict?.joined} <br />
              <br />
              {dict?.keep}
            </div>
            <div
              className="relative flex items-center justify-center h-24 w-40 rounded-sm border border-cost cursor-pointer active:scale-95"
              onClick={() =>
                window.open(`https://kinora.irrevocable.dev/awards`)
              }
            >
              <Image
                layout="fill"
                className="rounded-sm"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/${context?.questSuccess}`}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestSuccess;
