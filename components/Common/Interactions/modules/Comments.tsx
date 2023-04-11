import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";
import { MediaSet } from "@/components/Home/types/lens.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import { CommentsProps } from "../types/interactions.types";
import descriptionRegex from "@/lib/helpers/descriptionRegex";
import { AiOutlineLoading } from "react-icons/ai";
import { setPurchase } from "@/redux/reducers/purchaseSlice";
import { setFollowerOnly } from "@/redux/reducers/followerOnlySlice";

const Comments: FunctionComponent<CommentsProps> = ({
  commentors,
  video,
  getMorePostComments,
  commentsLoading,
  hasMoreComments,
  mirrorCommentLoading,
  likeCommentLoading,
  collectCommentLoading,
  mirrorComment,
  collectComment,
  likeComment,
  dispatch,
  hasMirrored,
  hasReacted,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col bg-verde">
      <div className="relative w-full h-28 bg-offBlack">
        <div className="relative p-2 w-full h-full border border-white flex flex-col items-center gap-2">
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
              className="relative w-full h-fit text-lg font-arcade flex justify-start"
              id={`record1`}
            >
              {video?.metadata?.content?.split("\n\n")[0]?.length > 20
                ? video?.metadata?.content?.split("\n\n")[0]?.slice(0, 20) +
                  "..."
                : video?.metadata?.content?.split("\n\n")[0]}
            </div>
          </div>
          <div className="relative w-full h-full flex font-arcade text-sm text-white">
            {video?.metadata?.content?.split("\n\n")[1]?.length > 110
              ? video?.metadata?.content?.split("\n\n")[1]?.slice(0, 110) +
                "..."
              : video?.metadata?.content?.split("\n\n")[1]}
          </div>
        </div>
      </div>
      <div className="relative w-full h-[15rem] xl:h-[27.7rem] border-white border bg-offBlack overflow-y-scroll">
        {commentsLoading ? (
          <div className="relative w-full h-full justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : !commentsLoading && commentors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-full justify-center items-start py-3 flex text-center">
            Be the first to comment on this stream :)
          </div>
        ) : (
          <div className="relative w-full h-full grid grid-flow-row auto-rows-auto gap-5">
            <InfiniteScroll
              className={`relative row-start-1 w-full h-full`}
              hasMore={hasMoreComments}
              height={"27.7rem"}
              loader={<FetchMoreLoading size="3" />}
              dataLength={commentors?.length}
              next={getMorePostComments}
            >
              <div className="relative w-full h-fit grid grid-flow-row auto-rows-auto gap-3 overflow-y-scroll">
                {commentors?.map((comment: any, index: number) => {
                  const profileImage = createProfilePicture(comment, true);
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row font-arcade text-sm items-start gap-3 p-3"
                    >
                      <div className="relative w-fit h-full flex items-start justify-start">
                        <div
                          className="relative w-6 h-6 border border-white"
                          id="crt"
                        >
                          {profileImage !== "" && (
                            <Image
                              objectFit="cover"
                              alt="pfp"
                              layout="fill"
                              className="relative w-full h-full flex"
                              src={profileImage}
                              draggable={false}
                            />
                          )}
                        </div>
                      </div>
                      <div className="relative w-full h-full flex flex-col gap-2">
                        <div className="relative w-full h-full text-ama justify-start flex">
                          @{comment?.profile?.handle}
                        </div>
                        <div className="relative w-full h-full text-verde flex flex-col">
                          <div
                            className="relative w-full h-full flex"
                            dangerouslySetInnerHTML={{
                              __html: descriptionRegex(
                                comment?.metadata?.content
                              ),
                            }}
                          ></div>
                          <div className="relative w-44 h-fit overflow-x-scroll grid grid-flow-col auto-cols-auto gap-3 z-10">
                            {comment.metadata.media.map(
                              (media: MediaSet, index: number) => {
                                let formattedImageURL: string;
                                if (media?.original?.url?.includes("ipfs://")) {
                                  formattedImageURL = `${INFURA_GATEWAY}/ipfs/${
                                    media?.original?.url?.split("://")[1]
                                  }`;
                                } else {
                                  formattedImageURL = media?.original?.url;
                                }
                                return (
                                  <div
                                    key={index}
                                    className="relative w-24 h-24 grid grid-flow-col auto-cols-auto"
                                  >
                                    {media?.original?.mimeType !==
                                    "video/mp4" ? (
                                      <Image
                                        src={formattedImageURL}
                                        layout="fill"
                                        objectFit="cover"
                                        draggable={false}
                                        className="rounded-lg"
                                      />
                                    ) : (
                                      <video
                                        muted
                                        controls
                                        autoPlay
                                        loop
                                        className="rounded-md absolute w-full h-full object-cover"
                                      >
                                        <source
                                          src={formattedImageURL}
                                          type="video/mp4"
                                        />
                                      </video>
                                    )}
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
                      <div className="relative flex flex-col w-full h-full gap-2 items-end justify-center">
                        <div
                          className="relative w-fit h-fit cursor-pointer grid grid-flow-col auto-cols-auto items-center justify-center flex-row gap-2"
                          onClick={() => likeComment(comment?.id)}
                        >
                          {likeCommentLoading[index] ? (
                            <AiOutlineLoading
                              size={9}
                              color="white"
                              className={`${
                                likeCommentLoading?.[index] && "animate-spin"
                              }
                                `}
                            />
                          ) : hasReacted?.[index] ? (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS`}
                              width={12}
                              height={12}
                              alt="mirror"
                              draggable={false}
                            />
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6`}
                              width={12}
                              height={12}
                              alt="backward"
                              draggable={false}
                            />
                          )}
                          <div className="relative w-fit h-fit font-arcade text-xs text-white flex">
                            {comment?.stats?.totalUpvotes}
                          </div>
                        </div>
                        <div
                          className={`relative w-fit h-fit grid grid-flow-col auto-cols-auto items-center justify-center flex-row gap-2 ${
                            comment?.collectModule?.type !==
                              "RevertCollectModule" && "cursor-pointer"
                          }`}
                          onClick={
                            comment?.collectModule?.type ===
                            "RevertCollectModule"
                              ? () => {}
                              : comment?.collectModule?.followerOnly &&
                                !comment?.profile?.isFollowedByMe
                              ? () =>
                                  dispatch(
                                    setFollowerOnly({
                                      actionOpen: true,
                                      actionFollowerId: comment?.profile?.id,
                                      actionId: comment?.id,
                                      actionIndex: index,
                                    })
                                  )
                              : comment?.collectModule?.type !==
                                "FreeCollectModule"
                              ? () =>
                                  dispatch(
                                    setPurchase({
                                      actionOpen: true,
                                      actionId: comment?.id,
                                      actionIndex: index,
                                    })
                                  )
                              : () => collectComment(comment?.id)
                          }
                        >
                          {collectCommentLoading[index] ? (
                            <AiOutlineLoading
                              size={9}
                              color="white"
                              className={`${
                                collectCommentLoading[index] && "animate-spin"
                              }
                                `}
                            />
                          ) : comment?.hasCollectedByMe ? (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU`}
                              width={12}
                              height={12}
                              alt="collect"
                              draggable={false}
                            />
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr`}
                              width={12}
                              height={12}
                              alt="collect"
                              draggable={false}
                            />
                          )}
                          <div className="relative w-fit h-fit font-arcade text-xs text-white">
                            {comment?.stats?.totalAmountOfCollects}
                          </div>
                        </div>
                        <div
                          className={`relative w-fit h-fit cursor-pointer grid grid-flow-col auto-cols-auto items-center justify-center flex-row gap-2`}
                          onClick={() => mirrorComment(comment?.id)}
                        >
                          {mirrorCommentLoading[index] ? (
                            <AiOutlineLoading
                              size={9}
                              color="white"
                              className={`${
                                mirrorCommentLoading[index] && "animate-spin"
                              }
                                `}
                            />
                          ) : hasMirrored?.[index] ? (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB`}
                              width={12}
                              height={12}
                              alt="mirror"
                              draggable={false}
                            />
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY`}
                              width={12}
                              height={12}
                              alt="mirror"
                              draggable={false}
                            />
                          )}
                          <div className="relative w-fit h-fit font-arcade text-xs text-white">
                            {comment?.stats?.totalAmountOfMirrors}
                          </div>
                        </div>
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
