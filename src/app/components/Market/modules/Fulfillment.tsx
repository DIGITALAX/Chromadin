import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import Purchase from "./Purchase";

const Fulfillment: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-[45.8rem] flex items-start justify-center bg-black border-t border-white">
      <div className="absolute w-full h-full justify-stretch flex">
        <Image
          src={`${INFURA_GATEWAY_INTERNAL}QmUFwK9nUrUnAoVm3fhbw2XqtUAdzz2js8ju7LjdGXVQe5`}
          layout="fill"
          draggable={false}
          objectFit="cover"
        />
      </div>
      {context?.collectionInfo?.main && (
        <div className="relative w-full h-fit flex flex-col overflow-y-scroll py-4 items-center justify-center gap-3">
          <div className="relative w-full h-full text-center items-start font-earl text-moda text-lg p-3 flex justify-center flex-row gap-1">
            <div
              className="relative w-fit h-fit cursor-pointer flex justify-center items-start"
              onClick={() => window.open("https://coinop.themanufactory.xyz/")}
            >
              {dict?.Common?.mint}
            </div>
          </div>
          <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-xl flex text-center px-3 break-all">
            {context?.collectionInfo?.main?.metadata?.title}
          </div>
          <div className="relative w-full preG:w-1/2 lg:w-full h-fit items-center justify-center text-white font-earl text-xs flex text-center px-3 break-all">
            {context?.collectionInfo?.main?.metadata?.description}
          </div>
          <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
            {Number(context?.collectionInfo?.main?.tokenIdsMinted?.length) === Number(context?.collectionInfo?.main?.amount)
              ? dict?.Common?.sold
              : `${Number(context?.collectionInfo?.main?.tokenIdsMinted?.length || 0)} /
                  ${Number(context?.collectionInfo?.main?.amount)}`}
          </div>
          <Purchase dict={dict} />
        </div>
      )}
    </div>
  );
};

export default Fulfillment;
