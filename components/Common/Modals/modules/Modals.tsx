import { useDispatch, useSelector } from "react-redux";
import IndexingModal from "./Indexer";
import Collect from "./Collect";
import Purchase from "./Purchase";
import useControls from "../../Video/hooks/useControls";
import { RootState } from "@/redux/store";
import { useAccount } from "wagmi";
import useConnect from "../../SideBar/hooks/useConnect";
import FollowerOnly from "./FollowerOnly";
import useFollowers from "../../Interactions/hooks/useFollowers";
import Claim from "./Claim";
import ImageLarge from "./ImageLarge";
import Error from "./Error";
import Success from "./Success";
import ImageViewerModal from "./ImageViewer";
import Who from "./Who";
import useWho from "../../Wavs/hooks/useWho";
import useReactions from "../../Wavs/hooks/useReactions";
import { useRouter } from "next/router";
import FullScreenVideo from "./FullScreenVideo";
import { useRef } from "react";
import FollowSuper from "./FollowSuper";
import useSuperCreator from "../../Wavs/hooks/useSuperCreator";
import Post from "./Post";
import useCollectOptions from "../../NFT/hooks/useCollectOptions";
import useImageUpload from "../../NFT/hooks/useImageUpload";
import useMakePost from "../../Wavs/hooks/usePost";
import Decrypt from "./Decrypt";
import IPFS from "./IPFS";
import useChannels from "../../SideBar/hooks/useChannels";
import useAllPosts from "../../Wavs/hooks/useAllPosts";
import { useConnectModal } from "@rainbow-me/rainbowkit";

const Modals = () => {
  const videoRef = useRef<HTMLDivElement>(null);
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const collectModal = useSelector(
    (state: RootState) => state.app.modalReducer
  );
  const purchaseModal = useSelector(
    (state: RootState) => state.app.purchaseReducer
  );
  const successModal = useSelector(
    (state: RootState) => state.app.successReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const errorModal = useSelector((state: RootState) => state.app.errorReducer);
  const ipfsModal = useSelector((state: RootState) => state.app.IPFSReducer);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );
  const collectModuleValues = useSelector(
    (state: RootState) => state.app.postCollectReducer
  );
  const followersModal = useSelector(
    (state: RootState) => state.app.followerOnlyReducer
  );
  const decrypt = useSelector((state: RootState) => state.app.decryptReducer);
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const claimModal = useSelector(
    (state: RootState) => state.app.noHandleReducer
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const imageFeedViewer = useSelector(
    (state: RootState) => state.app.imageFeedViewerReducer
  );
  const reaction = useSelector(
    (state: RootState) => state.app.reactionStateReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const makePost = useSelector((state: RootState) => state.app.makePostReducer);
  const rain = useSelector((state: RootState) => state.app.rainReducer.value);
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const superFollow = useSelector(
    (state: RootState) => state.app.superFollowReducer
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const {
    profile,
    followProfile,
    followLoading,
    approved,
    approveCurrency: approveFollowCurrency,
    unfollowProfile,
  } = useFollowers();
  const {
    collectInfoLoading: controlsCollectInfoLoading,
    approvalLoading,
    collectCommentLoading,
    approveCurrency,
    collectVideo,
    fullVideoRef,
    wrapperRef,
  } = useControls();
  const {
    collectInfoLoading: purchaseInfoLoading,
    approvalLoading: postApprovalLoading,
    collectFeedLoading,
    approveCurrency: postApproveCurrency,
    collectPost,
  } = useReactions();
  const router = useRouter();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { handleLensSignIn, signInLoading } = useConnect();
  const dispatch = useDispatch();
  const {
    reacters,
    mirrorers,
    collectors,
    getMorePostCollects,
    getMorePostMirrors,
    getMorePostReactions,
    mirrorInfoLoading,
    reactInfoLoading,
    collectInfoLoading,
    hasMoreReact,
    hasMoreCollect,
    hasMoreMirror,
  } = useWho();
  const { followSuper, superCreatorLoading, canvasRef } = useSuperCreator();
  const {
    postDescription,
    postLoading,
    handlePostDescription,
    textElement,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGif,
    handleGifSubmit,
    handleSetGif,
    results,
    setGifOpen,
    gifOpen,
    handleKeyDownDelete,
    handlePost,
    preElement,
    handleImagePaste,
  } = useMakePost();
  const {
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
  } = useCollectOptions();
  const {
    videoLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    clientRendered,
  } = useImageUpload();
  const { fetchMoreVideos, videosLoading, setVideosLoading } = useChannels();
  const { decryptCollections } = useAllPosts();

  return (
    <>
      {fullScreenVideo.value && (
        <FullScreenVideo
          dispatch={dispatch}
          mainVideo={mainVideo}
          streamRef={fullVideoRef}
          wrapperRef={wrapperRef}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          videoRef={videoRef}
          viewer={viewer}
          hasMore={hasMore}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
        />
      )}
      {reaction.open && (
        <Who
          accounts={
            reaction.type === "heart"
              ? reacters
              : reaction.type === "mirror"
              ? mirrorers
              : collectors
          }
          fetchMore={
            reaction.type === "heart"
              ? getMorePostReactions
              : reaction.type === "mirror"
              ? getMorePostMirrors
              : getMorePostCollects
          }
          loading={
            reaction.type === "heart"
              ? reactInfoLoading
              : reaction.type === "mirror"
              ? mirrorInfoLoading
              : collectInfoLoading
          }
          dispatch={dispatch}
          hasMore={
            reaction.type === "heart"
              ? hasMoreReact
              : reaction.type === "mirror"
              ? hasMoreMirror
              : hasMoreCollect
          }
          type={
            reaction.type === "heart" ? 0 : reaction.type === "collect" ? 1 : 2
          }
          router={router}
        />
      )}
      {purchaseModal?.open && (
        <Purchase
          dispatch={dispatch}
          collectInfoLoading={
            router.asPath?.includes("#chat")
              ? purchaseInfoLoading
              : controlsCollectInfoLoading
          }
          approvalLoading={
            router.asPath?.includes("#chat")
              ? postApprovalLoading
              : approvalLoading
          }
          address={address}
          collectModuleValues={collectModuleValues}
          lensProfile={lensProfile}
          collectComment={
            router.asPath?.includes("#chat") ? collectPost : collectVideo
          }
          collectLoading={
            router.asPath?.includes("#chat")
              ? collectFeedLoading[purchaseModal?.index!]
              : collectCommentLoading[purchaseModal?.index!]
          }
          approveCurrency={
            router.asPath?.includes("#chat")
              ? postApproveCurrency
              : approveCurrency
          }
          handleLensSignIn={handleLensSignIn}
          commentId={purchaseModal?.id}
        />
      )}
      {followersModal?.open && (
        <FollowerOnly
          profile={profile}
          followProfile={followProfile}
          followLoading={followLoading}
          approved={approved}
          approveCurrency={approveFollowCurrency}
          dispatch={dispatch}
          followDetails={followersModal}
          unfollowProfile={unfollowProfile}
        />
      )}
      {collectModal?.open && <Collect message={collectModal?.message} />}
      {superFollow?.open && (
        <FollowSuper
          dispatch={dispatch}
          followSuper={followSuper}
          quickProfiles={quickProfiles}
          router={router}
          rain={rain}
          superCreatorLoading={superCreatorLoading}
          canvasRef={canvasRef}
        />
      )}
      {imageViewer.value && (
        <ImageLarge
          mainImage={imageViewer.image}
          dispatch={dispatch}
          type={imageViewer.type}
        />
      )}
      {makePost.value && (
        <Post
          clientRendered={clientRendered}
          handlePost={handlePost}
          dispatch={dispatch}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          postDescription={postDescription}
          textElement={textElement}
          handlePostDescription={handlePostDescription}
          postLoading={postLoading}
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
          handleRemoveImage={handleRemoveImage}
          address={address}
          profileId={lensProfile}
          videoLoading={videoLoading}
          uploadImages={uploadImage}
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
          quote={makePost.quote}
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
          currencyDropDown={currencyDropDown}
          postImagesDispatched={postImagesDispatched}
          preElement={preElement}
          handleImagePaste={handleImagePaste}
        />
      )}
      {decrypt.open && (
        <Decrypt dispatch={dispatch} collections={decryptCollections} />
      )}
      {errorModal.value && <Error />}
      {ipfsModal.value && <IPFS />}
      {successModal.open && (
        <Success
          dispatch={dispatch}
          media={successModal.media}
          coinOp={successModal.coinOp}
        />
      )}
      {indexingModal?.value && (
        <IndexingModal message={indexingModal?.message} />
      )}
      {claimModal?.value && (
        <Claim
          dispatch={dispatch}
          message={claimModal.message}
          signInLoading={signInLoading}
          handleLensSignIn={handleLensSignIn}
          openConnectModal={openConnectModal}
          address={address}
          profileId={lensProfile}
        />
      )}
      {imageFeedViewer?.open && (
        <ImageViewerModal
          image={imageFeedViewer.image}
          type={imageFeedViewer.type}
          dispatch={dispatch}
        />
      )}
    </>
  );
};

export default Modals;
