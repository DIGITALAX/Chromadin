import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { ImageViewerProps } from "../types/modals.types";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";

const ImageViewerModal: FunctionComponent<ImageViewerProps> = ({
  dispatch,
  image,
  type,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() =>
          dispatch(
            setImageViewer({
              actionType: "",
              actionValue: false,
              actionImage: "",
            })
          )
        }
      >
        <div className="relative w-full h-screen grid grid-flow-row auto-rows-auto py-8">
          <div className="relative w-4/5 h-full row-start-1 grid grid-flow-col auto-cols-auto place-self-center px-4">
            {type === "image/png" ||
            type === "image/gif" ||
            type === "image/webp" ||
            type === "image/jpeg" ||
            type === "image/jpg" ||
            (!type?.includes("video") && !type?.includes("audio")) ? (
              <Image
                src={image}
                layout="fill"
                objectFit="contain"
                draggable={false}
              />
            ) : type?.includes("audio") ? (
              <audio
                muted
                controls
                className="rounded-md absolute w-full h-full object-cover"
              >
                <source src={image} />
              </audio>
            ) : image.includes("index") ? (
              <div className="rounded-md absolute w-full h-full object-cover">
                <video
                  className="rounded-md w-full h-full object-cover relative"
                  controls={true}
                  muted={true}
                  playsInline
                  loop
                >
                  <source src={image} />
                </video>
              </div>
            ) : (
              <video
                muted
                controls
                className="rounded-md absolute w-full h-full object-cover"
              >
                <source src={image} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageViewerModal;
