import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/interactions.types";
import Purchase from "./Purchase";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  baseColor,
  selectSize,
  setBaseColor,
  setSelectSize,
  currency,
  setCurrency,
  posterSize,
  stickerPack,
  setPosterSize,
  setStickerPack,
  posterAmount,
  setPosterAmount,
  totalAmount,
  acceptedtokens,
  approved,
  mainNFT,
  approveSpend,
  buyNFT,
  purchaseLoading,
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
      <div className="relative w-full h-fit flex flex-col overflow-y-scroll py-4 items-center justify-center gap-3">
        <div className="relative w-full h-full text-center items-start font-earl text-moda text-lg p-3 flex justify-center">
          This NFT unlocks IRL fulfillment with token gated creator posts
          incoming.
        </div>
        <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-xl flex text-center">
          {mainNFT?.name}
        </div>
        <div className="relative w-full preG:w-1/2 lg:w-full h-fit items-center justify-center text-white font-earl text-xs flex text-center px-3">
          {mainNFT?.description}
        </div>
        <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
          {Number(mainNFT?.tokenIds?.length) -
            (mainNFT?.tokensSold?.length
              ? mainNFT?.tokensSold?.length
              : 0)}{" "}
          / {Number(mainNFT?.tokenIds?.length)}
        </div>
        <Purchase
          acceptedtokens={acceptedtokens}
          approved={approved}
          currency={currency}
          setCurrency={setCurrency}
          totalAmount={totalAmount}
          mainNFT={mainNFT}
          approveSpend={approveSpend}
          buyNFT={buyNFT}
          purchaseLoading={purchaseLoading}
        />
      </div>

      {/* <div className="relative w-full h-fit flex flex-row items-center justify-center gap-6">
        {Array.from([
          ["QmY68nkuFyZdDbYzKZD2hLMNkHTq9o8jAzq8tjWeZWACdZ", "poster"],
          ["QmSDRK7jnqLpb2bedHGoGnB8r8rBd9YX4JPwU5GjGRne36", "ropa"],
          ["QmVrEVZqbtqDbFbrjbq5a7fvMmmWAa5qWeXncLNj2Pg6aQ", "sticker"],
        ]).map((value: string[], index: number) => {
          return (
            <div
              key={index}
              onClick={() => dispatch(setProductType(value[1]))}
              className="relative grid grid-flow-col auto-cols-auto justify-self-center items-center rounded-md w-16 h-16 p-2 cursor-pointer active:scale-95"
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmezRhhwr716m31BkpQ8BprvXgHMrCkcKaKH45CLrKHxFT`}
                layout="fill"
                alt="box"
                draggable={false}
              />
              <div className="relative w-8 h-8 flex place-self-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                  layout="fill"
                  className="flex"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}
      </div> */}
      {/* <div className="relative w-full h-fit flex items-center justify-center">
        <IRLOptions
          baseColor={baseColor}
          selectSize={selectSize}
          setBaseColor={setBaseColor}
          setSelectSize={setSelectSize}
          posterSize={posterSize}
          stickerPack={stickerPack}
          setPosterSize={setPosterSize}
          setStickerPack={setStickerPack}
          setPosterAmount={setPosterAmount}
          posterAmount={posterAmount}
        />
      </div> */}
      {/* <div className="relative w-full h-fit flex flex-col gap-2 p-3 xl:pb-3 pb-4">
        <div className="relative w-full h-fit flex flex-col gap-2">
          <input
            disabled
            className="relative bg-offBlack/40 font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={"Call Sign"}
          />
          <input
            disabled
            className="relative bg-offBlack/40 font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={"Shipping Address"}
          />
        </div>
        <div className="relative w-full h-fit flex flex-row gap-2">
          <input
            disabled
            className="relative bg-offBlack/40 font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={"Postal Code"}
          />
          <input
            disabled
            className="relative bg-offBlack/40 font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={"State"}
          />
        </div>
      </div> */}
    </div>
  );
};

export default Fulfillment;
