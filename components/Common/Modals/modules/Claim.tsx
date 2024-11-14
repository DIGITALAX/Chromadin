import { setNoHandle } from "@/redux/reducers/noHandleSlice";
import Link from "next/link";
import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { ClaimProps } from "../types/modals.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const Claim: FunctionComponent<ClaimProps> = ({
  dispatch,
  message,
  handleLensSignIn,
  signInLoading,
  address,
  lensProfile,
  openConnectModal,
  t
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full preG:w-80 h-96 col-start-1 place-self-center bg-offBlack rounded-lg border border-white">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="relative w-full h-full flex flex-col gap-10 pb-8 items-center justify-center">
            <div className="relative w-full ml-auto h-fit flex justify-end items-start pr-3 pt-3 cursor-pointer mt-auto">
              <ImCross
                color="white"
                size={10}
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
            <div className="relative w-full h-full flex flex-col gap-6 items-center justify-center">
              <div className="relative w-3/4 h-40 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmbLJg7v2dWynUgztCg3iZ4CDv6s1vV2CmfZm3SkXUgnLA`}
                  layout="fill"
                  objectFit="cover"
                  draggable={false}
                />
              </div>
              <div className="relative w-5/6 h-fit flex px-4 text-white text-base items-center justify-center break-words font-earl text-center text-xs">
                {message}
              </div>
              {message.includes(t("roots")) ? (
                <Link
                  target="_blank"
                  rel="noreferrer"
                  href={"https://onboarding.lens.xyz/"}
                  className="relative w-fit h-10 flex px-4 cursor-pointer active:scale-95 bg-lensLight/80 font-earl text-white rounded-md items-center justify-center"
                >
                  <div className="relative w-fit h-fit items-center justify-center flex text-sm px-3 py-1.5 text-center">
                    {t("hand")}
                  </div>
                </Link>
              ) : (
                <div
                  onClick={
                    address && !lensProfile?.id
                      ? () => handleLensSignIn()
                      : openConnectModal
                  }
                  className="relative w-24 h-8 flex px-4 cursor-pointer active:scale-95 bg-bird font-earl text-white rounded-md items-center justify-center"
                >
                  <div
                    className={`relative w-fit h-fit items-center justify-center flex text-xs px-3 py-1.5 text-center ${
                      signInLoading && "animate-spin"
                    }`}
                  >
                    {signInLoading ? (
                      <AiOutlineLoading />
                    ) : address && !lensProfile?.id ? (
                      t("sign")
                    ) : (
                      t("connect")
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
