import { FunctionComponent } from "react";
import { SuperCreatorProps } from "../types/wavs.types";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";

const SuperCreator: FunctionComponent<SuperCreatorProps> = ({
  openConnectModal,
  address,
  lensProfile,
  dispatch,
  t
}): JSX.Element => {
  return (
    <div className="relative w-auto h-fit flex items-start justify-start ml-auto px-3 order-2 sm:order-1 lg:order-2 stuck2:order-1">
      <div className="relative flex flex-col h-fit w-full rounded-md text-white whitespace-nowrap gap-1">
        <div
          className={`relative text-sm w-fit h-fit justify-center flex border border-white font-earl border-dashed py-px px-2 flex items-center rounded-md active:scale-95 hover:text-moda cursor-pointer `}
          onClick={
            !address
              ? openConnectModal
              : address && !lensProfile?.id
              ? () =>
                  dispatch(
                    setNoHandle({
                      actionValue: true,
                      actionMessage: t("sigM"),
                    })
                  )
              : () => dispatch(setSuperFollow(true))
          }
        >
          {t("super")}
        </div>
        <div className="relative h-fit w-full justify-end flex text-ama font-dosis text-xxs text-right">
          {!address || !lensProfile?.id ? t("sfol") : t("fol")}
        </div>
      </div>
    </div>
  );
};

export default SuperCreator;
