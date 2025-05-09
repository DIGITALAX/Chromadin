"use client";

import { FunctionComponent, JSX, useContext } from "react";
import NotFoundEntry from "../../Common/modules/NotFoundEntry";
import { ModalContext } from "@/app/providers";
import Bar from "./Bar";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "../../Chat/modules/MakeComment";
import FeedPublication from "../../Chat/modules/FeedPublication";
import { Post, Repost } from "@lens-protocol/client";
import useAllPosts from "../../Chat/hooks/useAllPosts";
import RouterChange from "./RouterChange";
import Drops from "./Drops";
import Collections from "./Collections";
import useAutograph from "../hooks/useAutograph";

const AutographEntry: FunctionComponent<{ dict: any; name: string }> = ({
  dict,
  name,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { autograph, autographLoading } = useAutograph(name);
  const {
    feed,
    feedLoading,
    info,
    getMoreTimeline,
    openComment,
    setOpenComment,
  } = useAllPosts(autograph?.profile?.address);


  if (feedLoading || autographLoading || !autograph?.profile) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
      id="calc"
    >
      <Bar dict={dict} />
      {context?.designerProfiles &&
      !context?.designerProfiles?.find(
        (prof) =>
          prof?.username?.localName?.toLowerCase() ===
          autograph?.profile?.username?.localName?.toLowerCase()
      ) ? (
        <NotFoundEntry dict={dict} />
      ) : (
        autograph?.profile &&
        feed?.length > 0 && (
          <div className="relative flex flex-col w-full h-fit gap-20 justify-start px-2 preG:px-8 md:px-20 py-10">
            <div className="relative flex flex-col tablet:flex-row gap-10 tablet:gap-3 items-start justify-center w-full h-full">
              <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4 order-2 tablet:order-1">
                <InfiniteScroll
                  height={"104.5rem"}
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
                            dict={dict}
                            height={false}
                            publication={publication}
                            setOpenComment={setOpenComment}
                            index={index}
                          />
                          {index === openComment && (
                            <MakeComment
                              dict={dict}
                              post={
                                publication?.__typename == "Repost"
                                  ? publication?.repostOf
                                  : publication
                              }
                              setOpenComment={setOpenComment}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </InfiniteScroll>
              </div>
              {autograph?.collections?.length > 0 && (
                <div className="relative w-full h-fit flex flex-col gap-2 px-1 sm:px-4 order-1 tablet:order-2">
                  <Collections
                    collections={autograph?.collections}
                    profile={autograph?.profile}
                    dict={dict}
                  />
                </div>
              )}
            </div>
            <Drops
              drops={autograph?.drops}
              profile={autograph?.profile}
              dict={dict}
            />
          </div>
        )
      )}
    </div>
  );
};

export default AutographEntry;
