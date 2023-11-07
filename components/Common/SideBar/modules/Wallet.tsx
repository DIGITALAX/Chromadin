import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { WalletProps } from "../types/sidebar.types";

const Wallet: FunctionComponent<WalletProps> = ({
  handleTransaction,
  isConnected,
  buttonText,
  mainPage,
}): JSX.Element => {
  return (
    <div
      className={`relative h-12 font-geom text-white flex flex-row items-center px-2 cursor-pointer ${
        isConnected && !mainPage && "bg-lensLight/70"
      } ${
        mainPage
          ? "gap-1 w-40"
          : "border-white border rounded-tl-lg rounded-br-lg w-full sm:w-40 lg:w-full"
      }`}
      onClick={() => handleTransaction()}
    >
      <div
        className={`relative w-full h-full flex items-center justify-center ${
          mainPage && "text-xs"
        }`}
      >
        {buttonText}
      </div>
      <div
        className={`relative justify-end flex ${
          mainPage ? "w-6 h-4" : "w-8 h-6"
        }`}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSsD6iPFKafxKTE349DPoULssBnfZqbY7DuriT85UbMAv`}
          layout="fill"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default Wallet;
