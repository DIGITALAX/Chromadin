import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import {
  ImageMetadata,
  MediaImage,
  MediaVideo,
  Post,
  SimpleCollectAction,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiFillFastBackward, AiOutlineLoading } from "react-icons/ai";
import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { ModalContext } from "@/app/providers";
import moment from "moment";
import handleImageError from "@/app/lib/helpers/handleImageError";
import openActionCheck from "@/app/lib/helpers/openActionCheck";
import { CommentsProps } from "../types/sidebar.types";
import useInteractions from "../hooks/useInteractions";
import FetchMoreLoading from "../../Common/modules/FetchMoreLoading";
import { handleImage } from "@/app/lib/helpers/handleImage";

const Comments: FunctionComponent<CommentsProps> = ({
  dict,
  secondaryComment,
  setSecondaryComment,
  commentLoading,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const {
    commentors,
    getMorePostComments,
    commentsLoading,
    commentsInfo,
    simpleCollect,
    mirror,
    like,
    interactionsLoading,
  } = useInteractions(dict, secondaryComment);

  return (
    <div className="relative w-full h-full flex flex-col bg-verde">
      <div className="relative w-full h-28  bg-offBlack">
        <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2 overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-2">
            <div className="relative w-fit h-1/2 flex justify-start">
              <Image
                src={`${INFURA_GATEWAY_INTERNAL}QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                height={5}
                width={10}
                alt="stripes"
                draggable={false}
              />
            </div>
            <div
              className="relative w-full h-fit text-lg font-arcade flex justify-start break-words"
              id={`record1`}
            >
              {(
                context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata
              )?.title?.includes("Post by @chromadin.lens")
                ? (
                    context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata
                  )?.content.split("\n\n")[0]
                : (context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata)?.title}
            </div>
          </div>
          <div
            className="relative w-full h-full flex font-arcade text-sm text-white whitespace-preline"
            dangerouslySetInnerHTML={{
              __html: (
                context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata
              )?.content?.includes("\n\n")
                ? (context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata)?.content
                    ?.split("\n\n")
                    ?.slice(1)
                    ?.join("<br><br>")
                : (context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.metadata as VideoMetadata)
                    ?.content,
            }}
          />
        </div>
      </div>
      <div className="relative w-full h-[15rem] xl:h-[27.7rem] border-white border bg-offBlack overflow-y-scroll">
        {secondaryComment !== "" && (
          <div className="sticky z-0 w-full h-10 flex flex-col items-center justify-start px-3 bg-offBlack">
            <div
              className="relative w-full h-full flex items-center cursor-pointer"
              onClick={() => setSecondaryComment("")}
            >
              <AiFillFastBackward color="white" size={20} />
            </div>
          </div>
        )}
        {commentsLoading ? (
          <div className="relative w-full h-full justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : !commentsLoading && commentors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-full justify-center items-center py-3 flex text-center">
            <div className="relative w-3/4 h-full items-start justify-center flex">
              {secondaryComment !== ""
                ? "Reply to this comment in the message box"
                : "Be the first to comment on this stream :)"}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-5">
            <InfiniteScroll
              className={`relative row-start-1 w-full h-full overflow-y-scroll`}
              hasMore={commentsInfo?.hasMore}
              height={"27.7rem"}
              loader={<FetchMoreLoading size="3" />}
              dataLength={commentors?.length}
              next={getMorePostComments}
            >
              <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3">
                {commentors?.map((comment: Post, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row font-arcade text-sm items-start gap-3 p-3"
                    >
                      <div
                        className="relative w-fit h-full flex items-start justify-start cursor-pointer"
                        onClick={() => {
                          router.push(
                            `https://www.chromadin.xyz/user/${comment?.author?.username?.localName}`
                          );
                        }}
                      >
                        <div
                          className="relative w-6 h-6 border border-white"
                          id="crt"
                        >
                          {comment?.author?.metadata?.picture?.split(
                            "ipfs://"
                          )?.[1] && (
                            <Image
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-full h-full flex"
                              src={`${INFURA_GATEWAY_INTERNAL}${
                                comment?.author?.metadata?.picture?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                              draggable={false}
                              onError={(e) => handleImageError(e)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="relative w-full h-full flex flex-col gap-2">
                        <div
                          className="relative w-full h-full text-ama justify-start flex cursor-pointer"
                          onClick={() => {
                            router.push(
                              `https://www.chromadin.xyz/user/${comment?.author?.username?.localName}`
                            );
                          }}
                        >
                          {comment?.author?.username?.localName}
                        </div>
                        <div className="relative w-full h-full text-verde flex flex-col">
                          <div
                            className="relative w-full h-full flex break-all"
                            dangerouslySetInnerHTML={{
                              __html: descriptionRegex(
                                (comment?.metadata as TextOnlyMetadata)?.content
                              ),
                            }}
                          ></div>
                          <div className="relative w-44 h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-1">
                            {[
                              comment?.metadata?.__typename == "ImageMetadata"
                                ? comment?.metadata?.image
                                : (comment?.metadata as VideoMetadata)?.video,
                              ...(((comment?.metadata as ImageMetadata)
                                ?.attachments as (MediaVideo | MediaImage)[]) ||
                                []),
                            ]
                              ?.filter(Boolean)
                              ?.map(
                                (
                                  media: MediaVideo | MediaImage,
                                  indexTwo: number
                                ) => {
                                  const url = handleImage(media?.item);
                                  return (
                                    <div
                                      key={indexTwo}
                                      className="relative w-24 h-24 grid grid-flow-col auto-cols-auto cursor-pointer"
                                      onClick={() =>
                                        context?.setVerImagen({
                                          item: url,
                                          type:
                                            media?.__typename === "MediaImage"
                                              ? "image/png"
                                              : "video/png",
                                        })
                                      }
                                    >
                                      {media?.__typename === "MediaImage" ? (
                                        <Image
                                          src={url}
                                          layout="fill"
                                          objectFit="cover"
                                          draggable={false}
                                          className="rounded-lg"
                                          onError={(e) => handleImageError(e)}
                                        />
                                      ) : (
                                        <video
                                          muted
                                          controls
                                          playsInline
                                          autoPlay
                                          loop
                                          className="rounded-md absolute w-full h-full object-cover"
                                        >
                                          <source src={url} type="video/mp4" />
                                        </video>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                          </div>
                        </div>
                        <div className="relative w-full h-full text-moda justify-start flex">
                          {moment(`${comment?.timestamp}`).fromNow()}
                        </div>
                      </div>
                      <div className="relative grid grid-rows-2 w-full h-full gap-2 items-end justify-end flex-wrap">
                        {[
                          {
                            function: () =>
                              like(
                                comment?.id,
                                comment?.operations?.hasUpvoted!
                              ),
                            loader: interactionsLoading?.[index]?.like,
                            responded:
                              commentors?.[index]?.operations?.hasUpvoted!,
                            amount: commentors?.[index]?.stats?.upvotes,
                            image:
                              "QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6",
                            imageResponded:
                              "Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS",
                          },
                          {
                            function: () => mirror(comment?.id),
                            loader: interactionsLoading?.[index]?.mirror,
                            responded:
                              commentors?.[index]?.operations?.hasReposted
                                ?.optimistic!,
                            amount: commentors?.[index]?.stats?.reposts,
                            image:
                              "QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY",
                            imageResponded:
                              "QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB",
                          },
                          {
                            function: () =>
                              openActionCheck(comment?.actions?.[0]?.address)
                                ? router.push(
                                    `/autograph/${
                                      comment?.author?.username?.localName
                                    }/collection/${(
                                      comment?.metadata as ImageMetadata
                                    )?.title?.replaceAll(" ", "_")}`
                                  )
                                : comment?.actions?.[0]?.__typename ==
                                  "SimpleCollectAction"
                                ? (Number(
                                    comment.actions[0]?.payToCollect?.amount
                                      ?.value
                                  ) == 0 ||
                                    !Number(
                                      comment.actions[0]?.payToCollect?.amount
                                        ?.value
                                    )) &&
                                  (!comment.actions[0]?.followerOnGraph
                                    ?.globalGraph ||
                                    (comment.actions[0]?.followerOnGraph
                                      ?.globalGraph &&
                                      context?.lensConectado?.profile
                                        ?.operations?.isFollowedByMe))
                                  ? () => simpleCollect(comment?.id)
                                  : comment?.actions[0]?.followerOnGraph
                                      ?.globalGraph &&
                                    !context?.lensConectado?.profile?.operations
                                      ?.isFollowedByMe
                                  ? () => context?.setFollow(comment?.author)
                                  : () =>
                                      context?.setCollect({
                                        id: comment?.id,
                                        stats: comment?.stats.collects,
                                        action: comment
                                          ?.actions?.[0] as SimpleCollectAction,
                                      })
                                : () => {},
                            loader: interactionsLoading?.[index]?.collect,
                            responded:
                              commentors?.[index]?.operations
                                ?.hasSimpleCollected!,
                            amount: commentors?.[index]?.stats?.collects,
                            image:
                              "QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr",
                            imageResponded:
                              "QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU",
                          },
                          {
                            function: () => setSecondaryComment(comment?.id),
                            loader: commentLoading,
                            responded:
                              commentors?.[index]?.operations?.hasCommented
                                ?.optimistic!,
                            amount: commentors?.[index]?.stats?.comments,
                            image:
                              "QmeuR9Fzv8QF9R6ntjGKB78GteQgmEcXhBfVPhsTyWbumA",
                            imageResponded:
                              "QmeuR9Fzv8QF9R6ntjGKB78GteQgmEcXhBfVPhsTyWbumA",
                          },
                        ]?.map(
                          (
                            item: {
                              function: () => void;
                              loader: boolean;
                              responded: boolean;
                              amount: number;
                              image: string;
                              imageResponded: string;
                            },
                            indexTwo
                          ) => {
                            return (
                              <div
                                key={indexTwo}
                                className={`relative w-full h-full grid grid-flow-col auto-cols-auto items-center justify-end flex-row gap-2 ${
                                  context?.lensConectado?.profile &&
                                  "cursor-pointer"
                                }`}
                                onClick={() => item.function()}
                              >
                                {item?.loader ? (
                                  <AiOutlineLoading
                                    size={9}
                                    color="white"
                                    className={"animate-spin"}
                                  />
                                ) : (
                                  <Image
                                    src={`${INFURA_GATEWAY_INTERNAL}${
                                      item?.responded
                                        ? item?.imageResponded
                                        : item?.image
                                    }`}
                                    width={12}
                                    height={12}
                                    alt="mirror"
                                    draggable={false}
                                  />
                                )}
                                <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                                  {item?.amount}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comments;
