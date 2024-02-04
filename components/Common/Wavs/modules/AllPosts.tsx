import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { AllPostsProps } from "../types/wavs.types";
import QuickProfiles from "./QuickProfiles";
import Search from "./Search";
import SuperCreator from "./SuperCreator";
import {
  Comment,
  Mirror,
  Post,
  Quote,
} from "@/components/Home/types/generated";
import { BiHomeHeart } from "react-icons/bi";
import { AiFillFastBackward } from "react-icons/ai";
import Account from "./Account";

const AllPosts: FunctionComponent<AllPostsProps> = ({
  hasMore,
  fetchMore,
  dispatch,
  address,
  router,
  commentOpen,
  commentDescription,
  textElement,
  caretCoord,
  handleCommentDescription,
  openConnectModal,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleKeyDownDelete,
  mediaLoading,
  handleLensSignIn,
  enabledCurrencies,
  quickProfiles,
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  fetchMoreSearch,
  hasMoreSearch,
  setProfilesFound,
  setProfilesOpenSearch,
  preElement,
  openMirrorChoice,
  setOpenMirrorChoice,
  lensProfile,
  collect,
  mirror,
  like,
  comment,
  setOpenComment,
  allPosts,
  history,
  mainPost,
  interactionsLoading,
  mainInteractionsLoading,
  profileCollections,
  profile,
  commentsLoading,
  hasMoreComments,
  commentors,
  fetchMoreComments,
  setMediaLoading,
  commentLoading,
  postCollectGif,
  mainPostLoading,
  openMainMirrorChoice,
  setMainOpenMirrorChoice,
  setMainMediaLoading,
  mainMediaLoading,
  postsLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4 max-w-full">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        {(router?.asPath?.includes("profile=") ||
          router?.asPath?.includes("post=")) && (
          <div className="sticky z-0 w-full h-fit flex flex-row items-start justify-start mr-0 gap-2">
            <div
              className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
              onClick={() =>
                router.push(
                  router?.asPath?.includes("&profile=")
                    ? router?.asPath.split("&profile=")[0]
                    : router?.asPath.split("&post=")[0]
                )
              }
            >
              <BiHomeHeart color="white" size={18} />
            </div>
            <div
              className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
              onClick={() => {
                (history.includes("#chat") && history.includes("&profile=")) ||
                history.includes("&post=")
                  ? router.push("#chat?option=history")
                  : router.back();
              }}
            >
              <AiFillFastBackward color="white" size={20} />
            </div>
          </div>
        )}
        {router?.asPath?.includes("profile=") ? (
          <Account
            dispatch={dispatch}
            profile={profile}
            profileCollections={profileCollections}
            router={router}
          />
        ) : (
          !router?.asPath?.includes("&profile=") &&
          !router.asPath?.includes("&post=") && (
            <div className="relative w-full h-fit flex flex-col sm:flex-row lg:flex-col stuck2:flex-row gap-3 sm:gap-10">
              <div className="overflow-x-auto">
                <QuickProfiles router={router} quickProfiles={quickProfiles} />
              </div>
              <div className="relative flex flex-col sm:flex-row lg:flex-col stuck2:flex-row gap-5 sm:gap-1 lg:gap-3 stuck2:gap-1 w-full sm:w-auto h-fit ml-auto sm:pt-0 pt-3">
                <SuperCreator
                  dispatch={dispatch}
                  openConnectModal={openConnectModal}
                  address={address}
                  lensProfile={lensProfile}
                />
                <Search
                  searchProfiles={searchProfiles}
                  profilesFound={profilesFound}
                  profilesOpenSearch={profilesOpenSearch}
                  router={router}
                  fetchMoreSearch={fetchMoreSearch}
                  hasMoreSearch={hasMoreSearch}
                  setProfilesOpenSearch={setProfilesOpenSearch}
                  setProfilesFound={setProfilesFound}
                />
              </div>
            </div>
          )
        )}
        {!router.asPath?.includes("&post=") ? (
          postsLoading ? (
            <div className="relative w-full h-auto flex flex-col gap-4 overflow-y-scroll">
              {Array.from({ length: 30 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
                    id="staticLoad"
                  ></div>
                );
              })}
            </div>
          ) : (
            <InfiniteScroll
              height={"40rem"}
              loader={""}
              hasMore={hasMore}
              next={fetchMore}
              dataLength={allPosts?.length}
              className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
              style={{ color: "#131313", fontFamily: "Digi Reg" }}
              scrollThreshold={0.9}
              scrollableTarget={"scrollableDiv"}
            >
              <div className="w-full h-full relative flex flex-col gap-4 pb-3">
                {allPosts?.map(
                  (publication: Post | Quote | Mirror, index: number) => {
                    return (
                      <div
                        className="relative w-full h-fit gap-2 flex flex-col"
                        key={index}
                      >
                        <FeedPublication
                          main={false}
                          setOpenComment={setOpenComment}
                          dispatch={dispatch}
                          publication={publication}
                          collect={collect}
                          mirror={mirror}
                          like={like}
                          interactionsLoading={interactionsLoading?.[index]}
                          address={address}
                          index={index}
                          openMirrorChoice={openMirrorChoice}
                          setOpenMirrorChoice={setOpenMirrorChoice}
                          router={router}
                        />
                        {index === commentOpen && (
                          <MakeComment
                            id={
                              publication?.__typename === "Mirror"
                                ? publication?.mirrorOn?.id
                                : publication?.id
                            }
                            postCollectGif={postCollectGif}
                            index={index}
                            enabledCurrencies={enabledCurrencies}
                            setMediaLoading={setMediaLoading}
                            mediaLoading={mediaLoading}
                            comment={comment}
                            commentDescription={commentDescription}
                            textElement={textElement}
                            handleCommentDescription={handleCommentDescription}
                            commentLoading={
                              interactionsLoading?.[index]?.comment
                            }
                            caretCoord={caretCoord}
                            mentionProfiles={mentionProfiles}
                            profilesOpen={profilesOpen}
                            handleMentionClick={handleMentionClick}
                            handleKeyDownDelete={handleKeyDownDelete}
                            handleLensSignIn={handleLensSignIn}
                            openConnectModal={openConnectModal}
                            address={address}
                            lensProfile={lensProfile}
                            dispatch={dispatch}
                            preElement={preElement}
                          />
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </InfiniteScroll>
          )
        ) : mainPostLoading ? (
          <div
            className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
            id="staticLoad"
          ></div>
        ) : (
          <>
            <FeedPublication
              dispatch={dispatch}
              openMirrorChoice={openMainMirrorChoice}
              setOpenMirrorChoice={setMainOpenMirrorChoice}
              publication={mainPost!}
              collect={collect}
              mirror={mirror}
              like={like}
              setOpenComment={setOpenComment}
              address={address}
              index={0}
              router={router}
              main={true}
              interactionsLoading={mainInteractionsLoading}
            />
            {0 === commentOpen && (
              <MakeComment
                id={mainPost?.id}
                index={0}
                postCollectGif={postCollectGif}
                setMediaLoading={setMainMediaLoading}
                mediaLoading={mainMediaLoading}
                preElement={preElement}
                comment={comment}
                commentDescription={commentDescription}
                textElement={textElement}
                handleCommentDescription={handleCommentDescription}
                commentLoading={mainInteractionsLoading?.comment}
                caretCoord={caretCoord}
                mentionProfiles={mentionProfiles}
                profilesOpen={profilesOpen}
                handleMentionClick={handleMentionClick}
                handleKeyDownDelete={handleKeyDownDelete}
                handleLensSignIn={handleLensSignIn}
                openConnectModal={openConnectModal}
                address={address}
                lensProfile={lensProfile}
                enabledCurrencies={enabledCurrencies}
                dispatch={dispatch}
                main={true}
              />
            )}
            {commentsLoading ? (
              <div className="relative w-full h-auto flex flex-col gap-4 overflow-y-scroll">
                {Array.from({ length: 1 }).map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
                      id="staticLoad"
                    ></div>
                  );
                })}
              </div>
            ) : (
              <InfiniteScroll
                height={"20rem"}
                loader={""}
                hasMore={hasMoreComments}
                next={fetchMoreComments}
                dataLength={commentors?.length}
                className={`relative w-full h-full max-w-full overflow-y-scroll grow`}
                style={{ color: "#131313", fontFamily: "Digi Reg" }}
                scrollThreshold={0.9}
                scrollableTarget={"scrollableDiv"}
              >
                <div className="w-full h-full relative flex flex-col gap-4 pb-3 min-w-full">
                  {commentors?.map((publication: Comment, index: number) => {
                    return (
                      <div
                        className="relative w-full h-fit flex flex-col gap-2"
                        key={index}
                      >
                        <FeedPublication
                          dispatch={dispatch}
                          openMirrorChoice={openMirrorChoice}
                          setOpenMirrorChoice={setOpenMirrorChoice}
                          publication={publication}
                          collect={collect}
                          mirror={mirror}
                          like={like}
                          address={address}
                          index={index}
                          router={router}
                          main={false}
                          setOpenComment={setOpenComment}
                          interactionsLoading={interactionsLoading?.[index]}
                        />
                        {index + 1 === Number(commentOpen) + 1 && (
                          <MakeComment
                            id={publication?.id}
                            index={index}
                            mediaLoading={mediaLoading}
                            setMediaLoading={setMediaLoading}
                            postCollectGif={postCollectGif}
                            comment={comment}
                            preElement={preElement}
                            commentDescription={commentDescription}
                            textElement={textElement}
                            handleCommentDescription={handleCommentDescription}
                            commentLoading={
                              interactionsLoading?.[index]?.comment
                            }
                            caretCoord={caretCoord}
                            mentionProfiles={mentionProfiles}
                            profilesOpen={profilesOpen}
                            handleMentionClick={handleMentionClick}
                            handleKeyDownDelete={handleKeyDownDelete}
                            handleLensSignIn={handleLensSignIn}
                            openConnectModal={openConnectModal}
                            address={address}
                            lensProfile={lensProfile}
                            enabledCurrencies={enabledCurrencies}
                            dispatch={dispatch}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </InfiniteScroll>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AllPosts;
