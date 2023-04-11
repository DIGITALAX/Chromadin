import { FunctionComponent } from "react";
import { DescriptionProps } from "../types/nft.types";

const Description: FunctionComponent<DescriptionProps> = ({
  mainNFT,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col bg-black p-2 gap-1">
      <div className="relative w-full h-fit text-verde font-geom uppercase text-xl">
        {mainNFT?.name}
      </div>
      <div className="relative w-full h-fit text-white font-geom text-lg">
        {mainNFT?.drop.name}
      </div>
      <div className="relative w-full h-fit text-white font-digi text-base pt-4 overflow-y-scroll">
        {mainNFT?.description}
      </div>
    </div>
  );
};

export default Description;
