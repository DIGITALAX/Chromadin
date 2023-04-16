import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { ImageLargeProps } from "../types/modals.types";
import { INFURA_GATEWAY } from "@/lib/constants";

const ImageLarge: FunctionComponent<ImageLargeProps> = ({
  mainImage,
}): JSX.Element => {
  const dispatch = useDispatch();
  return (
    <div className="inset-0 justify-center fixed z-30 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div
        className="relative w-screen h-full col-start-1 justify-self-center grid grid-flow-col auto-cols-auto self-start cursor-pointer"
        onClick={() => dispatch(setImageViewer(false))}
      >
        <div className="relative w-full h-screen grid grid-flow-row auto-rows-auto py-8">
          <div className="relative w-full h-full row-start-1 grid grid-flow-col auto-cols-auto px-4">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${mainImage}`}
              layout="fill"
              objectFit="contain"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageLarge;
