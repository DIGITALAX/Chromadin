import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import { AiOutlineLoading } from "react-icons/ai";
import moment from "moment";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import useSimpleCollect from "../hooks/useSimpleCollect";

export const SimpleCollect: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { hacerSimpleCollect, simpleCollectCargando } = useSimpleCollect(dict);

  return (
    <div
      className="inset-0 justify-center fixed z-200 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        context?.setCollect(undefined);
      }}
    >
      <div
        className="relative flex w-fit h-fit overflow-y-scroll place-self-center bg-offBlack cursor-default rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-[90vw] sm:w-[70vw] half:w-[60vw] min-w-fit md:w-[40vw] lg:w-[40vw] max-h-[60vh] overflow-y-scroll h-fit flex items-start justify-center">
          <div
            className={`flex flex-col items-center py-10 px-4 gap-5 text-white font-dosis relative w-full lg:w-[75%] h-[80%] lg:h-[65%] justify-start flex overflow-y-scroll sm:text-base text-xs`}
          >
            <div
              className={`relative rounded-md flex flex-col gap-5 w-full lg:w-5/6 p-2 items-center justify-start max-h-fit`}
            >
              <div
                className={`relative rounded-md flex flex-col gap-5 w-5/6 p-2 items-center justify-center w-full h-fit text-white text-sm`}
              >
                <div className="relative w-fit h-fit flex items-center justify-center">
                  {dict.Common.red}
                </div>
                <div className="relative w-3/4 xl:w-1/2 items-center justify-center rounded-md border border-white h-60 flex">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmQf3pEG3AXMn5xqRN8Kd8eAC7pEvFoCKvXoycZDpB44Km`}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-md"
                    draggable={false}
                  />
                </div>
                {context?.collect?.action?.endsAt && (
                  <div className="relative w-fit h-fit flex items-center justify-center break-words px-2 text-center">
                    {new Date(context?.collect?.action?.endsAt).getTime() <
                    Date.now()
                      ? dict.Common.over
                      : `${dict.Common.fin} ${
                          moment
                            .duration(
                              moment(context?.collect?.action?.endsAt).diff(
                                moment()
                              )
                            )
                            .asMilliseconds() > 0
                            ? `${moment
                                .utc(
                                  moment(context?.collect?.action?.endsAt).diff(
                                    moment()
                                  )
                                )
                                .format("H [hrs]")} and ${moment
                                .utc(
                                  moment(context?.collect?.action?.endsAt).diff(
                                    moment()
                                  )
                                )
                                .format("m [min]")}`
                            : dict.Common.hr
                        }`}
                  </div>
                )}
                {Number(context?.collect?.action?.collectLimit) > 0 && (
                  <div className="relative w-fit h-fit flex items-center justify-center text-base text-center">
                    {context?.collect?.stats || 0} /{" "}
                    {context?.collect?.action?.collectLimit}
                  </div>
                )}
                {context?.collect?.action?.payToCollect?.amount &&
                  Number(
                    context?.collect?.action?.payToCollect?.amount?.value
                  ) > 0 && (
                    <div className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 text-base text-sol">
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {context?.collect?.action?.payToCollect?.amount?.value}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {
                          context?.collect?.action?.payToCollect?.amount?.asset
                            ?.symbol
                        }
                      </div>
                    </div>
                  )}
              </div>
              <div
                className={`relative min-w-32 w-fit h-8 py-1 px-2 border border-white rounded-md font-aust text-white bg-black flex items-center justify-center text-xs ${
                  !simpleCollectCargando && "cursor-pointer active:scale-95"
                }`}
                onClick={() => !simpleCollectCargando && hacerSimpleCollect()}
              >
                <div
                  className={`relative w-fit h-fit flex items-center justify-center ${
                    simpleCollectCargando && "animate-spin"
                  }`}
                >
                  {simpleCollectCargando ? (
                    <AiOutlineLoading size={15} color={"white"} />
                  ) : Number(context?.collect?.stats) ==
                      Number(context?.collect?.action?.collectLimit) &&
                    Number(context?.collect?.action?.collectLimit) > 0 ? (
                    dict.Common.sol
                  ) : (
                    dict.Common.col2
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCollect;
