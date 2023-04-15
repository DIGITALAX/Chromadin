import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MainDropProps } from "../types/nft.types";

const MainDrop: FunctionComponent<MainDropProps> = ({
  mainNFT,
  collectionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-96 sm:h-full flex">
      <div className="relative w-full h-full flex" id="vending">
        {mainNFT?.media && (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${mainNFT?.media}`}
            alt="nft"
            objectFit="cover"
            layout="fill"
            draggable={false}
            objectPosition="top"
          />
        )}
      </div>
      <div className="absolute bottom-0 w-full h-fit flex flex-row p-1 gap-2 items-center">
        <div
          className="relative w-6 h-6 rounded-full border-white border"
          id="crt"
        >
          {mainNFT?.creator?.media && (
            <Image
              src={mainNFT?.creator?.media}
              layout="fill"
              alt="pfp"
              className="flex rounded-full w-full h-full"
              draggable={false}
            />
          )}
        </div>
        <div className="relative w-full h-fit flex flex-col">
          <div className="relative w-full h-fit flex justify-start">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmWTqEMUT7gFC76t8FBHRUQZDWbdwwnPKXFzutGf2uc6sx`}
              width={130}
              height={30}
              alt="playing"
              className="flex"
              draggable={false}
            />
          </div>
          <div
            className="relative text-pesa text-sm font-geom capitalize flex"
            id="glow"
          >
            {collectionsLoading ? "7zXj@tE$vU^%" : mainNFT?.name}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDrop;
