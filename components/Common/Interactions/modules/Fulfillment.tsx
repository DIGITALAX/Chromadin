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
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center bg-black border-t border-white gap-3 py-2">
      <div className="relative w-full h-full text-center items-center font-earl text-moda text-sm p-3">
        Drop fulfillment that’s IRL & decentralized, too?
        <br />
        <br />
        Tune in to find out what      <br />it’s all about.
      </div>
      <div className="relative w-full h-fit flex flex-row items-center justify-center gap-3">
        {Array.from([
          ["QmUS9F3bn38r9w3qCVAyupV2R6xxHC9AngESS6ExzJ5ZXn", "poster"],
          ["Qmf642iVLdGWq2MZK4XRPghX5mVhxG4zamcRYhXCvCSMXt", "ropa"],
          ["QmecMYHmfUd98HM1AF8wvA3S2aC3A5jEZAPbkUuG3qGHuU", "sticker"],
        ]).map((value: string[], index: number) => {
          return (
            <div
              key={index}
              onClick={() => dispatch(setProductType(value[1]))}
              className="relative flex border border-white rounded-md w-fit h-fit p-2 cursor-pointer active:scale-95"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
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
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-lg border border-white px-2 text-sm"
            value={"Call Sign"}
          />
          <input
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-lg border border-white px-2 text-sm"
            value={"Shipping Address"}
          />
        </div>
        <div className="relative w-full h-fit flex flex-row gap-2">
          <input
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-lg border border-white px-2 text-sm"
            value={"Postal Code"}
          />
          <input
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-lg border border-white px-2 text-sm"
            value={"State"}
          />
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2">
        {Array.from([
          "QmNuKXSvm8WyaF5ktxYkYhmzT6b6RspkFqzGrzy5eaLS3E",
          "QmUS79NjibxQzHZkcau85XWff7RzsPu7Vk4bTRbJMjXgfG",
          "QmPsjBjAgggZTouEuGBhJs6i7CbQWjzeYyRQeCWwJKaVjP",
          "Qmcnp3D8ScKb68LaWyHUV6DbzqSw2dAVgeyfZSFVc76Gqd",
        ]).map((item: string, index: number) => {
          return (
            <div
              className={`relative w-7 h-7 rounded-full flex items-center cursor-pointer active:scale-95 ${
                currency === index
                  ? "border-ama border-2"
                  : "border-white border "
              }`}
              key={index}
              onClick={() => setCurrency(index)}
            >
              <Image
                layout="fill"
                objectFit="cover"
                src={`${INFURA_GATEWAY}/ipfs/${item}`}
                className="flex"
                draggable={false}
              />
            </div>
          );
        })}
      </div>
      <div className="relative w-full h-fit font-geom text-white text-xs items-center justify-center flex">
        Total: $
      </div>
      <div className="relative w-full h-fit font-geom items-center justify-center flex text-xxs xl:pb-0 pb-8">
        <div className="relative rounded-lg p-1.5 w-14 text-center h-fit border-white border bg-verde/60 text-white cursor-pointer hover:bg-moda">
          Buy
        </div>
      </div>
    </div>
  );
};

export default Fulfillment;
