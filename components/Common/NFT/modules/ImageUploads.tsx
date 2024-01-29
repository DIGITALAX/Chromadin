import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { RiCloseCircleFill } from "react-icons/ri";
import { ImageUploadsProps } from "../types/nft.types";
import { setPostCollectGif } from "@/redux/reducers/postCollectGifSlice";

const ImageUploads: FunctionComponent<ImageUploadsProps> = ({
  id,
  commentLoading,
  postCollectGif,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
      <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
        {postCollectGif?.media?.[id]?.map(
          (media: UploadedMedia, indexTwo: number) => {
            return (
              <div
                key={indexTwo}
                className={`relative w-12 h-12 border-2 border-black rounded-lg bg-spots flex flex-col gap-1.5`}
              >
                <div className="relative w-full h-full flex col-start-1 grid grid-flow-col auto-cols-auto">
                  {media.media &&
                    (media.type !== MediaType.Video ? (
                      <Image
                        src={media.media}
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
                        <source src={media.media} type="video/mp4" />
                      </video>
                    ))}
                  <div
                    className={`relative w-fit h-fit col-start-1 justify-self-end self-start p-px ${
                      !commentLoading && "cursor-pointer active:scale-95"
                    }`}
                    onClick={() => {
                      if (!commentLoading) {
                        const medias = { ...postCollectGif?.media };
                        medias[id] = medias[id]?.filter(
                          (item) => item?.media !== media?.media
                        );

                        dispatch(
                          setPostCollectGif({
                            actionType: postCollectGif?.type,
                            actionId: postCollectGif?.id,
                            actionCollectTypes: postCollectGif?.type,
                            actionMedia: medias,
                          })
                        );
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
