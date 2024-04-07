import Profile from "./Profile";
import Image from "next/legacy/image";
import { AiFillEye, AiOutlineRetweet } from "react-icons/ai";
import { FunctionComponent } from "react";
import { FeedPublicationProps } from "../types/wavs.types";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { FaRegCommentDots } from "react-icons/fa";
import {
  Comment,
  Post,
  PublicationMetadataMedia,
} from "@/components/Home/types/generated";
import { metadataMedia, postMetadata } from "@/lib/helpers/postMetadata";
import Quote from "./Quote";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";

const FeedPublication: FunctionComponent<FeedPublicationProps> = ({
  publication,
  t,
  dispatch,
  height,
  address,
  collect,
  mirror,
  like,
  index,
  setOpenComment,
  interactionsLoading,
  main,
  router,
  setOpenMirrorChoice,
  openMirrorChoice,
}): JSX.Element => {
  const metadata = postMetadata(publication);
  return (
    <div
      className={`relative w-full ${
        height ? "h-full" : "h-fit"
      } flex flex-row flex-wrap sm:flex-nowrap gap-6 rounded-md z-0`}
      data-post-id={publication?.id}
      id={publication?.id}
    >
      <Profile
        t={t}
        publication={publication}
        dispatch={dispatch}
        address={address}
        index={index}
        collect={collect}
        mirror={mirror}
        like={like}
        interactionsLoading={interactionsLoading}
        setOpenComment={setOpenComment}
        main={main}
        router={router}
        openMirrorChoice={openMirrorChoice}
        setOpenMirrorChoice={setOpenMirrorChoice}
      />
      <div
        className={`relative w-full h-auto grow rounded-md grid grid-flow-row auto-rows-auto p-3 preG:p-6 gap-6 border-2  bg-gradient-to-r ${
          (publication as any)?.gated ||
          (publication?.__typename === "Mirror"
            ? publication?.mirrorOn
            : (publication as Post)
          )?.isEncrypted
            ? "from-gray-400 via-gray-600 to-gray-800 border-white"
            : "from-offBlack via-gray-600 to-black border-black"
        }`}
      >
        {(publication?.__typename === "Mirror" ||
          publication?.__typename === "Comment") && (
          <div
            className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 ${
              publication?.__typename === "Comment" && "cursor-pointer"
            }`}
            onClick={() =>
              publication?.__typename === "Comment" &&
              (!router?.asPath?.includes("/autograph/")
                ? router.push(
                    router?.asPath?.includes("&post=")
                      ? router?.asPath?.includes("?option=")
                        ? router?.asPath.split("&post=")[0] +
                          `&post=${publication?.commentOn?.id}`
                        : router?.asPath.split("&post=")[0] +
                          `?option=history&post=${publication?.commentOn?.id}`
                      : router?.asPath?.includes("&profile=")
                      ? router?.asPath?.includes("?option=")
                        ? router?.asPath.split("&profile=")[0] +
                          `&post=${publication?.commentOn?.id}`
                        : router?.asPath.split("&profile=")[0] +
                          `?option=history&post=${publication?.commentOn?.id}`
                      : router?.asPath?.includes("?option=")
                      ? router?.asPath + `&post=${publication?.commentOn?.id}`
                      : router?.asPath +
                        `?option=history&post=${publication?.commentOn?.id}`
                  )
                : router.replace(
                    `/#chat?option=history&post=${publication?.commentOn?.id}`
                  ))
            }
          >
            <div
              className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
            >
              {publication?.__typename === "Mirror"
                ? `Mirrored by ${
                    publication?.by?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }`
                : `Comment of ${
                    (
                      publication as Comment
                    )?.commentOn?.metadata?.content?.slice(0, 10) + "..."
                  }`}
            </div>
            <div className="relative w-fit h-fit col-start-2 place-self-center">
              {publication?.__typename === "Mirror" ? (
                <AiOutlineRetweet color={"red"} size={15} />
              ) : (
                <FaRegCommentDots color={"red"} size={15} />
              )}
            </div>
          </div>
        )}
        <div
          className={`${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-2"
              : "row-start-1"
          } relative w-full h-fit text-left font-dosis grid grid-flow-row auto-rows-auto gap-6`}
        >
          <div
            className={`relative w-full h-fit row-start-1 relative h-fit text-white font-dosis self-center justify-self-start break-all preG:break-words`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: descriptionRegex(
                  publication?.__typename !== "Mirror"
                    ? (publication as Post)?.metadata?.content
                    : publication?.mirrorOn?.metadata?.content
                ),
              }}
              className="relative place-self-center whitespace-preline break-all preG:break-words"
            ></div>
          </div>
        </div>
        <div
          className={`relative w-fit max-w-full h-fit rounded-lg overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10 ${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-3"
              : "row-start-2"
          }`}
        >
          {!(
            publication?.__typename === "Mirror"
              ? publication?.mirrorOn
              : (publication as Post)
          )?.isEncrypted &&
            metadata &&
            metadata !== null &&
            metadata?.map((item: PublicationMetadataMedia, index: number) => {
              const media = metadataMedia(item);
              return (
                media?.url && (
                  <div
                    key={index}
                    className={`${
                      media?.type !== "Audio"
                        ? "h-40 preG:h-60 border-2 border-black rounded-lg bg-black"
                        : "h-10"
                    } w-40 preG:w-60 relative flex items-center justify-center col-start-${
                      index + 1
                    } ${
                      media?.type === "Image" &&
                      "cursor-pointer hover:opacity-70 active:scale-95"
                    } `}
                    onClick={() =>
                      media?.type === "Image" &&
                      dispatch(
                        setImageViewer({
                          actionType: media?.type,
                          actionValue: true,
                          actionImage: media?.url,
                        })
                      )
                    }
                  >
                    <div className="relative w-full h-full flex rounded-md items-center justify-center">
                      {media?.type === "Image" ? (
                        <Image
                          src={media?.url}
                          layout="fill"
                          objectFit="cover"
                          objectPosition={"center"}
                          className="rounded-md"
                          draggable={false}
                        />
                      ) : media?.type === "Audio" ? (
                        <audio
                          muted
                          controls
                          className="rounded-md absolute w-full h-full object-cover"
                        >
                          <source src={media?.url} />
                        </audio>
                      ) : (
                        <video
                          muted
                          controls
                          className="rounded-md absolute w-full h-full object-cover"
                        >
                          <source src={media?.url} />
                        </video>
                      )}
                    </div>
                  </div>
                )
              );
            })}
        </div>
        <div
          className={`relative w-full h-fit ${
            publication?.__typename === "Mirror" ||
            publication?.__typename === "Comment"
              ? "row-start-4"
              : "row-start-3"
          } grid grid-flow-col auto-cols-auto justify-end items-end`}
        >
          {(publication?.__typename !== "Mirror"
            ? publication?.id
            : publication?.mirrorOn.id) && (
            <div
              className={`relative w-fit h-full col-start-1 row-start-1 sm:col-start-2 sm:pt-0 pt-3  grid grid-flow-col auto-cols-auto font-digi gap-1 cursor-pointer justify-self-end self-end hover:opacity-70 active:scale-95 text-white`}
              onClick={() =>
                !router?.asPath?.includes("/autograph/")
                  ? router.push(
                      router?.asPath?.includes("&post=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&post=")[0] +
                            `&post=${
                              publication?.__typename !== "Mirror"
                                ? publication?.id
                                : publication?.mirrorOn.id
                            }`
                          : router?.asPath.split("&post=")[0] +
                            `?option=history&post=${
                              publication?.__typename !== "Mirror"
                                ? publication?.id
                                : publication?.mirrorOn.id
                            }`
                        : router?.asPath?.includes("&profile=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&profile=")[0] +
                            `&post=${
                              publication?.__typename !== "Mirror"
                                ? publication?.id
                                : publication?.mirrorOn.id
                            }`
                          : router?.asPath.split("&profile=")[0] +
                            `?option=history&post=${
                              publication?.__typename !== "Mirror"
                                ? publication?.id
                                : publication?.mirrorOn.id
                            }`
                        : router?.asPath?.includes("?option=")
                        ? router?.asPath +
                          `&post=${
                            publication?.__typename !== "Mirror"
                              ? publication?.id
                              : publication?.mirrorOn.id
                          }`
                        : router?.asPath +
                          `?option=history&post=${
                            publication?.__typename !== "Mirror"
                              ? publication?.id
                              : publication?.mirrorOn.id
                          }`
                    )
                  : router.replace(
                      `/#chat?option=history&post=${
                        publication?.__typename !== "Mirror"
                          ? publication?.id
                          : publication?.mirrorOn.id
                      }`
                    )
              }
            >
              <div className="relative w-fit h-fit flex  self-center  text-sm">
                {publication?.__typename !== "Comment" ? t("pos") : t("com")}
              </div>
              <div className={`relative w-fit h-fit self-center flex`}>
                <AiFillEye color={"white"} size={20} />
              </div>
            </div>
          )}
        </div>
        {publication?.__typename === "Quote" && (
          <div
            className="relative w-full h-fit px-3 py-1 flex items-start justify-center"
            id="fadedQuote"
          >
            <div
              className="relative w-full h-fit p-2 flex items-center justify-start flex-col from-gray-400 via-gray-600 to-gray-800 bg-gradient-to-r rounded-md gap-5"
              onClick={() =>
                !router?.asPath?.includes("/autograph/")
                  ? router.push(
                      router?.asPath?.includes("&post=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&post=")[0] +
                            `&post=${publication?.quoteOn?.id}`
                          : router?.asPath.split("&post=")[0] +
                            `?option=history&post=${publication?.quoteOn?.id}`
                        : router?.asPath?.includes("&profile=")
                        ? router?.asPath?.includes("?option=")
                          ? router?.asPath.split("&profile=")[0] +
                            `&post=${publication?.quoteOn?.id}`
                          : router?.asPath.split("&profile=")[0] +
                            `?option=history&post=${publication?.quoteOn?.id}`
                        : router?.asPath?.includes("?option=")
                        ? router?.asPath + `&post=${publication?.quoteOn?.id}`
                        : router?.asPath +
                          `?option=history&post=${publication?.quoteOn?.id}`
                    )
                  : router.replace(
                      `/#chat?option=history&post=${publication?.quoteOn?.id}`
                    )
              }
            >
              <div className="relative w-full h-fit flex items-end justify-end">
                <div
                  className={`relative w-fit h-fit row-start-1 justify-self-end self-center grid grid-flow-col auto-cols-auto gap-2 cursor-pointer`}
                >
                  <div
                    className={`relative w-fit h-fit col-start-1 place-self-center text-xs font-dosis text-offWhite`}
                  >
                    Quote on{" "}
                    {publication?.quoteOn?.metadata?.content?.slice(0, 10) +
                      "..."}
                  </div>
                  <div className="relative w-fit h-fit col-start-2 place-self-center">
                    <AiOutlineRetweet color={"white"} size={15} />
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex cursor-pointer">
                <Quote publication={publication?.quoteOn} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedPublication;
