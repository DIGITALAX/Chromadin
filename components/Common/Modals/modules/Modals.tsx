import { useDispatch, useSelector } from "react-redux";
import IndexingModal from "./Indexer";
import Collect from "./Collect";
import { RootState } from "@/redux/store";
import { useAccount } from "wagmi";
import useConnect from "../../SideBar/hooks/useConnect";
import useFollowCollect from "../../Interactions/hooks/useFollowCollect";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import Claim from "./Claim";
import Error from "./Error";
import { useTranslation } from "next-i18next";
import Success from "./Success";
import ImageViewerModal from "./ImageViewer";
import Who from "./Who";
import useWho from "../../Wavs/hooks/useWho";
import { NextRouter } from "next/router";
import FollowSuper from "./FollowSuper";
import useSuperCreator from "../../Wavs/hooks/useSuperCreator";
import Post from "./Post";
import usePost from "../../Wavs/hooks/usePost";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import PostCollectGif from "./PostCollectGif";
import FollowCollect from "./FollowCollect";
import { Post as PostType } from "@/components/Home/types/generated";
import Quests from "./Quests";
import useQuests from "../../Video/hooks/useQuests";
import Metrics from "./Metrics";
import { apolloClient } from "@/lib/lens/client";
import QuestGates from "./QuestGates";
import QuestSuccess from "./QuestSuccess";

const Modals = ({ router }: { router: NextRouter }) => {
  const { t } = useTranslation("common");
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const kinoraDispatch = new KinoraDispatch({
    playerAuthedApolloClient: apolloClient,
  });
  const { address, isConnected } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const dispatch = useDispatch();
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const metrics = useSelector((state: RootState) => state.app.metricsReducer);
  const questSuccess = useSelector(
    (state: RootState) => state.app.questSuccessReducer
  );
  const quests = useSelector((state: RootState) => state.app.questReducer);
  const who = useSelector((state: RootState) => state.app.whoReducer);
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
  const questGates = useSelector(
    (state: RootState) => state.app.questGatesReducer
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
  const imageViewer = useSelector(
    (state: RootState) => state.app.imageViewerReducer
  );
  const makePost = useSelector((state: RootState) => state.app.makePostReducer);
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
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
  const { allVideoQuests, questsLoading, handleJoinQuest, joinLoading } =
    useQuests(
      quests,
      lensProfile,
      dispatch,
      publicClient,
      address,
      kinoraDispatch
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
  const { followSuper, superCreatorLoading, followedSuper } = useSuperCreator(
    publicClient,
    dispatch,
    address,
    quickProfiles,
    lensProfile,
    t
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
  } = usePost(address, publicClient, dispatch, postCollectGif, t);

  return (
    <>
      {metrics?.open && (
        <Metrics
          mainVideo={allVideos?.main}
          dispatch={dispatch}
          metricsOpen={metrics?.open}
          lensProfile={lensProfile}
          address={address}
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
      {superFollow?.open && (
        <FollowSuper
          dispatch={dispatch}
          followSuper={followSuper}
          quickProfiles={quickProfiles}
          router={router}
          followedSuper={followedSuper}
          superCreatorLoading={superCreatorLoading}
        />
      )}
      {makePost.value && (
        <Post
          handlePost={handlePost}
          dispatch={dispatch}
          t={t}
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
      {claimModal?.value && (
        <Claim
          t={t}
          dispatch={dispatch}
          message={claimModal.message}
          signInLoading={signInLoading}
          handleLensSignIn={handleLensSignIn}
          openConnectModal={openConnectModal}
          address={address}
          lensProfile={lensProfile}
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
          t={t}
          postCollectGif={postCollectGif}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={enabledCurrencies}
          searchGifLoading={gifsLoading}
          handleGif={handleGif}
        />
      )}
      {quests?.open && (
        <Quests
          address={address}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          lensProfile={lensProfile}
          signInLoading={signInLoading}
          handleJoinQuest={handleJoinQuest}
          joinLoading={joinLoading}
          dispatch={dispatch}
          quests={allVideoQuests}
          video={quests?.video!}
          questsLoading={questsLoading}
        />
      )}
      {questGates?.gates && (
        <QuestGates gates={questGates?.gates} dispatch={dispatch} />
      )}
      {indexingModal?.value && (
        <IndexingModal message={indexingModal?.message} />
      )}
      {imageViewer?.value && (
        <ImageViewerModal
          image={imageViewer.image}
          type={imageViewer.type}
          dispatch={dispatch}
        />
      )}
      {collectModal?.open && (
        <Collect message={collectModal?.message} dispatch={dispatch} />
      )}
      {questSuccess?.open && (
        <QuestSuccess dispatch={dispatch} image={questSuccess?.image} />
      )}
      {errorModal.value && <Error dispatch={dispatch} />}
    </>
  );
};

export default Modals;
