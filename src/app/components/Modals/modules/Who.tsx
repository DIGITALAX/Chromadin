import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading, AiOutlineRetweet } from "react-icons/ai";
import WhoSwitch from "./WhoSwitch";
import { ModalContext } from "@/app/providers";
import useWho from "../hooks/useWho";
import { BsChatLeftQuote } from "react-icons/bs";

const Who: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const {
    reactors,
    quoters,
    dataLoading,
    setMirrorQuote,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
  } = useWho();

  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-[90vw] sm:w-[70vw] half:w-[60vw] min-w-fit px-2 md:w-[40vw] lg:w-[40vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg text-white font-dosis cursor-pointer"
        id="boxBg"
      >
        <div className="relative w-full row-start-2 h-fit grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 place-self-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 pb-8">
              <div className="relative w-fit h-fit items-end justify-end ml-auto pr-3 pt-3 cursor-pointer flex">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() => {
                    setMirrorQuote(false);
                    context?.setWho(undefined);
                  }}
                />
              </div>
              {context?.who?.type === "mirror" &&
                (reactors?.length > 0 || quoters?.length > 0) && (
                  <div className="relative w-full h-fit flex items-center justify-center flex-row gap-2">
                    <div
                      className={`relative w-5 h-5 flex items-center justify-center hover:opacity-70 cursor-pointer ${
                        !mirrorQuote && "opacity-50"
                      }`}
                      onClick={() => setMirrorQuote(true)}
                      title="Quotes"
                    >
                      <BsChatLeftQuote color="white" />
                    </div>
                    <div
                      className={`relative w-5 h-5 flex items-center justify-center hover:opacity-70 cursor-pointer ${
                        mirrorQuote && "opacity-50"
                      }`}
                      onClick={() => setMirrorQuote(false)}
                      title="Mirrors"
                    >
                      <AiOutlineRetweet color="white" />
                    </div>
                  </div>
                )}

              {!dataLoading ? (
                <WhoSwitch
                  dict={dict}
                  reactors={reactors}
                  quoters={quoters}
                  hasMore={hasMore}
                  hasMoreQuote={hasMoreQuote}
                  showMore={showMore}
                  mirrorQuote={mirrorQuote}
                />
              ) : (
                <div className="relative w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="white" size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Who;
