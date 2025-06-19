import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { useAccount } from "wagmi";
import useLens from "../hooks/useLens";
import { useModal } from "connectkit";
const Auth: FunctionComponent<{ mainPage?: boolean; dict: any }> = ({
  mainPage,
  dict,
}): JSX.Element => {
  const { isConnected, address, chainId } = useAccount();
  const context = useContext(ModalContext);
  const { salir, lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding, openProfile, openSwitchNetworks } = useModal();
  return (
    <>
      {context?.lensConectado?.profile ? (
        <div
          className={`relative h-12 font-geom text-white flex flex-row px-2 cursor-pointer items-center justify-center ${
            mainPage
              ? "bg-none gap-2 w-40"
              : "bg-lensLight/70 border-white border rounded-tl-lg rounded-br-lg gap-4 w-full sm:w-40 lg:w-full"
          }`}
          onClick={() => openProfile?.()}
        >
          <div className={`relative rounded-full w-6 h-6`} id="crt">
            {context?.lensConectado?.profile?.metadata?.picture?.split(
              "ipfs://"
            )?.[1] && (
              <Image
                src={`${INFURA_GATEWAY_INTERNAL}${
                  context?.lensConectado?.profile?.metadata?.picture?.split(
                    "ipfs://"
                  )?.[1]
                }`}
                onError={(e) => handleImageError(e)}
                layout="fill"
                alt="pfp"
                className="rounded-full flex"
                draggable={false}
              />
            )}
          </div>
          <div
            className={`relative w-fit h-fit font-geom text-pesa ${
              mainPage ? "text-xs" : "text-sm sm:text-xs lg:text-sm"
            }`}
          >
            {context?.lensConectado?.profile?.username?.localName || ""}
          </div>
        </div>
      ) : (
        <div
          className={`relative h-12 font-geom text-white flex flex-row items-center px-2 cursor-pointer ${
            isConnected && !mainPage && "bg-lensLight/70"
          } ${
            mainPage
              ? "gap-1 w-40"
              : "border-white border rounded-tl-lg rounded-br-lg w-full sm:w-40 lg:w-full"
          }`}
          onClick={() =>
            !isConnected
              ? chainId !== 232
                ? openSwitchNetworks?.()
                : openOnboarding?.()
              : context?.lensConectado?.profile
              ? openProfile?.()
              : !lensCargando && handleConectarse()
          }
        >
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              mainPage && "text-xs"
            }`}
          >
            {isConnected ? dict?.soc : dict?.con}
          </div>
          <div
            className={`relative justify-end flex ${
              mainPage ? "w-6 h-4" : "w-8 h-6"
            }`}
          >
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmSsD6iPFKafxKTE349DPoULssBnfZqbY7DuriT85UbMAv`}
              layout="fill"
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Auth;
