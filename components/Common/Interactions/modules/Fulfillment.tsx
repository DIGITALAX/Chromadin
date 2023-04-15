import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import IRLOptions from "./IRLOptions";
import { setProductType } from "@/redux/reducers/productTypeSlice";
import { useDispatch } from "react-redux";
import { FulfillmentProps } from "../types/interactions.types";

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
  acceptedtokens
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center bg-black border-t border-white gap-3">
      <div className="absolute w-full h-full justify-stretch flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUFwK9nUrUnAoVm3fhbw2XqtUAdzz2js8ju7LjdGXVQe5`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="relative w-full h-full text-center items-center font-earl text-moda text-lg p-3">
        Drop fulfillment that’s IRL & decentralized, too?
        <br />
        <br />
        Tune in to find out what <br />
        it’s all about.
      </div>
      <div className="relative w-full h-fit flex flex-row items-center justify-center gap-6">
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
      </div>
      <div className="relative w-full h-fit flex items-center justify-center">
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
      </div>
      <div className="relative w-full h-fit flex flex-col gap-2 p-3">
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
      </div>
      <div className="relative w-full h-fit flex flex-row items-center gap-3 pt-4 justify-center px-3">
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
          {Array.from([
            [
              "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
              "MATIC",
              "0x0000000000000000000000000000000000001010",
            ],
            [
              "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
              "WETH",
              "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
            ],
            [
              "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
              "USDT",
              "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            ],
            [
              "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
              "MONA",
              "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
            ],
          ])
            .filter((item) => acceptedtokens.includes(item[2]))
            .map((item: string[], index: number) => {
              return (
                <div
                  className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                    currency === item[1] ? "opacity-50" : "opacity-100"
                  }`}
                  key={index}
                  onClick={() => setCurrency(item[1])}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                    className="flex"
                    draggable={false}
                    width={30}
                    height={35}
                  />
                </div>
              );
            })}
        </div>
        <div className="relative w-1/2 h-fit font-digi text-white text-xs items-center justify-center flex whitespace-nowrap">
          Total: {totalAmount} {currency}
        </div>
      </div>
      <div className="relative w-full h-fit font-earl items-center justify-center flex text-sm xl:pb-32 pb-8 pt-4">
        <div className="relative rounded-lg p-1.5 w-24 text-center h-fit border-white border bg-verde/60 text-white cursor-pointer hover:bg-moda">
          BUY NOW
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
