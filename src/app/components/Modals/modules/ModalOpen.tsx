import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";

const ModalOpen: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-full md:w-[30vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg"
        id="boxBg"
      >
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-10 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() => context?.setModalOpen(undefined)}
                />
              </div>
              <div className="relative w-full h-fit row-start-2 grid grid-flow-col auto-cols-auto px-4">
                <div className="relative w-fit h-fit font-earl text-white text-xl place-self-center text-center">
                  {context?.modalOpen}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOpen;
