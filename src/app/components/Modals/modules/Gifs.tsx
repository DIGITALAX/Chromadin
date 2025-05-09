import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import useGifs from "../hooks/useGifs";
import { MediaImageMimeType } from "@lens-protocol/metadata";

export const Gifs: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const { buscarGifs, setBuscarGifs, gifCargando, manejarGif } = useGifs();
  return (
    <div
      className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        contexto?.setGif({
          open: false,
        });
      }}
    >
      <div
        className="relative flex w-fit h-fit overflow-y-scroll place-self-center bg-offBlack cursor-default rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative w-[90vw] sm:w-[70vw] half:w-[60vw] min-w-fit md:w-[40vw] lg:w-[40vw] max-h-[60vh] overflow-y-scroll h-fit flex items-center justify-center"
          id="boxBg"
        >
          <div
            className={`flex flex-col items-center py-10 px-4 gap-5 text-white font-arcade relative w-full lg:w-[75%] h-[80%] lg:h-[65%] justify-start flex overflow-y-scroll sm:text-base text-xs`}
          >
            <div
              className={`relative rounded-md flex flex-col gap-5 w-full lg:w-5/6 p-2 items-start justify-start max-h-fit`}
            >
              <div className="relative w-full h-fit flex flex-col sm:flex-row items-center sm:items-start text-white justify-center sm:justify-between text-xs rounded-md gap-2">
                <input
                  className="relative w-full h-10 py-px px-1 border border-white rounded-md bg-black"
                  placeholder={dict?.Common?.buscarGif}
                  onChange={(e) =>
                    setBuscarGifs((prev) => ({
                      ...prev,
                      search: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    e.key === "Enter" &&
                      buscarGifs?.search?.trim() !== "" &&
                      !gifCargando &&
                      manejarGif(buscarGifs?.search);
                  }}
                />
                <div
                  className={`w-16 px-2 py-1 border rounded-md text-xs border-white h-10 border bg-black flex items-center justify-center ${
                    !gifCargando && "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    buscarGifs?.search?.trim() !== "" &&
                    manejarGif(buscarGifs?.search)
                  }
                >
                  <div
                    className={`${
                      gifCargando && "animate-spin"
                    } relative w-fit h-fit flex items-center justify-center`}
                  >
                    {gifCargando ? (
                      <AiOutlineLoading size={10} color="white" />
                    ) : (
                      dict?.Common?.buscar
                    )}
                  </div>
                </div>
              </div>
              <div className="relative flex items-start justify-center overflow-y-scroll w-full h-[20rem]">
                <div className="flex flex-wrap items-start justify-center gap-3 w-fit h-fit">
                  {buscarGifs.gifs?.map((gif: any, indiceDos: number) => {
                    return (
                      <div
                        key={indiceDos}
                        onClick={() => {
                          contexto?.setPostInfo((prev) => {
                            let media = { ...prev?.media };

                            if (
                              Number(
                                contexto?.postInfo?.media?.[contexto?.gif?.id!]
                                  ?.length
                              ) == 4
                            ) {
                              let medios = [
                                ...(contexto?.postInfo?.media?.[
                                  contexto?.gif?.id!
                                ] || []),
                              ];

                              medios.pop();

                              medios.push({
                                type: MediaImageMimeType.GIF,
                                item: gif?.media_formats?.gif?.url,
                              });

                              media[contexto?.gif?.id!] = medios;
                            } else {
                              let medios = [
                                ...(contexto?.postInfo?.media?.[
                                  contexto?.gif?.id!
                                ] || []),
                              ];
                              medios.push({
                                type: MediaImageMimeType.GIF,
                                item: gif?.media_formats?.gif?.url,
                              });

                              media[contexto?.gif?.id!] = medios;
                            }

                            return {
                              ...prev,
                              media,
                            };
                          });
                          contexto?.setGif({
                            open: false,
                          });
                        }}
                        className="relative w-20 h-20 rounded-md flex items-center justify-center cursor-pointer hover:opacity-70 bg-white"
                      >
                        <Image
                          layout="fill"
                          objectFit="cover"
                          className="rounded-md"
                          src={gif?.media_formats?.gif?.url}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gifs;
