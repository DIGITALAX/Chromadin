import { FunctionComponent, MouseEvent } from "react";
import { AiFillFastBackward } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import MakeComment from "./MakeComment";
import FeedPublication from "./FeedPublication";
import { ProfileFeedProps } from "../types/wavs.types";
import Account from "./Account";
import { BiHomeHeart } from "react-icons/bi";
import {
  Mirror,
  Post,
  Quote,
  TriStateValue,
} from "@/components/Home/types/generated";

const ProfileFeed: FunctionComponent<ProfileFeedProps> = ({
  dispatch,
  hasMoreProfile,
  fetchMoreProfile,
  profileDispatch,

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
  profile,
  profileCollections,
  preElement,
  openMirrorChoice,
  setOpenMirrorChoice,
  handleImagePaste,
  clientRendered,
  history,
  lensProfile,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-start justify-start gap-4 max-w-full">
      <div className="relative flex flex-col items-start justify-start gap-3 h-full w-full">
        <div className="sticky z-0 w-full h-fit flex flex-row items-start justify-start mr-0 gap-2">
          <div
            className="relative w-fit h-fit flex items-start cursor-pointer justify-start"
            onClick={() => router.push(router.asPath.split("&profile=")[0])}
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
        <Account
          dispatch={dispatch}
          profile={profile}
          profileCollections={profileCollections}
          router={router}
        />
        <InfiniteScroll
          height={"40rem"}
          loader={""}
          hasMore={hasMoreProfile}
          next={fetchMoreProfile}
          dataLength={profileDispatch?.length}
          className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
          style={{ color: "#131313", fontFamily: "Digi Reg" }}
          scrollThreshold={0.9}
          scrollableTarget={"scrollableDiv"}
        >
          <div className="w-full h-full relative flex flex-col gap-4 pb-3">
            {profileDispatch?.map(
              (publication: Post | Quote | Mirror, index: number) => {
                return (
                  <div
                    className="relative w-full h-fit gap-2 flex flex-col"
                    key={index}
                  >
                    <FeedPublication
                      openMirrorChoice={openMirrorChoice}
                      setOpenMirrorChoice={setOpenMirrorChoice}
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
                      router={router}
                      setCollectLoader={setCollectProfileLoading}
                      setMirrorLoader={setMirrorProfileLoading}
                      setReactLoader={setReactProfileLoading}
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

export default ProfileFeed;
