import { FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { IRLOptionsProps } from "../types/interactions.types";

const IRLOptions: FunctionComponent<IRLOptionsProps> = ({
  baseColor,
  selectSize,
  setBaseColor,
  setSelectSize,
  posterSize,
  stickerPack,
  setPosterSize,
  setStickerPack,
  posterAmount,
  setPosterAmount
}): JSX.Element => {
  const action = useSelector(
    (state: RootState) => state.app.productTypeReducer.value
  );
  switch (action) {
    case "poster":
      return (
        <div className="relative w-full h-full flex flex-row">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["10", "50", "100", "500"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-5 h-5 text-xxs text-white items-center justify-center cursor-pointer font-geom flex ${
                      posterAmount === index
                        ? "border-ama border-2"
                        : "border-white border "
                    }`}
                    key={index}
                    onClick={() => setPosterAmount(index)}
                  >
                    {item}
                  </div>
                );
              }
            )}
          </div>
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["18x24", "24x36", "48x72"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-fit h-5 px-px text-xxs text-white items-center justify-center cursor-pointer font-geom flex ${
                      posterSize === index
                        ? "border-ama border-2"
                        : "border-white border "
                    }`}
                    key={index}
                    onClick={() => setPosterSize(index)}
                  >
                    {item}
                  </div>
                );
              }
            )}
          </div>
        </div>
      );

    case "sticker":
      return (
        <div className="relative w-full h-full flex flex-row">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["3", "12", "24"]).map((item: any, index: number) => {
              return (
                <div
                  className={`relative w-5 h-5 text-xxs text-white items-center justify-center cursor-pointer font-geom flex ${
                    stickerPack === index
                      ? "border-ama border-2"
                      : "border-white border "
                  }`}
                  key={index}
                  onClick={() => setStickerPack(index)}
                >
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      );

    default:
      return (
        <div className="relative w-full h-fit flex flex-row">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["xs", "s", "m", "l", "xl"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-5 h-5 text-xxs text-white items-center justify-center cursor-pointer font-geom flex ${
                      selectSize === index
                        ? "border-ama border-2"
                        : "border-white border "
                    }`}
                    key={index}
                    onClick={() => setSelectSize(index)}
                  >
                    {item}
                  </div>
                );
              }
            )}
          </div>
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["#131313", "#0D3DFF", "#DD3950", "#FFFFF2"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-5 h-5 text-xxs text-white items-center justify-center font-geom flex cursor-pointer ${
                      baseColor === index
                        ? "border-ama border-2"
                        : "border-white border"
                    }`}
                    key={index}
                    id={`base${index}`}
                    onClick={() => setBaseColor(index)}
                  ></div>
                );
              }
            )}
          </div>
        </div>
      );
  }
};

export default IRLOptions;
