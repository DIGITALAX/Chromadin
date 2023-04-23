import { INFURA_GATEWAY } from "@/lib/constants";
import { setSuccess } from "@/redux/reducers/successSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { useDispatch } from "react-redux";
import { SuccessProps } from "../types/modals.types";

const Success: FunctionComponent<SuccessProps> = ({ media }): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full lg:w-[30vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg">
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={15}
                  onClick={() =>
                    dispatch(
                      setSuccess({
                        actionOpen: false,
                        actionMedia: "",
                        actionName: "",
                      })
                    )
                  }
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-6">
                <div className="relative w-3/4 h-fit justify-center items-center text-white font-earl text-sm text-center">
                  It’s all yours now. <br /> <br /> Return like a blast from the
                  past for token gated access & fulfillment updates.
                </div>
                <div
                  className="relative w-1/2 h-36 preG:h-52 lg:h-40 xl:h-52 justify-center items-center rounded-lg border border-white"
                  id="staticLoad"
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${media}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
