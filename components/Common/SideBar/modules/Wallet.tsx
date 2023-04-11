import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { WalletProps } from "../types/sidebar.types";

const Wallet: FunctionComponent<WalletProps> = ({
  handleTransaction,
  isConnected,
  buttonText,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full sm:w-40 lg:w-full h-12 font-geom text-white border-white border rounded-tl-lg rounded-br-lg flex flex-row items-center px-2 cursor-pointer ${
        isConnected && "bg-lensLight/70"
      }`}
      onClick={() => handleTransaction()}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {buttonText}
      </div>
      <div className="relative justify-end w-8 h-6 flex">
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
