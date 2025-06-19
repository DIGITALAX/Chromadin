import Image from "next/legacy/image";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { FunctionComponent, JSX, useContext } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { FeedPublicationProps } from "../types/chat.types";
import Profile from "./Profile";
import {
  AudioMetadata,
  ImageMetadata,
  MediaAudio,
  MediaImage,
  MediaVideo,
  Post,
  VideoMetadata,
} from "@lens-protocol/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { ModalContext } from "@/app/providers";
import Quote from "./Quote";
import { handleImage } from "@/app/lib/helpers/handleImage";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  dict,
  publication,
  height,
  index,
  setOpenComment,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const path = usePathname();
  const context = useContext(ModalContext);
  const search = useSearchParams();
  return (
    <div
      className={`relative w-full ${
        height ? "h-full" : "h-fit"
      } flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={publication?.id}
      id={publication?.id}
    >
      <Profile
        dict={dict}
        post={publication}
        setOpenComment={setOpenComment}
        index={index}
        disabled={disabled}
      />
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 preG:p-6 gap-6 border-2 bg-gradient-to-r from-offBlack via-gray-600 to-black border-black`}
      >
        {(publication?.__typename === "Repost" ||
          publication?.commentOn ||
          publication?.quoteOf) && (
          <div
            className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 ${
              (publication as Post)?.commentOn && "cursor-pointer"
            }`}
            onClick={() => {
              if ((publication as Post)?.commentOn) {
                const params = new URLSearchParams(search.toString());

                params.set("post", (publication as Post)?.commentOn?.id!);
                if (!params.has("option")) {
                  params.set("option", "history");
                }

                router.replace(`${path}?${params.toString()}`);
              }
            }}
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
            >
              {publication?.__typename === "Repost"
                ? `${dict?.mirrored} ${publication?.author?.username?.localName}`
                : (publication as Post)?.quoteOf
                ? `${dict?.quoted} ${
                    (
                      (publication as Post)?.quoteOf?.metadata as any
                    )?.content?.slice(0, 10) + "..."
                  }`
                : `${dict?.commented} ${
                    (
                      (publication as Post)?.commentOn?.metadata as any
                    )?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              {publication?.__typename === "Repost" ? (
                <AiOutlineRetweet color={"red"} size={15} />
              ) : (
                <FaRegCommentDots color={"red"} size={15} />
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            publication?.__typename === "Repost" ||
            (publication as Post)?.commentOn ||
            (publication as Post)?.quoteOf
              ? "row-start-2"
              : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-fit h-fit row-start-1 relative h-fit text-white font-dosis self-center justify-self-start break-all preG:break-words`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  publication?.__typename !== "Repost"
                    ? ((publication as Post)?.metadata as any)?.content
                    : (publication?.repostOf?.metadata as any)?.content
                ),
              }}
              className="relative place-self-center whitespace-preline break-all preG:break-words"
            ></div>
          </div>
        </div>
        <div
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            publication?.__typename === "Repost" ||
            (publication as Post)?.commentOn ||
            (publication as Post)?.quoteOf
              ? "row-start-3"
              : "row-start-2"
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
              (item: MediaAudio | MediaVideo | MediaImage, index: number) => {
                const url = handleImage(item?.item);
                return (
                  <div
                    key={index}
                    className={`${
                      item?.__typename !== "MediaAudio"
                        ? "h-40 preG:h-60 border-2 border-black rounded-lg bg-black"
                        : "h-10"
                    } cursor-pointer w-40 preG:w-60 relative flex items-center justify-center col-start-${
                      index + 1
                    } ${
                      item?.__typename !== "MediaImage" &&
                      "cursor-pointer hover:opacity-70 active:scale-95"
                    } `}
                    onClick={() =>
                      context?.setVerImagen({
                        item: url,
                        type:
                          item.__typename === "MediaImage"
                            ? "image/png"
                            : "video/png",
                      })
                    }
                  >
                    <div className="relative w-full h-full flex rounded-md items-center justify-center">
                      {item?.__typename == "MediaImage" ? (
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
        <div
          className={`relative w-full h-fit ${
            publication?.__typename === "Repost" ||
            (publication as Post)?.commentOn ||
            (publication as Post)?.quoteOf
              ? "row-start-4"
              : "row-start-3"
          } grid grid-flow-col auto-cols-auto justify-end items-end`}
        >
          {(publication?.__typename !== "Repost"
            ? publication?.id
            : publication?.repostOf.id) && (
            <div
              className={`relative w-fit h-full col-start-1 row-start-1 sm:col-start-2 sm:pt-0 pt-3  grid grid-flow-col auto-cols-auto font-digi gap-1 cursor-pointer justify-self-end self-end hover:opacity-70 active:scale-95 text-white`}
              onClick={() => {
                const params = new URLSearchParams(search?.toString());

                params.set(
                  "post",
                  publication?.__typename !== "Repost"
                    ? publication?.id
                    : publication?.repostOf?.id
                );

                if (!params?.get("options")) {
                  params.set("options", "history");
                }

                router.replace(`${path}?${params?.toString()}`);
              }}
            >
              <div className="relative w-fit h-fit flex  self-center  text-sm">
                {!(publication as Post)?.commentOn
                  ? dict?.pos
                  : dict?.com}
              </div>
              <div className={`relative w-fit h-fit self-center flex`}>
                <AiFillEye color={"white"} size={20} />
              </div>
            </div>
          )}
        </div>
        {(publication as Post)?.quoteOf && (
          <div
            className="relative w-full h-fit px-3 py-1 flex items-start justify-center"
            id="fadedQuote"
          >
            <div
              className="relative w-full h-fit p-2 flex items-center justify-start flex-col from-gray-400 via-gray-600 to-gray-800 bg-gradient-to-r rounded-md gap-5"
              onClick={() => {
                const params = new URLSearchParams(search?.toString());

                if (search.get("post")) {
                  params.set("post", (publication as Post)?.quoteOf?.id!);
                } else {
                  params.append("post", (publication as Post)?.quoteOf?.id!);
                }

                if (!search.get("option")) {
                  params.set("option", "history");
                }

                router.replace(`${path}?${params?.toString()}`);
              }}
            >
              <div className="relative w-full h-fit flex items-end justify-end">
                <div
                  className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 cursor-pointer`}
                >
                  <div
                    className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
                  >
                    {dict?.quoted}{" "}
                    {(
                      (publication as Post)?.quoteOf?.metadata as any
                    )?.content?.slice(0, 10) + "..."}
                  </div>
                  <div className="relative w-fit h-fit col-start-2 place-self-center">
                    <AiOutlineRetweet color={"white"} size={15} />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex cursor-pointer">
                <Quote publication={(publication as Post)?.quoteOf! as Post} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPublication;
