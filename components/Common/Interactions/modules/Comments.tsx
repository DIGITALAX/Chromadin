import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { CommentsProps } from "../types/interactions.types";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { AiFillFastBackward, AiOutlineLoading } from "react-icons/ai";
import {
  Comment,
  ImageMetadataV3,
  NftImage,
  PublicationMetadataMedia,
  TextOnlyMetadataV3,
  VideoMetadataV3,
} from "@/components/Home/types/generated";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import { setFollowCollect } from "@/redux/reducers/followCollectSlice";
import handleImageError from "@/lib/helpers/handleImageError";
import openActionCheck from "@/lib/helpers/openActionCheck";

const Comments: FunctionComponent<CommentsProps> = ({
  commentors,
  video,
  getMorePostComments,
  hasMoreComments,
  mirror,
  like,
  collect,
  dispatch,
  lensProfile,
  router,
  setSecondaryComment,
  secondaryComment,
  interactionsLoading,
  commentsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col bg-verde">
      <div className="relative w-full h-28  bg-offBlack">
        <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2 overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-2">
            <div className="relative w-fit h-1/2 flex justify-start">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
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
              {(video?.metadata as VideoMetadataV3)?.title?.includes(
                "Post by @chromadin.lens"
              )
                ? (video?.metadata as VideoMetadataV3)?.content.split("\n\n")[0]
                : (video?.metadata as VideoMetadataV3)?.title}
            </div>
          </div>
          <div
            className="relative w-full h-full flex font-arcade text-sm text-white whitespace-preline"
            dangerouslySetInnerHTML={{
              __html:
                (video?.metadata as VideoMetadataV3)?.content?.includes(
                  "\n\n"
                ) && parseInt(video?.id?.split("-"), 16) < 30
                  ? (video?.metadata as VideoMetadataV3)?.content
                      ?.split("\n\n")
                      ?.slice(1)
                      ?.join("<br><br>")
                  : (video?.metadata as VideoMetadataV3)?.content,
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
              hasMore={hasMoreComments}
              height={"27.7rem"}
              loader={<FetchMoreLoading size="3" />}
              dataLength={commentors?.length}
              next={getMorePostComments}
            >
              <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3">
                {commentors?.map((comment: Comment, index: number) => {
                  const profileImage = createProfilePicture(
                    comment?.by?.metadata?.picture
                  );
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row font-arcade text-sm items-start gap-3 p-3"
                    >
                      <div
                        className="relative w-fit h-full flex items-start justify-start cursor-pointer"
                        onClick={() => {
                          router.push(
                            `https://www.chromadin.xyz/#chat?option=history&profile=${
                              comment?.by?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )?.[1]
                            }`
                          );
                        }}
                      >
                        <div
                          className="relative w-6 h-6 border border-white"
                          id="crt"
                        >
                          {profileImage && (
                            <Image
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-full h-full flex"
                              src={profileImage}
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
                              `https://www.chromadin.xyz/#chat?option=history&profile=${
                                comment?.by?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )[1]
                              }`
                            );
                          }}
                        >
                          {comment?.by?.handle?.suggestedFormatted?.localName}
                        </div>
                        <div className="relative w-full h-full text-verde flex flex-col">
                          <div
                            className="relative w-full h-full flex"
                            dangerouslySetInnerHTML={{
                              __html: descriptionRegex(
                                (comment?.metadata as TextOnlyMetadataV3)
                                  ?.content
                              ),
                            }}
                          ></div>
                          <div className="relative w-44 h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-1">
                            {[
                              (comment?.metadata as ImageMetadataV3)?.asset,
                              ...((comment?.metadata as ImageMetadataV3)
                                ?.attachments || []),
                            ]?.map(
                              (
                                media: PublicationMetadataMedia,
                                indexTwo: number
                              ) => {
                                let formattedImageURL: string;

                                const mediaType =
                                  media?.__typename ===
                                  "PublicationMetadataMediaImage"
                                    ? media?.image
                                    : media?.__typename ===
                                      "PublicationMetadataMediaVideo"
                                    ? media?.video
                                    : undefined;
                                if (mediaType) {
                                  formattedImageURL =
                                    mediaType?.raw?.uri?.includes("ipfs://")
                                      ? `${INFURA_GATEWAY}/ipfs/${
                                          mediaType?.raw?.uri.split(
                                            "ipfs://"
                                          )[1]
                                        }`
                                      : mediaType?.raw?.uri;
                                } else {
                                  return;
                                }

                                return (
                                  <div
                                    key={indexTwo}
                                    className="relative w-24 h-24 grid grid-flow-col auto-cols-auto cursor-pointer"
                                    onClick={() =>
                                      dispatch(
                                        setImageViewer({
                                          actionValue: true,
                                          actionImage: formattedImageURL,
                                          actionType:
                                            media.__typename ===
                                            "PublicationMetadataMediaImage"
                                              ? "image/png"
                                              : "video/png",
                                        })
                                      )
                                    }
                                  >
                                    {formattedImageURL &&
                                      ((
                                        media.__typename ===
                                        "PublicationMetadataMediaImage"
                                          ? media
                                          : (media as NftImage).image
                                      ) ? (
                                        <Image
                                          src={formattedImageURL}
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
                                          <source
                                            src={formattedImageURL}
                                            type="video/mp4"
                                          />
                                        </video>
                                      ))}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <div className="relative w-full h-full text-moda justify-start flex">
                          {moment(`${comment?.createdAt}`).fromNow()}
                        </div>
                      </div>
                      <div className="relative grid grid-rows-2 w-full h-full gap-2 items-end justify-end flex-wrap">
                        {[
                          {
                            function: () =>
                              like(
                                comment?.id,
                                comment?.operations?.hasReacted!,
                                index
                              ),
                            loader: interactionsLoading?.[index]?.like,
                            responded:
                              commentors?.[index]?.operations?.hasReacted,
                            amount: commentors?.[index]?.stats?.reactions,
                            image:
                              "QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6",
                            imageResponded:
                              "Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS",
                          },
                          {
                            function: () => mirror(comment?.id, index),
                            loader: interactionsLoading?.[index]?.mirror,
                            responded:
                              commentors?.[index]?.operations?.hasMirrored,
                            amount: commentors?.[index]?.stats?.mirrors,
                            image:
                              "QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY",
                            imageResponded:
                              "QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB",
                          },
                          {
                            function: () =>
                              openActionCheck(
                                comment?.openActionModules?.[0]?.contract
                                  ?.address
                              )
                                ? router.push(
                                    `/autograph/${
                                      comment?.by?.handle?.suggestedFormatted?.localName?.split(
                                        "@"
                                      )?.[1]
                                    }/collection/${(
                                      comment?.metadata as ImageMetadataV3
                                    )?.title?.replaceAll(" ", "_")}`
                                  )
                                : comment?.openActionModules?.[0]
                                    ?.__typename ===
                                  "SimpleCollectOpenActionSettings"
                                ? (Number(
                                    comment.openActionModules[0]?.amount?.value
                                  ) == 0 ||
                                    !Number(
                                      comment.openActionModules[0]?.amount
                                        ?.value
                                    )) &&
                                  (!comment.openActionModules[0]
                                    ?.followerOnly ||
                                    (comment.openActionModules[0]
                                      ?.followerOnly &&
                                      lensProfile?.operations?.isFollowedByMe
                                        ?.value))
                                  ? () =>
                                      collect(
                                        comment?.id,
                                        comment?.openActionModules?.[0]?.type!,
                                        index
                                      )
                                  : comment?.openActionModules[0]
                                      ?.followerOnly &&
                                    !lensProfile?.operations?.isFollowedByMe
                                      ?.value
                                  ? () =>
                                      dispatch(
                                        setFollowCollect({
                                          actionType: "follow",
                                          actionFollower: comment?.by,
                                        })
                                      )
                                  : () =>
                                      dispatch(
                                        setFollowCollect({
                                          actionType: "collect",
                                          actionCollect: {
                                            id: comment?.id,
                                            stats:
                                              comment?.stats.countOpenActions,
                                            item: comment
                                              ?.openActionModules?.[0],
                                          },
                                        })
                                      )
                                : () => {},
                            loader: interactionsLoading?.[index]?.collect,
                            responded:
                              commentors?.[index]?.operations?.hasActed?.value,
                            amount:
                              commentors?.[index]?.stats?.countOpenActions,
                            image:
                              "QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr",
                            imageResponded:
                              "QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU",
                          },
                          {
                            function: () => setSecondaryComment(comment?.id),
                            loader: interactionsLoading?.[index]?.comment,
                            responded: false,
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
                                  lensProfile && "cursor-pointer"
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
                                    src={`${INFURA_GATEWAY}/ipfs/${
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
