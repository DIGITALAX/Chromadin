import { setNoHandle } from "@/redux/reducers/noHandleSlice";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { ClaimProps } from "../types/modals.types";
import { AiOutlineLoading } from "react-icons/ai";

const Claim: FunctionComponent<ClaimProps> = ({
  dispatch,
  message,
  handleLensSignIn,
  signInLoading,
  address,
  profileId,
  handleConnect,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full preG:w-80 h-96 col-start-1 place-self-center bg-offBlack rounded-lg border border-white">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="absolute w-full h-full flex items-start">
            <video
              muted
              playsInline
              autoPlay
              loop
              className="relative w-full h-full rounded-lg flex items-start justify-start object-cover"
            >
              <source src={"/videos/lens.mp4"} type="video/mp4" />
            </video>
            <div className="absolute w-full h-full flex bg-offBlack/70 rounded-lg"></div>
          </div>
          <div className="relative w-full h-full flex flex-col gap-10 pb-8 items-center justify-center">
            <div className="relative w-full ml-auto h-fit flex justify-end items-start pr-3 pt-3 cursor-pointer mt-auto">
              <ImCross
                color="white"
                size={15}
                onClick={() =>
                  dispatch(
                    setNoHandle({
                      actionValue: false,
                      actionMessage: "",
                    })
                  )
                }
              />
            </div>
            <div className="relative w-full h-full flex flex-col gap-8 items-center justify-center">
              <div className="relative w-1/2 h-fit flex px-4 text-white text-base items-center justify-center break-words font-earl text-center">
                {message}
              </div>
              {message.includes("Own Your Digital Roots.") ? (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={"https://claim.lens.xyz"}
                  className="relative w-fit h-10 flex px-4 cursor-pointer active:scale-95 bg-lensLight/80 font-earl text-white rounded-md items-center justify-center"
                >
                  <div className="relative w-fit h-fit items-center justify-center flex text-sm px-3 py-1.5 text-center">
                    Claim Handle
                  </div>
                </Link>
              ) : (
                <div
                  onClick={
                    address && !profileId
                      ? () => handleLensSignIn()
                      : () => handleConnect()
                  }
                  className="relative w-28 h-10 flex px-4 cursor-pointer active:scale-95 bg-lensLight/80 font-earl text-white rounded-md items-center justify-center"
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex text-sm px-3 py-1.5 text-center ${
                      signInLoading && "animate-spin"
                    }`}
                  >
                    {signInLoading ? (
                      <AiOutlineLoading />
                    ) : address && !profileId ? (
                      "Sign In"
                    ) : (
                      "Connect"
                    )}
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

export default Claim;
