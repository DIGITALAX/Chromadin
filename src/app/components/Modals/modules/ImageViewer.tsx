import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";

const ImageViewer: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() => context?.setVerImagen(undefined)}
      >
        <div className="relative w-full h-screen grid grid-flow-row auto-rows-auto py-8">
          <div className="relative w-4/5 h-full row-start-1 grid grid-flow-col auto-cols-auto place-self-center px-4">
            {context?.verImagen?.type === "image/png" ||
            context?.verImagen?.type === "image/gif" ||
            context?.verImagen?.type === "image/webp" ||
            context?.verImagen?.type === "image/jpeg" ||
            context?.verImagen?.type === "image/jpg" ||
            (!context?.verImagen?.type?.includes("video") &&
              !context?.verImagen?.type?.includes("audio")) ? (
              <Image
                src={context?.verImagen?.item!}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            ) : context?.verImagen?.type?.includes("audio") ? (
              <audio
                muted
                controls
                className="rounded-md absolute w-full h-full object-cover"
              >
                <source src={context?.verImagen?.item} />
              </audio>
            ) : context?.verImagen?.item?.includes("index") ? (
              <div className="rounded-md absolute w-full h-full object-cover">
                <video
                  className="rounded-md w-full h-full object-cover relative"
                  controls={true}
                  muted={true}
                  playsInline
                  loop
                >
                  <source src={context?.verImagen?.item} />
                </video>
              </div>
            ) : (
              <video
                muted
                controls
                className="rounded-md absolute w-full h-full object-cover"
              >
                <source src={context?.verImagen?.item} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
