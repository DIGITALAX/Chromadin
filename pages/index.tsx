import SideBar from "@/components/Common/SideBar/modules/SideBar";
import { NextPage } from "next";
import Head from "next/head";
import NFT from "@/components/Common/NFT/modules/NFT";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Interactions from "@/components/Common/Interactions/modules/Interactions";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Switcher from "@/components/Common/SideBar/modules/Switcher";
import Connect from "@/components/Common/SideBar/modules/Connect";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import Channels from "@/components/Common/SideBar/modules/Channels";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import Tabs from "@/components/Common/SideBar/modules/Tabs";
import { useEffect, useState } from "react";
import { NextRouter } from "next/router";
import useControls from "@/components/Common/Video/hooks/useControls";
import useInteractions from "@/components/Common/Interactions/hooks/useInteractions";
import useDrop from "@/components/Home/hooks/useDrop";
import RouterChange from "@/components/Common/Loading/RouterChange";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import useFulfillment from "@/components/Common/Interactions/hooks/useFulfillment";
import useHistory from "@/components/Common/Interactions/hooks/useHistory";
import useStats from "@/components/Common/Sampler/hooks/useStats";
import useViewer from "@/components/Home/hooks/useViewer";
import useSearch from "@/components/Common/Wavs/hooks/useSearch";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import { Viewer } from "@/components/Common/Interactions/types/interactions.types";
import Video from "@/components/Common/Video/modules/Video";
import SwitchView from "@/components/Home/SwitchView";
import { useTranslation } from "next-i18next";

const Home: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const { t, i18n } = useTranslation("common");
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { address, isConnected } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { connectModalOpen } = useConnectModal();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const allVideos = useSelector(
    (state: RootState) => state.app.channelsReducer
  );
  const options = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const videoInfo = useSelector(
    (state: RootState) => state.app.videoInfoReducer
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const historyURL = useSelector(
    (state: RootState) => state.app.historyURLReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const action = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const filters = useSelector((state: RootState) => state.app.filterReducer);
  const collectionInfo = useSelector(
    (state: RootState) => state.app.collectionInfoReducer
  );
  const enabledCurrencies = useSelector(
    (state: RootState) => state.app.enabledCurrenciesReducer.value
  );
  const sampler = useSelector((state: RootState) => state.app.samplerReducer);
  const isCreator = useSelector(
    (state: RootState) => state.app.isCreatorReducer.value
  );
  const historyData = useSelector(
    (state: RootState) => state.app.historyDataReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const dispatch = useDispatch();
  const { handleLensSignIn, handleLogout, chosenLanguage, setChosenLanguage } =
    useConnect(
      router,
      address,
      isConnected,
      dispatch,
      connectModalOpen,
      publicClient,
      oracleData,
      openAccountModal,
      enabledCurrencies,
      t,
      i18n
    );
  const { openConnectModal } = useConnectModal();
  const {
    setDropDownPriceSort,
    dropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  } = useViewer(router, dispatch, quickProfiles, lensProfile);
  const {
    collectionsLoading,
    moreCollectionsLoading,
    handleGetMoreCollections,
  } = useDrop(router, dispatch, collectionInfo, lensProfile);
  const {
    currency,
    setCurrency,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  } = useFulfillment(
    publicClient,
    dispatch,
    address,
    collectionInfo?.main!,
    oracleData,
    t
  );
  const {
    historyLoading,
    historySwitch,
    setHistorySwitch,
    getMoreBuyerHistory,
    getMoreUserHistory,
  } = useHistory(
    address,
    dispatch,
    historyURL,
    options,
    indexModal?.message,
    historyData
  );
  const { statsLoading, setCanvas, canvas } = useStats(
    dispatch,
    viewer,
    sampler?.values?.stats
  );
  const {
    postsLoading,
    fetchMore,
    postInfo,
    allPosts,
    postCommentsLoading,
    mainPost,
    mainPostLoading,
    postCommentInfo,
    mainInteractionsLoading,
    postMediaLoading,
    setPostMediaLoading,
    mainMediaLoading,
    setMainMediaLoading,
    postInteractionsLoading,
    commentDetails,
    dispatchProfile,
    profileCollections,
    postCaretCoord,
    postProfilesOpen,
    openMainMirrorChoice,
    setMainOpenMirrorChoice,
    handleMentionClickPost,
    handleKeyDownDeletePost,
    handlePostCommentDescription,
    fetchMorePostComments,
    setOpenComment,
    openComment,
    textElementPost,
    preElementPost,
    mentionProfilesPost,
    openPostMirrorChoice,
    setPostOpenMirrorChoice,
    mainPostComments,
    mirrorPost,
    likePost,
    collectPost,
    commentPost,
  } = useAllPosts(
    router,
    lensProfile,
    viewer,
    dispatch,
    address,
    publicClient,
    postCollectGif,
    t
  );
  const {
    commentors,
    collectors,
    getMorePostComments,
    commentsLoading,
    collectsLoading,
    getMorePostCollects,
    collectInfo,
    commentInfo,
    secondaryComment,
    setSecondaryComment,
    setCommentors,
    getPostComments,
  } = useInteractions(lensProfile, allVideos?.main!);
  const {
    volume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    collect,
    mirror,
    like,
    handleVolumeChange,
    wrapperRef,
    progressRef,
    handleSeek,
    interactionsLoading,
    handleMentionClick,
    comment,
    preElement,
    textElement,
    profilesOpen,
    mentionProfiles,
    handleKeyDownDelete,
    handleCommentDescription,
    controlCaretCoord,
    controlCommentDetails,
    controlInteractionsLoading,
    controlMediaLoading,
    setControlMediaLoading,
    videoControlsInfo,
    setVideoControlsInfo,
  } = useControls(
    dispatch,
    address,
    publicClient,
    allVideos,
    postCollectGif,
    t,
    router,
    commentors,
    setCommentors,
    getPostComments,
    setSecondaryComment
  );
  const { tab, setTab, fetchMoreVideos, videosLoading, setVideosLoading } =
    useChannels(
      dispatch,
      lensProfile,
      allVideos,
      videoInfo,
      setVideoControlsInfo,
      router
    );
  const {
    searchProfiles,
    profilesFound,
    profilesOpenSearch,
    fetchMoreSearch,
    hasMoreSearch,
    setProfilesOpenSearch,
    setProfilesFound,
  } = useSearch(router, dispatch);

  const [globalLoading, setGlobalLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      if (!collectionsLoading && !videosLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [collectionsLoading, videosLoading]);

  if (!globalLoading) {
    return (
      <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda">
        <Head>
          <title>Chromadin</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="relative w-full h-full flex flex-row xl:flex-nowrap flex-wrap">
          <div className="relative w-full h-fit flex lg:hidden">
            <Switcher t={t} router={router} options={options} />
          </div>
          <div className="relative w-full h-full flex flex-row items-center">
            <div className="relative w-fit h-full hidden lg:flex">
              <SideBar
                t={t}
                i18n={i18n}
                chosenLanguage={chosenLanguage}
                setChosenLanguage={setChosenLanguage}
                hasMoreVideos={videoInfo?.hasMore}
                secondaryComment={secondaryComment}
                setSecondaryComment={setSecondaryComment}
                handleLogout={handleLogout}
                openConnectModal={openConnectModal}
                connected={walletConnected}
                handleLensSignIn={handleLensSignIn}
                profile={lensProfile}
                tab={tab}
                setTab={setTab}
                collectionInfo={collectionInfo}
                viewer={viewer}
                dispatch={dispatch}
                allVideos={allVideos}
                options={options}
                videoSync={videoControlsInfo}
                setVideoSync={setVideoControlsInfo}
                fetchMoreVideos={fetchMoreVideos}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsLoading}
                hasMoreComments={commentInfo?.hasMore}
                mirror={mirror}
                collect={collect}
                like={like}
                interactionsLoading={interactionsLoading}
                router={router}
                collectors={collectors}
                collectsLoading={collectsLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={collectInfo?.hasMore}
                currency={currency}
                setCurrency={setCurrency}
                totalAmount={totalAmount}
                approved={approved}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                address={address}
                historyData={historyData}
                historyLoading={historyLoading}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                isCreator={isCreator}
                action={action}
              />
            </div>
            <div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
              <div className="flex flex-col w-full h-full">
                <Video
                  router={router}
                  viewer={viewer}
                  setVideoControlsInfo={setVideoControlsInfo}
                  hasMore={videoInfo?.hasMore}
                  volume={volume}
                  handleVolumeChange={handleVolumeChange}
                  volumeOpen={volumeOpen}
                  setVolumeOpen={setVolumeOpen}
                  handleHeart={handleHeart}
                  mirror={mirror}
                  collect={collect}
                  like={like}
                  interactionsLoading={controlInteractionsLoading}
                  lensProfile={lensProfile}
                  allVideos={allVideos}
                  wrapperRef={wrapperRef}
                  progressRef={progressRef}
                  handleSeek={handleSeek}
                  videoSync={videoControlsInfo}
                  fetchMoreVideos={fetchMoreVideos}
                  videosLoading={videosLoading}
                  setVideosLoading={setVideosLoading}
                  dispatch={dispatch}
                />
                <SwitchView
                  like={likePost}
                  t={t}
                  mirror={mirrorPost}
                  allPosts={allPosts}
                  mediaLoading={postMediaLoading}
                  setMediaLoading={setPostMediaLoading}
                  dispatch={dispatch}
                  viewer={viewer}
                  filters={filters}
                  setDropDownDateSort={setDropDownDateSort}
                  searchOpen={searchOpen}
                  searchResults={searchResults}
                  hasMoreComments={postCommentInfo?.hasMore}
                  fetchMoreComments={fetchMorePostComments}
                  setOpenComment={setOpenComment}
                  setMainOpenMirrorChoice={setMainOpenMirrorChoice}
                  postCollectGif={postCollectGif}
                  openMainMirrorChoice={openMainMirrorChoice}
                  mainMediaLoading={mainMediaLoading}
                  setMainMediaLoading={setMainMediaLoading}
                  commentsLoading={commentsLoading}
                  setDropDownPriceSort={setDropDownPriceSort}
                  handleGetMoreCollections={handleGetMoreCollections}
                  handleSearch={handleSearch}
                  handleSearchChoose={handleSearchChoose}
                  collectionInfo={collectionInfo}
                  dropDownDateSort={dropDownDateSort}
                  dropDownPriceSort={dropDownPriceSort}
                  collectionsLoading={collectionsLoading}
                  moreCollectionsLoading={moreCollectionsLoading}
                  graphData={sampler}
                  statsLoading={statsLoading}
                  interactionsLoading={postInteractionsLoading}
                  mainInteractionsLoading={mainInteractionsLoading}
                  setCanvas={setCanvas}
                  canvas={canvas}
                  postsLoading={postsLoading}
                  hasMore={postInfo?.hasMore}
                  fetchMore={fetchMore}
                  address={address}
                  mainPost={mainPost}
                  mainPostLoading={mainPostLoading}
                  commentors={mainPostComments}
                  openComment={openComment}
                  comment={commentPost}
                  collect={collectPost}
                  commentDescription={commentDetails?.description}
                  handleCommentDescription={handlePostCommentDescription}
                  commentLoading={postCommentsLoading}
                  caretCoord={postCaretCoord}
                  profilesOpen={postProfilesOpen}
                  handleMentionClick={handleMentionClickPost}
                  handleKeyDownDelete={handleKeyDownDeletePost}
                  quickProfiles={quickProfiles}
                  profileCollections={profileCollections}
                  searchProfiles={searchProfiles}
                  profilesFound={profilesFound}
                  profilesOpenSearch={profilesOpenSearch}
                  fetchMoreSearch={fetchMoreSearch}
                  hasMoreSearch={hasMoreSearch}
                  setProfilesOpenSearch={setProfilesOpenSearch}
                  setProfilesFound={setProfilesFound}
                  profile={dispatchProfile}
                  textElement={textElementPost}
                  preElement={preElementPost}
                  mentionProfiles={mentionProfilesPost}
                  enabledCurrencies={enabledCurrencies}
                  handleLensSignIn={handleLensSignIn}
                  openConnectModal={openConnectModal}
                  lensProfile={lensProfile}
                  openMirrorChoice={openPostMirrorChoice}
                  setOpenMirrorChoice={setPostOpenMirrorChoice}
                  router={router}
                  history={historyURL}
                />
              </div>
              {viewer !== Viewer.Sampler && viewer !== Viewer.Chat && (
                <NFT
                  t={t}
                  postCollectGif={postCollectGif}
                  setMediaLoading={setControlMediaLoading}
                  mediaLoading={controlMediaLoading}
                  lensProfile={lensProfile}
                  mainNFT={collectionInfo?.main}
                  viewer={viewer}
                  mainVideo={allVideos?.main!}
                  interactionsLoading={controlInteractionsLoading}
                  connected={walletConnected}
                  comment={comment}
                  handleLensSignIn={handleLensSignIn}
                  openConnectModal={openConnectModal}
                  commentDetails={controlCommentDetails}
                  handleCommentDescription={handleCommentDescription}
                  textElement={textElement}
                  caretCoord={controlCaretCoord}
                  mentionProfiles={mentionProfiles}
                  profilesOpen={profilesOpen}
                  handleMentionClick={handleMentionClick}
                  secondaryComment={secondaryComment}
                  dispatch={dispatch}
                  handleKeyDownDelete={handleKeyDownDelete}
                  preElement={preElement}
                  collectionsLoading={collectionsLoading}
                  router={router}
                />
              )}
            </div>
          </div>
          <div className="w-full h-fit flex flex-col lg:hidden">
            <Connect
              i18n={i18n}
              router={router}
              chosenLanguage={chosenLanguage}
              setChosenLanguage={setChosenLanguage}
              handleLogout={handleLogout}
              openConnectModal={openConnectModal}
              connected={walletConnected}
              handleLensSignIn={handleLensSignIn}
              profile={lensProfile}
              t={t}
            />
            <Tabs t={t} tab={tab} setTab={setTab} viewer={viewer} />
            {tab === 0 ? (
              <Channels
                router={router}
                dispatch={dispatch}
                allVideos={allVideos}
                videoSync={videoControlsInfo}
                hasMore={videoInfo?.hasMore}
                fetchMoreVideos={fetchMoreVideos}
                setVideoSync={setVideoControlsInfo}
              />
            ) : (
              <Interactions
                interactionsLoading={interactionsLoading}
                collectionInfo={collectionInfo}
                secondaryComment={secondaryComment}
                setSecondaryComment={setSecondaryComment}
                viewer={viewer}
                historyData={historyData}
                commentors={commentors}
                t={t}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsLoading}
                allVideos={allVideos}
                hasMoreComments={commentInfo?.hasMore}
                mirror={mirror}
                collect={collect}
                like={like}
                dispatch={dispatch}
                lensProfile={lensProfile}
                router={router}
                collectors={collectors}
                collectLoading={collectsLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={collectInfo?.hasMore}
                currency={currency}
                setCurrency={setCurrency}
                totalAmount={totalAmount}
                approved={approved}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                address={address}
                historyLoading={historyLoading}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                isCreator={isCreator}
                action={action}
              />
            )}
          </div>
          {viewer !== Viewer.Sampler && viewer !== Viewer.Chat && (
            <div className="w-fit h-full hidden xl:flex">
              <Interactions
                t={t}
                interactionsLoading={interactionsLoading}
                collectionInfo={collectionInfo}
                secondaryComment={secondaryComment}
                setSecondaryComment={setSecondaryComment}
                viewer={viewer}
                historyData={historyData}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsLoading}
                allVideos={allVideos}
                hasMoreComments={commentInfo?.hasMore}
                mirror={mirror}
                collect={collect}
                like={like}
                dispatch={dispatch}
                lensProfile={lensProfile}
                router={router}
                collectors={collectors}
                collectLoading={collectsLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={collectInfo?.hasMore}
                currency={currency}
                setCurrency={setCurrency}
                totalAmount={totalAmount}
                approved={approved}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                address={address}
                historyLoading={historyLoading}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                isCreator={isCreator}
                action={action}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return <RouterChange />;
};

export default Home;

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
