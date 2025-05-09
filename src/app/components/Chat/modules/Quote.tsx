import { FunctionComponent, JSX } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import Image from "next/legacy/image";
import moment from "moment";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import {
  AudioMetadata,
  ImageMetadata,
  MediaAudio,
  MediaImage,
  MediaVideo,
  Post,
  Repost,
  VideoMetadata,
} from "@lens-protocol/client";
import { handleImage } from "@/app/lib/helpers/handleImage";

const Quote: FunctionComponent<{ publication: Post | Repost }> = ({
  publication,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={publication?.id}
      id={publication?.id}
    >
      <div
        className={`relative h-auto rounded-md pr-px py-px w-full sm:w-40 preG:min-w-[7.5rem]`}
        id="sideProfile"
      >
        <div
          className={`relative w-full h-full bg-shame rounded-md flex flex-col items-start sm:items-center py-1.5 px-1 gap-3`}
        >
          <Image
            src={`${INFURA_GATEWAY_INTERNAL}QmSjh6dsibg9yDfBwRfC5YSWFTmwpwPxRDTFG8DzLHzFyB`}
            layout="fill"
            objectFit="cover"
            className="absolute w-full h-full rounded-lg"
            draggable={false}
          />
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
            <div
              className={`w-20 relative h-8 rounded-full flex justify-self-center`}
            >
              <Image
                src={`${INFURA_GATEWAY_INTERNAL}QmfDmMCcgcseCFzGam9DbmDk5sQRbt6zrQVhvj4nTeuLGq`}
                layout="fill"
                alt="backdrop"
                priority
                draggable={false}
                className="rounded-full w-full h-full"
              />
            </div>
            <div
              className={`absolute rounded-full flex bg-white w-8 h-full justify-self-center sm:right-6 col-start-1`}
              id="crt"
            >
              <Image
                src={handleProfilePicture(
                  publication?.author?.metadata?.picture
                )}
                onError={(e) => handleImageError(e)}
                objectFit="cover"
                alt="pfp"
                layout="fill"
                className="relative w-full h-full rounded-full"
                draggable={false}
              />
            </div>
          </div>
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
            <div
              className={`relative w-fit h-fit font-dosis text-xs justify-self-center`}
              id={"username"}
            >
              {publication?.__typename !== "Repost"
                ? Number(publication?.author?.username?.localName?.length) > 25
                  ? publication?.author?.username?.localName?.substring(0, 20) +
                    "..."
                  : publication?.author?.username?.localName
                : Number(
                    publication?.repostOf?.author?.username?.localName?.length
                  ) > 20
                ? publication?.repostOf?.author?.username?.localName?.substring(
                    0,
                    25
                  ) + "..."
                : publication?.repostOf?.author?.username?.localName}
            </div>
          </div>
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
            <div
              className={`relative w-fit h-fit ${
                publication?.author?.username?.localName
                  ? "row-start-2"
                  : "row-start-1"
              } font-clash text-xs justify-self-center text-black`}
            >
              {publication?.author?.username?.value?.length! > 15
                ? publication?.author?.username?.value?.substring(0, 10) + "..."
                : publication?.author?.username?.value}
            </div>
          </div>
          <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto">
            <div
              className={`relative w-fit h-fit text-offBlack font-dosis justify-self-center fo:pb-0 pb-2 text-xs `}
            >
              {moment(`${publication?.timestamp}`).fromNow()}
            </div>
          </div>
        </div>
      </div>
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 preG:p-6 gap-6 border-2  bg-gradient-to-r ${
          (publication as any)?.gated
            ? "from-gray-400 via-gray-600 to-gray-800 border-white"
            : "from-offBlack via-gray-600 to-black border-black"
        }`}
      >
        {(publication as Post)?.commentOn && (
          <div
            className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2`}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
            >
              Comment of{" "}
              {(
                (publication as Post)?.commentOn?.metadata as any
              )?.content?.slice(0, 10) + "..."}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              <FaRegCommentDots color={"red"} size={15} />
            </div>
          </div>
        )}
        <div
          className={`${
            (publication as Post)?.commentOn ? "row-start-2" : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-fit h-fit row-start-1 relative h-fit text-white font-dosis self-center justify-self-start break-all preG:break-words`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  ((publication as Post)?.metadata as any)?.content
                ),
              }}
              className="relative place-self-center whitespace-preline break-all preG:break-words"
            ></div>
          </div>
        </div>
        <div
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            (publication as Post)?.commentOn ? "row-start-3" : "row-start-2"
          }`}
        >
          {[
            (publication?.__typename === "Repost"
              ? publication?.repostOf
              : publication
            )?.metadata?.__typename == "ImageMetadata"
              ? (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as ImageMetadata
                )?.image
              : (publication?.__typename === "Repost"
                  ? publication?.repostOf
                  : publication
                )?.metadata?.__typename == "VideoMetadata"
              ? (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as VideoMetadata
                ).video
              : (
                  (publication?.__typename === "Repost"
                    ? publication?.repostOf
                    : publication
                  )?.metadata as AudioMetadata
                )?.audio,
            ...((
              (publication?.__typename === "Repost"
                ? publication?.repostOf
                : publication
              )?.metadata as ImageMetadata
            )?.attachments || []),
          ]
            ?.filter(Boolean)
            ?.map(
              (item: MediaImage | MediaAudio | MediaVideo, index: number) => {
                const url = handleImage(item?.item);
                return (
                  <div
                    key={index}
                    className={`${
                      item?.__typename !== "MediaAudio"
                        ? "h-40 preG:h-60 border-2 border-black rounded-lg bg-black"
                        : "h-10"
                    } w-40 preG:w-60 relative flex items-center justify-center col-start-${
                      index + 1
                    }`}
                  >
                    <div className="relative w-full h-full col-start-1 flex rounded-md">
                      {item?.__typename === "MediaImage" ? (
                        <Image
                          src={url}
                          layout="fill"
                          objectFit="cover"
                          objectPosition={"center"}
                          className="rounded-md"
                          draggable={false}
                        />
                      ) : item?.__typename == "MediaAudio" ? (
                        <audio
                          muted
                          controls
                          className="rounded-md absolute w-full h-full object-cover"
                        >
                          <source src={url} />
                        </audio>
                      ) : (
                        <video
                          muted
                          controls
                          className="rounded-md absolute w-full h-full object-cover"
                        >
                          <source src={url} />
                        </video>
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Quote;
