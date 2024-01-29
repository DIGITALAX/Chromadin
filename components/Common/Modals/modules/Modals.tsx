import { useDispatch, useSelector } from "react-redux";
import IndexingModal from "./Indexer";
import Collect from "./Collect";
import useControls from "../../Video/hooks/useControls";
import { RootState } from "@/redux/store";
import { useAccount } from "wagmi";
import useConnect from "../../SideBar/hooks/useConnect";
import useFollowCollect from "../../Interactions/hooks/useFollowCollect";
import Claim from "./Claim";
import Error from "./Error";
import Success from "./Success";
import ImageViewerModal from "./ImageViewer";
import Who from "./Who";
import useWho from "../../Wavs/hooks/useWho";
import { NextRouter } from "next/router";
import FullScreenVideo from "./FullScreenVideo";
import { useRef } from "react";
import FollowSuper from "./FollowSuper";
import useSuperCreator from "../../Wavs/hooks/useSuperCreator";
import Post from "./Post";
import usePost from "../../Wavs/hooks/usePost";
import useChannels from "../../SideBar/hooks/useChannels";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import PostCollectGif from "./PostCollectGif";
import FollowCollect from "./FollowCollect";
import { Post as PostType } from "@/components/Home/types/generated";

const Modals = ({ router }: { router: NextRouter }) => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { address, isConnected } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLDivElement>(null);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const who = useSelector((state: RootState) => state.app.whoReducer);
  const rain = useSelector((state: RootState) => state.app.rainReducer.value);
  const indexingModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const collectModal = useSelector(
    (state: RootState) => state.app.modalReducer
  );
  const successModal = useSelector(
    (state: RootState) => state.app.successReducer
  );
  const errorModal = useSelector((state: RootState) => state.app.errorReducer);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const allVideos = useSelector(
    (state: RootState) => state.app.channelsReducer
  );
  const enabledCurrencies = useSelector(
    (state: RootState) => state.app.enabledCurrenciesReducer.value
  );
  const followCollect = useSelector(
    (state: RootState) => state.app.followCollectReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const claimModal = useSelector(
    (state: RootState) => state.app.noHandleReducer
  );
  const videoInfo = useSelector(
    (state: RootState) => state.app.videoInfoReducer
  );
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const makePost = useSelector((state: RootState) => state.app.makePostReducer);
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const superFollow = useSelector(
    (state: RootState) => state.app.superFollowReducer
  );
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const {
    approved,
    transactionLoading,
    informationLoading,
    handleCollect,
    handleFollow,
    approveSpend,
    openMeasure,
    setOpenMeasure,
    handleGif,
    gifsLoading,
    handleUnfollow,
  } = useFollowCollect(
    dispatch,
    address,
    publicClient,
    postCollectGif,
    lensProfile,
    followCollect
  );
  const { fetchMoreVideos, videosLoading, setVideosLoading } = useChannels(
    dispatch,
    lensProfile,
    allVideos,
    fullScreenVideo,
    videoInfo
  );
  const { handleLensSignIn, signInLoading } = useConnect(
    router,
    address,
    isConnected,
    dispatch,
    connectModalOpen,
    publicClient,
    oracleData,
    openAccountModal,
    enabledCurrencies
  );
  const { fullVideoRef, wrapperRef } = useControls(
    dispatch,
    address,
    publicClient,
    fullScreenVideo,
    allVideos,
    postCollectGif,
    []
  );
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
  } = useWho(who);
  const { followSuper, superCreatorLoading, canvasRef } = useSuperCreator(
    publicClient,
    dispatch,
    address,
    rain,
    quickProfiles,
    lensProfile
  );
  const {
    postDescription,
    postLoading,
    handlePostDescription,
    textElement,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleKeyDownDelete,
    handlePost,
    preElement,
    mediaLoading,
    setMediaLoading,
  } = usePost(address, publicClient, dispatch, postCollectGif);

  return (
    <>
      {fullScreenVideo.open && (
        <FullScreenVideo
          dispatch={dispatch}
          allVideos={allVideos}
          streamRef={fullVideoRef}
          wrapperRef={wrapperRef}
          videoSync={fullScreenVideo}
          videoRef={videoRef}
          viewer={viewer}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
          hasMore={videoInfo?.hasMore}
        />
      )}
      {who.open && (
        <Who
          accounts={
            who?.type === "heart"
              ? reacters
              : who?.type === "mirror"
              ? mirrorers
              : collectors
          }
          fetchMore={
            who?.type === "heart"
              ? getMorePostReactions
              : who?.type === "mirror"
              ? getMorePostMirrors
              : getMorePostCollects
          }
          loading={
            who?.type === "heart"
              ? reactInfoLoading
              : who?.type === "mirror"
              ? mirrorInfoLoading
              : collectInfoLoading
          }
          dispatch={dispatch}
          hasMore={
            who?.type === "heart"
              ? hasMoreReact
              : who?.type === "mirror"
              ? hasMoreMirror
              : hasMoreCollect
          }
          type={who?.type === "heart" ? 0 : who?.type === "collect" ? 1 : 2}
          router={router}
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
      {makePost.value && (
        <Post
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
          handleKeyDownDelete={handleKeyDownDelete}
          address={address}
          lensProfile={lensProfile}
          postCollectGif={postCollectGif}
          mediaLoading={mediaLoading}
          setMediaLoading={setMediaLoading}
          quote={makePost?.quote as PostType}
          preElement={preElement}
        />
      )}
      {successModal.open && (
        <Success dispatch={dispatch} media={successModal.media} />
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
          lensProfile={lensProfile}
        />
      )}
      {imageViewer?.value && (
        <ImageViewerModal
          image={imageViewer.image}
          type={imageViewer.type}
          dispatch={dispatch}
        />
      )}
      {followCollect?.type && (
        <FollowCollect
          handleUnfollow={handleUnfollow}
          dispatch={dispatch}
          type={followCollect?.type!}
          collect={followCollect?.collect}
          follower={followCollect?.follower}
          handleCollect={handleCollect}
          handleFollow={handleFollow}
          informationLoading={informationLoading}
          transactionLoading={transactionLoading}
          approved={approved}
          approveSpend={approveSpend}
        />
      )}
      {postCollectGif?.type !== undefined && (
        <PostCollectGif
          dispatch={dispatch}
          postCollectGif={postCollectGif}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={enabledCurrencies}
          searchGifLoading={gifsLoading}
          handleGif={handleGif}
        />
      )}
      {errorModal.value && <Error />}
    </>
  );
};

export default Modals;
