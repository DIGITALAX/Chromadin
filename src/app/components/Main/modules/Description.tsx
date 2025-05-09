import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";

const Description: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-full flex flex-col bg-black p-2 gap-1">
      <div className="relative w-full h-fit text-verde font-geom uppercase text-xl break-all">
        {!context?.collectionInfo?.main
          ? "7zXj@tE$vU^%"
          : context?.collectionInfo?.main?.metadata?.title}
      </div>
      <div className="relative w-full h-fit text-white font-geom text-lg break-all">
        {!context?.collectionInfo?.main
          ? "h&Jg3k^qaS"
          : context?.collectionInfo?.main?.drop?.metadata?.title}
      </div>
      <div className="relative w-full h-fit text-white font-digi text-base pt-4 overflow-y-scroll break-all">
        {!context?.collectionInfo?.main
          ? "dP4f#hL mN ! oRb I7zXj@ tE$vU ^%cT&yAw K8pSx ^+eB t8g# sL%k^y *JH!l Pn&bQ@ fZm$x^a E#sGp+D ^jKd! rTbo PcMv^ &fN"
          : context?.collectionInfo?.main?.metadata?.description}
      </div>
    </div>
  );
};

export default Description;
