import { FunctionComponent } from "react";
import { SuperCreatorProps } from "../types/wavs.types";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";

const SuperCreator: FunctionComponent<SuperCreatorProps> = ({
  handleConnect,
  address,
  profileId,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-auto h-fit flex items-start justify-start ml-auto px-3 order-2 sm:order-1 lg:order-2 stuck2:order-1">
      <div className="relative flex flex-col h-fit w-full rounded-md text-white whitespace-nowrap gap-1">
        <div
          className={`relative text-sm w-fit h-fit justify-center flex border border-white font-earl border-dashed py-px px-2 flex items-center rounded-md active:scale-95 hover:text-moda cursor-pointer `}
          onClick={
            !address
              ? () => handleConnect()
              : address && !profileId
              ? () =>
                  dispatch(
                    setNoHandle({
                      actionValue: true,
                      actionMessage: "Sign In To Lens to Super Creator Follow.",
                    })
                  )
              : () => dispatch(setSuperFollow(true))
          }
        >
          super creator
        </div>
        <div className="relative h-fit w-full justify-end flex text-ama font-dosis text-xxs text-right">
          {!address || !profileId ? "sign in 2 follow" : " follow"}
        </div>
      </div>
    </div>
  );
};

export default SuperCreator;
