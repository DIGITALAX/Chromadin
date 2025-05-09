import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { ImageUploadsProps } from "../types/main.types";
import { MediaImageMimeType, MediaVideoMimeType } from "@lens-protocol/metadata";
import { ModalContext } from "@/app/providers";

const ImageUploads: FunctionComponent<ImageUploadsProps> = ({
  id,
  commentLoading,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
      <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
        {context?.postInfo?.media?.[id]?.map(
          (
            media: { type: MediaImageMimeType | MediaVideoMimeType; item: string },
            indexTwo: number
          ) => {
            return (
              <div
                key={indexTwo}
                className={`relative w-12 h-12 border-2 border-black rounded-lg bg-spots flex flex-col gap-1.5`}
              >
                <div className="relative w-full h-full flex col-start-1 grid grid-flow-col auto-cols-auto">
                  {media.item &&
                    (media.type !== "video/mp4" ? (
                      <Image
                        src={media.item}
                        layout="fill"
                        objectFit="cover"
                        objectPosition={"center"}
                        className="rounded-md absolute"
                        draggable={false}
                      />
                    ) : (
                      <video
                        muted
                        playsInline
                        autoPlay
                        controls
                        className="rounded-md absolute w-full h-full object-cover"
                      >
                        <source src={media.item} type="video/mp4" />
                      </video>
                    ))}
                  <div
                    className={`relative w-fit h-fit col-start-1 justify-self-end self-start p-px ${
                      !commentLoading && "cursor-pointer active:scale-95"
                    }`}
                    onClick={() => {
                      if (!commentLoading) {
                        const medias = { ...context?.postInfo?.media };
                        medias[id] = medias[id]?.filter(
                          (item) => item?.item !== media?.item
                        );

                        context.setPostInfo((prev) => ({
                          ...prev,
                          media: medias,
                        }));
                      }
                    }}
                  >
                    <RiCloseCircleFill color="white" size={28} />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ImageUploads;
