import { FunctionComponent } from "react";
import FeedPublication from "./FeedPublication";
import Comments from "./Comments";
import { AiFillFastBackward } from "react-icons/ai";
import { BiHomeHeart } from "react-icons/bi";
import { IndividualProps } from "../types/wavs.types";
import MakeComment from "./MakeComment";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Post, Quote, TriStateValue } from "@/components/Home/types/generated";

const Individual: FunctionComponent<IndividualProps> = ({
  dispatch,
  mainPost,
  feedType,
  address,
  followerOnlyMain,
  collectPost,
  mirrorPost,
  reactPost,
  mainPostLoading,
  commentAmounts,
  commentors,
  mirrorCommentLoading,
  reactCommentLoading,
  collectCommentLoading,
  followerOnlyComments,
  openPostMirrorChoice,
  setOpenPostMirrorChoice,
  openCommentMirrorChoice,
  setOpenCommentMirrorChoice,
  hasMoreComments,
  fetchMoreComments,
  commentsLoading,
  collectPostLoading,
  setCollectCommentLoading,
  setCollectPostLoading,
  setMirrorCommentLoading,
  setMirrorPostLoading,
  setReactCommentLoading,
  setReactPostLoading,
  mirrorPostLoading,
  reactPostLoading,
  commentOpen,
  commentPost,
  commentDescription,
  textElement,
  handleCommentDescription,
  commentLoading,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleGifSubmit,
  handleGif,
  results,
  handleSetGif,
  gifOpen,
  setGifOpen,
  handleKeyDownDelete,
  collectNotif,
  referral,
  setCollectible,
  collectibleDropDown,
  setCollectibleDropDown,
  collectible,
  setAudienceDropDown,
  audienceType,
  audienceTypes,
  chargeCollect,
  limit,
  limitedEdition,
  audienceDropDown,
  setAudienceType,
  setTimeLimit,
  timeLimit,
  timeLimitDropDown,
  setTimeLimitDropDown,
  setLimitedEdition,
  limitedDropDown,
  setLimitedDropDown,
  setReferral,
  setLimit,
  setChargeCollect,
  setCurrencyDropDown,
  chargeCollectDropDown,
  setChargeCollectDropDown,
  enabledCurrencies,
  enabledCurrency,
  currencyDropDown,
  setEnabledCurrency,
  value,
  setValue,
  handleLensSignIn,
  handleConnect,
  handleRemoveImage,
  videoLoading,
  profileId,
  uploadImages,
  uploadVideo,
  imageLoading,
  collectOpen,
  mappedFeaturedFiles,
  postImagesDispatched,
  individualAmounts,
  router,
  profileType,
  preElement,
  handleImagePaste,
  clientRendered,
}): JSX.Element => {
  const history = useSelector(
    (state: RootState) => state.app.historyURLReducer.value
  );
  return (
    <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
      <div className="sticky z-0 w-full h-fit flex flex-row items-start justify-start mr-0 gap-2">
        <div
          className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
          onClick={() => router.push(router.asPath.split("&post=")[0])}
        >
          <BiHomeHeart color="white" size={18} />
        </div>
        <div
          className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
          onClick={() => {
            history.includes("#chat") &&
            (history.includes("&profile=") || history.includes("&post="))
              ? router.push("#chat?option=history")
              : router.back();
          }}
        >
          <AiFillFastBackward color="white" size={20} />
        </div>
      </div>
      {!mainPostLoading ? (
        <div className="relative w-full h-fit gap-2 flex flex-col">
          <FeedPublication
            dispatch={dispatch}
            openMirrorChoice={openPostMirrorChoice}
            setOpenMirrorChoice={setOpenPostMirrorChoice}
            publication={mainPost}
            hasMirrored={individualAmounts?.hasMirrored}
            hasReacted={individualAmounts?.hasLiked}
            hasCollected={individualAmounts?.hasCollected}
            followerOnly={followerOnlyMain}
            collectPost={collectPost}
            mirrorPost={mirrorPost}
            reactPost={reactPost}
            address={address as any}
            index={0}
            mirrorLoading={mirrorPostLoading[0]}
            reactLoading={reactPostLoading[0]}
            collectLoading={collectPostLoading[0]}
            reactAmount={individualAmounts?.like}
            mirrorAmount={individualAmounts?.mirror}
            collectAmount={individualAmounts?.collect}
            commentAmount={individualAmounts?.comment}
            feedType={feedType}
            setCollectLoader={setCollectPostLoading}
            setMirrorLoader={setMirrorPostLoading}
            setReactLoader={setReactPostLoading}
            openComment={commentOpen}
            router={router}
            profileType={profileType}
          />
          {(mainPost?.__typename === "Mirror"
            ? mainPost?.mirrorOn?.id
            : mainPost?.id) === commentOpen && (
            <MakeComment
              preElement={preElement}
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
              handleConnect={handleConnect}
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
              canComment={
                mainPost?.__typename === "Mirror"
                  ? mainPost?.mirrorOn?.operations?.canComment ===
                    TriStateValue.No
                    ? false
                    : true
                  : (mainPost as Post | Quote)?.operations?.canComment ===
                    TriStateValue.No
                  ? false
                  : true
              }
              collectNotif={collectNotif}
              collectible={collectible}
              collectibleDropDown={collectibleDropDown}
              commentId={commentOpen}
              currencyDropDown={currencyDropDown}
              dispatch={dispatch}
              postImagesDispatched={postImagesDispatched}
              handleImagePaste={handleImagePaste}
              clientRendered={clientRendered}
            />
          )}
        </div>
      ) : (
        <div
          className="relative w-full h-60 rounded-md animate-pulse border border-white min-w-full opacity-70"
          id="staticLoad"
        ></div>
      )}
      <Comments
        dispatch={dispatch}
        commentors={commentors}
        commentAmounts={commentAmounts}
        collectPost={collectPost}
        mirrorPost={mirrorPost}
        reactPost={reactPost}
        openMirrorChoice={openCommentMirrorChoice}
        setOpenMirrorChoice={setOpenCommentMirrorChoice}
        address={address as `0x${string}`}
        mirrorLoading={mirrorCommentLoading}
        reactLoading={reactCommentLoading}
        collectLoading={collectCommentLoading}
        feedType={feedType}
        followerOnly={followerOnlyComments}
        fetchMoreComments={fetchMoreComments}
        hasMoreComments={hasMoreComments}
        commentsLoading={commentsLoading}
        setCollectLoader={setCollectCommentLoading}
        setMirrorLoader={setMirrorCommentLoading}
        setReactLoader={setReactCommentLoading}
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
        handleConnect={handleConnect}
        handleRemoveImage={handleRemoveImage}
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
        openComment={commentOpen}
        postImagesDispatched={postImagesDispatched}
        router={router}
        profileType={profileType}
        preElement={preElement}
        handleImagePaste={handleImagePaste}
        clientRendered={clientRendered}
      />
    </div>
  );
};

export default Individual;
