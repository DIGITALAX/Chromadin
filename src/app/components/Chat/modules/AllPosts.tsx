import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { BiHomeHeart } from "react-icons/bi";
import { AiFillFastBackward } from "react-icons/ai";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AllPostsProps } from "../types/chat.types";
import QuickProfiles from "./QuickProfiles";
import Search from "./Search";
import Account from "./Account";
import useAllPosts from "../hooks/useAllPosts";
import { Post, Repost } from "@lens-protocol/client";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";

const AllPosts: FunctionComponent<AllPostsProps> = ({ dict }): JSX.Element => {
  const router = useRouter();
  const search = useSearchParams();
  const path = usePathname();
  const {
    profile,
    mainPost,
    feed,
    feedLoading,
    info,
    getMoreTimeline,
    commentsInfo,
    getMoreComments,
    openComment,
    setOpenComment,
  } = useAllPosts();

  return (
    <div className="relative w-full flex flex-col items-start justify-start gap-4 max-w-full h-full">
      <div className="relative flex flex-col items-start justify-start gap-3 h-auto w-full">
        {(search.get("profile") || search.get("post")) && (
          <div className="sticky z-0 w-full h-fit flex flex-row items-start justify-start mr-0 gap-2">
            <div
              className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
              onClick={() => {
                const params = new URLSearchParams(search?.toString());

                if (search.get("profile")) {
                  params.delete("profile");
                } else {
                  params.delete("post");
                }
                router.replace(`${path}?${params.toString()}`);
              }}
            >
              <BiHomeHeart color="white" size={18} />
            </div>
            <div
              className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
              onClick={() => router.back()}
            >
              <AiFillFastBackward color="white" size={20} />
            </div>
          </div>
        )}
        {search.get("profile") ? (
          <Account dict={dict} profile={profile!} />
        ) : (
          !search.get("profile") &&
          !search.get("post") && (
            <div className="relative w-full h-fit flex flex-col sm:flex-row lg:flex-col stuck2:flex-row gap-3 sm:gap-5">
              <div className="overflow-x-auto">
                <QuickProfiles />
              </div>
              <Search dict={dict} />
            </div>
          )
        )}
        {feedLoading ? (
          <div className="relative w-full h-full flex flex-col gap-4 overflow-y-scroll xl:h-[43.12rem]">
            {Array.from({ length: 30 }).map((_, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-fit rounded-md animate-pulse border border-white min-w-full opacity-70"
                  id="staticLoad"
                >
                  <div className="relative h-60 w-full"></div>
                </div>
              );
            })}
          </div>
        ) : !search.get("post") ? (
          <InfiniteScroll
            height={"40rem"}
            loader={""}
            hasMore={info?.hasMore}
            next={getMoreTimeline}
            dataLength={feed?.length}
            className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
            style={{ color: "#131313", fontFamily: "Digi Reg" }}
            scrollThreshold={0.9}
            scrollableTarget={"scrollableDiv"}
          >
            <div className="w-full h-full relative flex flex-col gap-4 pb-3">
              {feed?.map((publication: Post | Repost, index: number) => {
                return (
                  <div
                    className="relative w-full h-fit gap-2 flex flex-col"
                    key={index}
                  >
                    <FeedPublication
                      index={index}
                      setOpenComment={setOpenComment}
                      height={false}
                      dict={dict}
                      publication={publication}
                    />
                    {index === openComment && (
                      <MakeComment
                        dict={dict}
                        setOpenComment={setOpenComment}
                        post={
                          publication?.__typename == "Repost"
                            ? publication?.repostOf
                            : publication
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <>
            <FeedPublication
              index={0}
              setOpenComment={setOpenComment}
              height={false}
              dict={dict}
              publication={mainPost?.post!}
            />
            {0 === openComment && (
              <MakeComment
                setOpenComment={setOpenComment}
                dict={dict}
                post={
                  mainPost?.post?.__typename == "Repost"
                    ? mainPost?.post?.repostOf
                    : mainPost?.post!
                }
              />
            )}
            {
              <InfiniteScroll
                height={"20rem"}
                loader={""}
                hasMore={commentsInfo.hasMore}
                next={getMoreComments}
                dataLength={mainPost?.comments?.length || 0}
                className={`relative w-full h-full max-w-full overflow-y-scroll grow`}
                style={{ color: "#131313", fontFamily: "Digi Reg" }}
                scrollThreshold={0.9}
                scrollableTarget={"scrollableDiv"}
              >
                <div className="w-full h-full relative flex flex-col gap-4 pb-3 min-w-full">
                  {mainPost?.comments?.map(
                    (publication: Post, index: number) => {
                      return (
                        <div
                          className="relative w-full h-fit flex flex-col gap-2"
                          key={index}
                        >
                          <FeedPublication
                            dict={dict}
                            index={index}
                            setOpenComment={setOpenComment}
                            height={false}
                            publication={publication}
                          />
                          {index === Number(openComment) && (
                            <MakeComment
                              setOpenComment={setOpenComment}
                              dict={dict}
                              post={publication}
                            />
                          )}
                        </div>
                      );
                    }
                  )}
                </div>
              </InfiniteScroll>
            }
          </>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
