import FeedPublication from "@/components/Common/Wavs/modules/FeedPublication";
import MakeComment from "@/components/Common/Wavs/modules/MakeComment";
import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AutoProfileFeedProps } from "../types/autograph.types";
import {
  Mirror,
  Post,
  Quote,
  TriStateValue,
} from "@/components/Home/types/generated";

const Encrypted: FunctionComponent<AutoProfileFeedProps> = ({
  dispatch,
  hasMoreProfile,
  fetchMoreProfile,
  profileFeed,
  feedType,
  profileAmounts,
  collectPost,
  mirrorPost,
  reactPost,
  commentPost,
  commentOpen,
  router,
  address,
  followerOnly,
  mirrorLoading,
  reactLoading,
  collectLoading,
  handleCommentDescription,
  textElement,
  commentDescription,
  profileId,
  videoLoading,
  handleSetGif,
  gifOpen,
  setGifOpen,
  postImagesDispatched,
  currencyDropDown,
  setCurrencyDropDown,
  setEnabledCurrency,
  commentLoading,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleGif,
  handleGifSubmit,
  results,
  handleKeyDownDelete,
  handleLensSignIn,
  openConnectModal,
  handleRemoveImage,
  uploadImages,
  setCollectibleDropDown,
  uploadVideo,
  imageLoading,
  mappedFeaturedFiles,
  value,
  collectOpen,
  setValue,
  limit,
  setLimit,
  collectibleDropDown,
  setCollectible,
  enabledCurrencies,
  audienceDropDown,
  audienceType,
  setAudienceDropDown,
  setAudienceType,
  setChargeCollect,
  referral,
  enabledCurrency,
  chargeCollect,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  collectible,
  limitedDropDown,
  limitedEdition,
  setLimitedDropDown,
  setLimitedEdition,
  timeLimit,
  timeLimitDropDown,
  setTimeLimit,
  setTimeLimitDropDown,
  setReferral,
  collectNotif,
  audienceTypes,
  setCollectProfileLoading,
  setMirrorProfileLoading,
  setReactProfileLoading,
  profileType,
  preElement,
  handleImagePaste,
  decryptPost,
  decryptLoading,
  clientRendered,
  openMirrorChoice,
  setOpenMirrorChoice,
}): JSX.Element => {
  return (
    <InfiniteScroll
      height={"20rem"}
      loader={<></>}
      hasMore={hasMoreProfile}
      next={fetchMoreProfile}
      dataLength={profileFeed?.length}
      className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
      style={{ color: "#131313", fontFamily: "Digi Reg" }}
      scrollThreshold={0.9}
      scrollableTarget={"scrollableDiv"}
    >
      <div className="w-full h-full relative flex flex-col gap-4 pb-3">
        {profileFeed?.map(
          (publication: Post | Mirror | Quote, index: number) => {
            return (
              <div
                className="relative w-full h-fit gap-2 flex flex-col"
                key={index}
              >
                <FeedPublication
                  dispatch={dispatch}
                  publication={publication}
                  hasMirrored={profileAmounts.hasMirrored[index]}
                  hasReacted={profileAmounts.hasLiked?.[index]}
                  hasCollected={profileAmounts.hasCollected[index]}
                  followerOnly={followerOnly[index]}
                  collectPost={collectPost}
                  mirrorPost={mirrorPost}
                  reactPost={reactPost}
                  address={address}
                  index={index}
                  mirrorLoading={mirrorLoading[index]}
                  reactLoading={reactLoading[index]}
                  collectLoading={collectLoading[index]}
                  reactAmount={profileAmounts.like[index]}
                  mirrorAmount={profileAmounts.mirror[index]}
                  collectAmount={profileAmounts.collect[index]}
                  commentAmount={profileAmounts.comment[index]}
                  openComment={commentOpen}
                  feedType={feedType}
                  router={router}
                  setCollectLoader={setCollectProfileLoading}
                  setMirrorLoader={setMirrorProfileLoading}
                  setReactLoader={setReactProfileLoading}
                  profileType={profileType}
                  decryptPost={decryptPost}
                  decryptLoading={decryptLoading}
                  openMirrorChoice={openMirrorChoice}
                  setOpenMirrorChoice={setOpenMirrorChoice}
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
                    profileId={profileId}
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
  );
};

export default Encrypted;
