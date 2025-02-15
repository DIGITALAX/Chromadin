import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { SuperFollowProps } from "../types/modals.types";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";
import QuickProfiles from "../../Wavs/modules/QuickProfiles";
import { AiOutlineLoading } from "react-icons/ai";

const FollowSuper: FunctionComponent<SuperFollowProps> = ({
  dispatch,
  followSuper,
  quickProfiles,
  router,
  superCreatorLoading,
  followedSuper,
  t
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto overflow-x-scroll">
      <div
        className="relative w-full lg:w-[30vw] h-fit col-start-1 place-self-center bg-offBlack rounded-lg border-2 border-ama"
        id="backdrop"
      >
        <div className="relative w-full row-start-2 h-fit rounded-xl grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 rounded-xl place-self-center">
            <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-4 pb-8">
              <div className="relative w-fit h-fit row-start-1 self-center justify-self-end pr-3 pt-3 cursor-pointer">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() => dispatch(setSuperFollow(false))}
                />
              </div>
              <div className="relative w-full h-fit flex flex-col items-center justify-center px-4 gap-10 overflow-x-scroll">
                <div className="relative w-3/4 h-fit flex items-center w-full h-fit gap-1.5 flex-col justify-center text-white font-dosis">
                  <div className="relative w-full h-fit justify-center items-center text-lg text-center">
                    {t("auto")}
                  </div>
                  <div className="relative w-fit justify-center items-center flex text-xs">{`(Well, ${Math.ceil(
                    quickProfiles.length / 15
                  )} clicks, there's a bunch of creators!)`}</div>
                </div>
                <div className="max-w-full overflow-x-scroll">
                  <QuickProfiles
                    router={router}
                    quickProfiles={quickProfiles}
                  />
                </div>
                <div
                  className="relative w-fit h-fit px-3 py-2 flex  font-dosis rounded-md cursor-pointer active:scale-95"
                  onClick={() => !superCreatorLoading && followSuper()}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
                    layout="fill"
                    alt="backdrop"
                    priority
                    draggable={false}
                    className="rounded-md w-full h-full"
                  />
                  <div
                    className={`relative text-ama w-20 h-8 flex items-center justify-center ${
                      superCreatorLoading && "animate-spin"
                    }`}
                  >
                    {superCreatorLoading ? (
                      <AiOutlineLoading color={"white"} size={15} />
                    ) : followedSuper ? (
                      t("fod")
                    ) : (
                     t("sup")
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowSuper;
