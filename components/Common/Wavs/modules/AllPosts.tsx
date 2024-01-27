import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { AllPostsProps } from "../types/wavs.types";
import QuickProfiles from "./QuickProfiles";
import Search from "./Search";
import SuperCreator from "./SuperCreator";
import {
  Mirror,
  Post,
  Quote,
  TriStateValue,
} from "@/components/Home/types/generated";

const AllPosts: FunctionComponent<AllPostsProps> = ({
  hasMore,
  fetchMore,
  feedDispatch,
  dispatch,
  reactionAmounts,
  reactPost,
  collectPost,
  mirrorPost,
  commentPost,
  followerOnly,
  address,
  router,
  mirrorLoading,
  reactLoading,
  collectLoading,
  commentOpen,
  commentDescription,
  textElement,
  caretCoord,
  handleCommentDescription,
  openConnectModal,
  handleRemoveImage,
  commentLoading,
  mentionProfiles,
  profilesOpen,
  gifOpen,
  handleGifSubmit,
  handleSetGif,
  handleMentionClick,
  results,
  handleGif,
  value,
  uploadImages,
  uploadVideo,
  setGifOpen,
  handleKeyDownDelete,
  videoLoading,
  handleLensSignIn,
  referral,
  setLimit,
  imageLoading,
  mappedFeaturedFiles,
  collectOpen,
  enabledCurrencies,
  audienceDropDown,
  audienceType,
  setAudienceDropDown,
  limitedDropDown,
  limit,
  postImagesDispatched,
  setTimeLimit,
  setReferral,
  setAudienceType,
  setCollectible,
  setLimitedEdition,
  setLimitedDropDown,
  setCollectibleDropDown,
  setCurrencyDropDown,
  setEnabledCurrency,
  timeLimit,
  setTimeLimitDropDown,
  timeLimitDropDown,
  audienceTypes,
  limitedEdition,
  setValue,
  chargeCollect,
  enabledCurrency,
  chargeCollectDropDown,
  setChargeCollect,
  setChargeCollectDropDown,
  collectNotif,
  collectible,
  currencyDropDown,
  collectibleDropDown,
  quickProfiles,
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  fetchMoreSearch,
  hasMoreSearch,
  setProfilesFound,
  setProfilesOpenSearch,
  preElement,
  handleImagePaste,
  clientRendered,
  openMirrorChoice,
  setOpenMirrorChoice,
  lensProfile,
  feedType,
  profileType,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4 max-w-full">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
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
        <InfiniteScroll
          height={"40rem"}
          loader={""}
          hasMore={hasMore}
          next={fetchMore}
          dataLength={feedDispatch?.length}
          className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3">
            {feedDispatch?.map(
              (publication: Post | Quote | Mirror, index: number) => {
                return (
                  <div
                    className="relative w-full h-fit gap-2 flex flex-col"
                    key={index}
                  >
                    <FeedPublication
                      profileType={profileType}
                      feedType={feedType}
                      dispatch={dispatch}
                      publication={publication}
                      hasCollected={reactionAmounts.hasCollected[index]}
                      hasMirrored={reactionAmounts.hasMirrored[index]}
                      hasReacted={reactionAmounts.hasLiked[index]}
                      followerOnly={followerOnly[index]}
                      collectPost={collectPost}
                      mirrorPost={mirrorPost}
                      reactPost={reactPost}
                      address={address}
                      index={index}
                      openMirrorChoice={openMirrorChoice}
                      setOpenMirrorChoice={setOpenMirrorChoice}
                      mirrorLoading={mirrorLoading[index]}
                      reactLoading={reactLoading[index]}
                      collectLoading={collectLoading[index]}
                      reactAmount={reactionAmounts.like[index]}
                      mirrorAmount={reactionAmounts.mirror[index]}
                      collectAmount={reactionAmounts.collect[index]}
                      commentAmount={reactionAmounts.comment[index]}
                      openComment={commentOpen}
                      router={router}
                    />
                    {(publication?.__typename === "Mirror"
                      ? publication?.mirrorOn?.id
                      : publication?.id) === commentOpen && (
                      <MakeComment
                        commentPost={commentPost}
                        commentDescription={commentDescription}
                        textElement={textElement}
                        handleCommentDescription={handleCommentDescription}
                        commentLoading={commentLoading}
                        caretCoord={caretCoord}
                        mentionProfiles={mentionProfiles}
                        profilesOpen={profilesOpen}
                        handleMentionClick={handleMentionClick}
                        handleGifSubmit={handleGifSubmit}
                        handleGif={handleGif}
                        results={results}
                        handleSetGif={handleSetGif}
                        gifOpen={gifOpen}
                        setGifOpen={setGifOpen}
                        handleKeyDownDelete={handleKeyDownDelete}
                        handleLensSignIn={handleLensSignIn}
                        openConnectModal={openConnectModal}
                        handleRemoveImage={handleRemoveImage}
                        address={address}
                        lensProfile={lensProfile}
                        videoLoading={videoLoading}
                        uploadImages={uploadImages}
                        uploadVideo={uploadVideo}
                        imageLoading={imageLoading}
                        mappedFeaturedFiles={mappedFeaturedFiles}
                        collectOpen={collectOpen}
                        enabledCurrencies={enabledCurrencies}
                        audienceDropDown={audienceDropDown}
                        audienceType={audienceType}
                        setAudienceDropDown={setAudienceDropDown}
                        setAudienceType={setAudienceType}
                        value={value}
                        setChargeCollect={setChargeCollect}
                        setChargeCollectDropDown={setChargeCollectDropDown}
                        setCollectible={setCollectible}
                        setCollectibleDropDown={setCollectibleDropDown}
                        setCurrencyDropDown={setCurrencyDropDown}
                        setEnabledCurrency={setEnabledCurrency}
                        setLimit={setLimit}
                        setLimitedDropDown={setLimitedDropDown}
                        setLimitedEdition={setLimitedEdition}
                        setReferral={setReferral}
                        setTimeLimit={setTimeLimit}
                        setTimeLimitDropDown={setTimeLimitDropDown}
                        setValue={setValue}
                        enabledCurrency={enabledCurrency}
                        chargeCollect={chargeCollect}
                        chargeCollectDropDown={chargeCollectDropDown}
                        limit={limit}
                        limitedDropDown={limitedDropDown}
                        limitedEdition={limitedEdition}
                        timeLimit={timeLimit}
                        timeLimitDropDown={timeLimitDropDown}
                        audienceTypes={audienceTypes}
                        referral={referral}
                        collectNotif={collectNotif}
                        collectible={collectible}
                        collectibleDropDown={collectibleDropDown}
                        commentId={commentOpen}
                        currencyDropDown={currencyDropDown}
                        dispatch={dispatch}
                        postImagesDispatched={postImagesDispatched}
                        preElement={preElement}
                        handleImagePaste={handleImagePaste}
                        clientRendered={clientRendered}
                        canComment={
                          publication?.__typename === "Mirror"
                            ? publication?.mirrorOn?.operations?.canComment ===
                              TriStateValue.No
                              ? false
                              : true
                            : (publication as Post | Quote)?.operations
                                ?.canComment === TriStateValue.No
                            ? false
                            : true
                        }
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default AllPosts;
