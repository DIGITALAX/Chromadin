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
  setPosterAmount,
}): JSX.Element => {
  const action = useSelector(
    (state: RootState) => state.app.productTypeReducer.value
  );
  switch (action) {
    case "poster":
      return (
        <div className="relative w-full h-full flex flex-col font-earl gap-3">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["1", "10", "25"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-8 h-8 px-px text-sm text-white items-center justify-center cursor-pointer flex ${
                      posterAmount === index
                        ? "border-ama/40 border-2 rounded-tl-lg rounded-br-lg"
                        : "border-white/30 border rounded-tl-lg rounded-br-lg"
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
                    className={`relative w-fit h-8 px-1 text-sm text-white items-center justify-center cursor-pointer flex ${
                      posterSize === index
                        ? "border-ama/40 border-2 rounded-tl-lg rounded-br-lg"
                        : "border-white/30 border rounded-tl-lg rounded-br-lg"
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
        <div className="relative w-full h-full flex flex-row font-earl">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["3", "12", "24"]).map((item: any, index: number) => {
              return (
                <div
                  className={`relative w-8 h-8 text-sm uppercase px-px text-white items-center justify-center cursor-pointer flex ${
                    stickerPack === index
                      ? "border-ama/40 border-2 rounded-tl-lg rounded-br-lg"
                      : "border-white/30 border rounded-tl-lg rounded-br-lg"
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
        <div className="relative w-full h-fit flex flex-col font-earl gap-3">
          <div className="relative w-full h-full flex flex-row items-center justify-center gap-1">
            {Array.from(["xs", "s", "m", "l", "xl"]).map(
              (item: any, index: number) => {
                return (
                  <div
                    className={`relative w-8 h-8 text-sm text-white items-center justify-center cursor-pointer uppercase flex ${
                      selectSize === index
                        ? "border-ama/40 border-2 rounded-tl-lg rounded-br-lg"
                        : "border-white/30 border rounded-tl-lg rounded-br-lg"
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
                    className={`relative w-8 h-8 text-sm text-white items-center justify-center flex cursor-pointer ${
                      baseColor === index
                        ? "border-ama/40 border-2 rounded-tl-lg rounded-br-lg"
                        : "border-white/30 border rounded-tl-lg rounded-br-lg"
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
