import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/interactions.types";
import Purchase from "./Purchase";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  currency,
  setCurrency,
  totalAmount,
  approved,
  collectionInfo,
  approveSpend,
  buyNFT,
  purchaseLoading,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full xl:h-[45.8rem] flex items-start justify-center bg-black border-t border-white">
      <div className="absolute w-full h-full justify-stretch flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUFwK9nUrUnAoVm3fhbw2XqtUAdzz2js8ju7LjdGXVQe5`}
          layout="fill"
          draggable={false}
          objectFit="cover"
        />
      </div>
      {collectionInfo?.collections?.length > 0 && (
        <div className="relative w-full h-fit flex flex-col overflow-y-scroll py-4 items-center justify-center gap-3">
          <div className="relative w-full h-full text-center items-start font-earl text-moda text-lg p-3 flex justify-center flex-row gap-1">
            <div
              className="relative w-fit h-fit cursor-pointer flex justify-center items-start"
              onClick={() => window.open("https://coinop.themanufactory.xyz/")}
            >
              This one&apos;s minted, but not yet printed. Level up on Coin Op
              for more immediate fulfillment.
            </div>
          </div>
          <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-xl flex text-center">
            {collectionInfo?.main?.collectionMetadata?.title}
          </div>
          <div className="relative w-full preG:w-1/2 lg:w-full h-fit items-center justify-center text-white font-earl text-xs flex text-center px-3">
            {collectionInfo?.main?.collectionMetadata?.description}
          </div>
          <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
            {Number(collectionInfo?.main?.soldTokens) ===
            Number(collectionInfo?.main?.amount)
              ? "SOLD OUT"
              : `${Number(collectionInfo?.main?.soldTokens)} /
                  ${Number(collectionInfo?.main?.amount)}`}
          </div>
          <Purchase
            approved={approved}
            currency={currency}
            setCurrency={setCurrency}
            totalAmount={totalAmount}
            mainNFT={collectionInfo?.main!}
            approveSpend={approveSpend}
            buyNFT={buyNFT}
            purchaseLoading={purchaseLoading}
            router={router}
          />
        </div>
      )}
    </div>
  );
};

export default Fulfillment;
