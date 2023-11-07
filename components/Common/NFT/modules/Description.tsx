import { FunctionComponent } from "react";
import { DescriptionProps } from "../types/nft.types";

const Description: FunctionComponent<DescriptionProps> = ({
  mainNFT,
  collectionsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col bg-black p-2 gap-1">
      <div className="relative w-full h-fit text-verde font-geom uppercase text-xl">
        {collectionsLoading ? "7zXj@tE$vU^%" : mainNFT?.name}
      </div>
      <div className="relative w-full h-fit text-white font-geom text-lg">
        {collectionsLoading ? "h&Jg3k^qaS" : mainNFT?.drop.name}
      </div>
      <div className="relative w-full h-fit text-white font-digi text-base pt-4 overflow-y-scroll">
        {collectionsLoading
          ? "dP4f#hL mN ! oRb I7zXj@ tE$vU ^%cT&yAw K8pSx ^+eB t8g# sL%k^y *JH!l Pn&bQ@ fZm$x^a E#sGp+D ^jKd! rTbo PcMv^ &fN"
          : mainNFT?.description}
      </div>
    </div>
  );
};

export default Description;
