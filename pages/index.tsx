import SideBar from "@/components/Common/SideBar/modules/SideBar";
import { NextPage } from "next";
import Head from "next/head";
import NFT from "@/components/Common/NFT/modules/NFT";
import View from "@/components/Home/View";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Interactions from "@/components/Common/Interactions/modules/Interactions";
import Switcher from "@/components/Common/SideBar/modules/Switcher";
import Connect from "@/components/Common/SideBar/modules/Connect";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import Channels from "@/components/Common/SideBar/modules/Channels";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import Tabs from "@/components/Common/SideBar/modules/Tabs";
import { useEffect, useState } from "react";
import { setHistoryURLRedux } from "@/redux/reducers/historyURLSlice";
import { NextRouter } from "next/router";
import useControls from "@/components/Common/Video/hooks/useControls";
import useInteractions from "@/components/Common/Interactions/hooks/useInteractions";
import useDrop from "@/components/Home/hooks/useDrop";
import useCommentNFT from "@/components/Common/NFT/hooks/useComment";
import useCommentWav from "@/components/Common/Wavs/hooks/useComment";
import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import RouterChange from "@/components/Common/Loading/RouterChange";
import { TriStateValue } from "@/components/Home/types/generated";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount, useNetwork } from "wagmi";
import useFulfillment from "@/components/Common/Interactions/hooks/useFulfillment";
import useHistory from "@/components/Common/Interactions/hooks/useHistory";
import useStats from "@/components/Common/Sampler/hooks/useStats";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import useViewer from "@/components/Home/hooks/useViewer";
import useSearch from "@/components/Common/Wavs/hooks/useSearch";
import useProfileFeed from "@/components/Common/Wavs/hooks/useProfileFeed";
import useIndividual from "@/components/Common/Wavs/hooks/useIndividual";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";

const Home: NextPage<{ router: NextRouter; client: LitNodeClient }> = ({
  router,
  client,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { openChainModal } = useChainModal();
  const { connectModalOpen } = useConnectModal();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const decryptScrollPos = useSelector(
    (state: RootState) => state.app.decryptScrollPosReducer.value
  );
  const commentAmounts = useSelector(
    (state: RootState) => state.app.commentFeedCountReducer
  );
  const makePost = useSelector((state: RootState) => state.app.makePostReducer);
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const options = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const indexModal = useSelector(
    (state: RootState) => state.app.indexModalReducer
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const decryptPaginated = useSelector(
    (state: RootState) => state.app.decryptPaginatedReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const individualCount = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const decryptProfileFeedCount = useSelector(
    (state: RootState) => state.app.decryptProfileFeedCountReducer
  );
  const decryptProfileFeed = useSelector(
    (state: RootState) => state.app.decryptProfileFeedReducer.value
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );
  const history = useSelector(
    (state: RootState) => state.app.historyURLReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const action = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
  );
  const encryptedInformation = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer.information
  );
  const reactionFeedCount = useSelector(
    (state: RootState) => state.app.reactionFeedCountReducer
  );
  const rates = useSelector((state: RootState) => state.app.ratesReducer.value);
  const stats = useSelector((state: RootState) => state.app.statsReducer.value);
  const pies = useSelector((state: RootState) => state.app.piesReducer.value);
  const priceFilter = useSelector(
    (state: RootState) => state.app.priceFilterReducer
  );
  const commentsDispatch = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const dateFilter = useSelector(
    (state: RootState) => state.app.dateFilterReducer
  );
  const graphs = useSelector(
    (state: RootState) => state.app.graphReducer.value
  );
  const comments = useSelector(
    (state: RootState) => state.app.commentReducer.value
  );
  const feedId = useSelector(
    (state: RootState) => state.app.feedReactIdReducer
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const decryptFeed = useSelector(
    (state: RootState) => state.app.decryptFeedReducer.value
  );
  const videoCount = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const historyReducer = useSelector(
    (state: RootState) => state.app.historyReducer.value
  );
  const collections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const decrypt = useSelector((state: RootState) => state.app.decryptReducer);
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const historyPagination = useSelector(
    (state: RootState) => state.app.historyPaginationReducer
  );
  const filterDecrypt = useSelector(
    (state: RootState) => state.app.filterDecryptReducer.value
  );
  const feed = useSelector((state: RootState) => state.app.feedReducer.value);
  const buyerPagination = useSelector(
    (state: RootState) => state.app.buyerHistoryPaginationReducer
  );
  const dispatchProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const decryptProfilePageData = useSelector(
    (state: RootState) => state.app.decryptProfilePaginatedReducer.value
  );
  const profilePageData = useSelector(
    (state: RootState) => state.app.profilePaginatedReducer.value
  );
  const hasMoreUserHistory = useSelector(
    (state: RootState) => state.app.hasMoreHistoryReducer.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const hasMoreBuyerHistory = useSelector(
    (state: RootState) => state.app.hasMoreBuyerHistoryReducer.value
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const isCreator = useSelector(
    (state: RootState) => state.app.isCreatorReducer.value
  );
  const buyerHistoryReducer = useSelector(
    (state: RootState) => state.app.buyerHistoryReducer.value
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const hasMoreHistory = useSelector(
    (state: RootState) => state.app.hasMoreHistoryReducer.value
  );
  const hasMoreHistorySpecific = useSelector(
    (state: RootState) => state.app.hasMoreBuyerHistoryReducer.value
  );
  const hasMoreCollections = useSelector(
    (state: RootState) => state.app.hasMoreCollectionReducer.value
  );
  const decryptProfileScroll = useSelector(
    (state: RootState) => state.app.decryptProfileScrollPosReducer.value
  );
  const profileScroll = useSelector(
    (state: RootState) => state.app.profileScrollPosReducer.value
  );
  const paginatedCollection = useSelector(
    (state: RootState) => state.app.collectionPaginatedReducer
  );
  const paginated = useSelector(
    (state: RootState) => state.app.paginatedReducer.value
  );
  const decryptFeedCount = useSelector(
    (state: RootState) => state.app.decryptFeedCountReducer
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const purchaseModal = useSelector(
    (state: RootState) => state.app.purchaseReducer
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const scrollPos = useSelector(
    (state: RootState) => state.app.scrollPosReducer.value
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const publicationImagesDispatched = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer.value
  );
  const dispatch = useDispatch();
  const { handleLensSignIn } = useConnect(
    router,
    address,
    isConnected,
    dispatch,
    connectModalOpen,
    publicClient
  );
  const { openConnectModal } = useConnectModal();
  const {
    videoLoading,
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    clientRendered,
  } = useImageUpload(
    dispatch,
    viewer,
    makePost?.value,
    postImagesDispatched,
    publicationImagesDispatched
  );
  const {
    tab,
    setTab,
    fetchMoreVideos,
    scrollHeight,
    videosLoading,
    setVideosLoading,
  } = useChannels(
    dispatch,
    mainVideo,
    lensProfile,
    dispatchVideos,
    indexModal.message,
    reactId,
    videoSync,
    videoCount
  );
  const {
    setDropDownPriceSort,
    dropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  } = useViewer(router, dispatch, quickProfiles, allDrops);
  const {
    commentors,
    getMorePostComments,
    commentsLoading: commentsCollectLoading,
    collectors,
    collectLoading: interactionsCollectLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
  } = useInteractions(router, lensProfile, mainVideo, commentId, indexModal);
  const {
    streamRef,
    formatTime,
    volume,
    handleVolumeChange,
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorLoading,
    collectLoading,
    likeLoading,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    wrapperRef,
    progressRef,
    handleSeek,
    likeCommentLoading,
    mirrorCommentLoading,
    collectCommentLoading,
  } = useControls(
    dispatch,
    address,
    publicClient,
    purchaseModal,
    seek,
    approvalArgs,
    mainVideo,
    videoSync,
    lensProfile,
    fullScreenVideo,
    commentId,
    indexModal,
    router
  );
  const {
    collectionsLoading,
    error,
    moreCollectionsLoading,
    handleGetMoreCollections,
  } = useDrop(
    router,
    dispatch,
    collections,
    paginatedCollection,
    allDrops,
    hasMoreCollections,
    feed,
    decryptFeed
  );
  const {
    commentPost: commentPostWavs,
    commentDescription: commentDescriptionWavs,
    commentLoading: commentLoadingWavs,
    handleCommentDescription: handleCommentDescriptionWavs,
    textElement: textElementWavs,
    caretCoord: caretCoordWavs,
    mentionProfiles: mentionProfilesWavs,
    profilesOpen: profilesOpenWavs,
    handleMentionClick: handleMentionClickWavs,
    handleGif: handleGifWavs,
    handleGifSubmit: handleGifSubmitWavs,
    handleSetGif: handleSetGifWavs,
    results: resultsWavs,
    setGifOpen: setGifOpenWavs,
    gifOpen: gifOpenWavs,
    handleKeyDownDelete: handleKeyDownDeleteWavs,
    preElement: preElementWavs,
    handleImagePaste: handleImagePasteWavs,
  } = useCommentWav(
    dispatch,
    publicClient,
    address,
    uploadImage,
    lensProfile,
    collectModuleType,
    postImagesDispatched,
    collectOpen
  );
  const {
    commentVideo,
    commentDescription,
    commentLoading,
    handleCommentDescription,
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
    preElement,
    handleImagePaste,
  } = useCommentNFT(
    dispatch,
    publicClient,
    address,
    mainVideo,
    collectOpen,
    commentId,
    postImagesDispatched,
    collectModuleType,
    uploadImage
  );
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
  } = useCollectOptions(dispatch, lensProfile, collectOpen);
  const {
    currency,
    setCurrency,
    baseColor,
    setBaseColor,
    selectSize,
    setSelectSize,
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
    viewScreenNFT,
    setViewScreenNFT,
    handleCheckoutCrypto,
    oracleValue,
    cryptoCheckoutLoading,
    imageIndex,
    setImageIndex,
  } = useFulfillment(
    publicClient,
    dispatch,
    address,
    client,
    mainNFT,
    success,
    fulfillmentDetails
  );
  const {
    historyLoading,
    historySwitch,
    setHistorySwitch,
    getMoreBuyerHistory,
    getMoreUserHistory,
    moreHistoryLoading,
  } = useHistory(
    address,
    dispatch,
    history,
    historyReducer,
    buyerHistoryReducer,
    options,
    indexModal?.message,
    historyPagination,
    buyerPagination,
    hasMoreUserHistory,
    hasMoreBuyerHistory
  );
  const {
    statsTitles,
    statsLoading,
    topAccountsFollowed,
    totalChanges,
    graphData,
    setCanvas,
    canvas,
  } = useStats(dispatch, viewer, stats);
  const {
    followerOnly,
    postsLoading,
    hasMore: hasMoreAllPosts,
    fetchMore,
    scrollRef,
    setScrollPos,
    followerOnlyDecrypt,
    hasMoreDecrypt,
    decryptLoading,
    fetchMoreDecrypt,
    scrollRefDecrypt,
    setScrollPosDecrypt,
  } = useAllPosts(
    address,
    dispatch,
    router,
    lensProfile,
    dispatchProfile,
    feed,
    profileDispatch,
    decryptFeed,
    filterDecrypt,
    decryptFeedCount,
    indexModal,
    decrypt,
    feedId,
    reactionFeedCount,
    postSent,
    feedType,
    commentAmounts,
    comments,
    paginated,
    decryptPaginated,
    individualCount,
    decryptProfileFeedCount,
    profileFeedCount
  );
  const {
    reactPost,
    collectPost,
    mirrorPost,
    reactFeedLoading,
    mirrorFeedLoading,
    collectFeedLoading,
    setOpenMirrorChoice,
    openMirrorChoice,
  } = useReactions(
    publicClient,
    dispatch,
    address,
    lensProfile,
    feed,
    approvalArgs,
    purchaseModal
  );
  const {
    getMorePostComments: getMorePostCommentsIndividual,
    hasMoreComments: hasMoreCommentsIndividual,
    commentsLoading: commentsLoadingIndividual,
    mainPostLoading,
    followerOnly: followerOnlyMain,
    mainPost,
    followerOnlyComments,
    reactCommentLoading,
    mirrorCommentLoading: mirrorCommentLoadingIndividual,
    collectCommentLoading: collectCommentLoadingIndividual,
    setMirrorCommentLoading,
    setCollectCommentLoading,
    setReactCommentLoading,
    setCollectPostLoading,
    setMirrorPostLoading,
    setReactPostLoading,
    collectPostLoading,
    reactPostLoading,
    mirrorPostLoading,
    setOpenCommentMirrorChoice,
    setOpenPostMirrorChoice,
    openCommentMirrorChoice,
    openPostMirrorChoice,
  } = useIndividual(
    router,
    dispatch,
    address,
    lensProfile,
    feedType,
    commentAmounts,
    indexModal,
    commentsDispatch
  );
  const {
    hasMoreProfile,
    fetchMoreProfile,
    profileRef,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    setProfileScroll,
    hasMoreDecryptProfile,
    setScrollPosDecryptProfile,
    scrollRefDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileCollections,
    profileCollectionsLoading,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  } = useProfileFeed(
    router,
    address,
    dispatch,
    profileDispatch,
    filterDecrypt,
    postSent,
    quickProfiles,
    lensProfile,
    dispatchProfile,
    profilePageData,
    profileFeedCount,
    decryptProfilePageData,
    decryptProfileFeedCount,
    decryptProfileFeed
  );
  const {
    searchProfiles,
    profilesFound,
    profilesOpenSearch,
    fetchMoreSearch,
    hasMoreSearch,
    setProfilesOpenSearch,
    setProfilesFound,
  } = useSearch();

  const [globalLoading, setGlobalLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      if (!collectionsLoading && !videoLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [collectionsLoading, videoLoading]);

  useEffect(() => {
    dispatch(setHistoryURLRedux(router.asPath));
  }, []);

  if (!globalLoading) {
    return (
      <div className="relative w-full h-full flex flex-col overflow-x-hidden selection:bg-ama selection:text-moda">
        <Head>
          <title>Chromadin</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="relative w-full h-full flex flex-row xl:flex-nowrap flex-wrap">
          <div className="relative w-full h-fit flex lg:hidden">
            <Switcher router={router} options={options} dispatch={dispatch} />
          </div>
          <div className="relative w-full h-full flex flex-row items-center">
            <div className="relative w-fit h-full hidden lg:flex">
              <SideBar
                openConnectModal={openConnectModal}
                connected={connected}
                handleLensSignIn={handleLensSignIn}
                profile={lensProfile}
                tab={tab}
                setTab={setTab}
                viewer={viewer}
                dispatch={dispatch}
                dispatchVideos={dispatchVideos}
                options={options}
                videoSync={videoSync}
                hasMore={hasMore}
                fetchMoreVideos={fetchMoreVideos}
                scrollHeight={scrollHeight}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsCollectLoading}
                hasMoreComments={hasMoreComments}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                likeCommentLoading={likeCommentLoading}
                mirrorCommentLoading={mirrorCommentLoading}
                collectCommentLoading={collectCommentLoading}
                commentId={commentId}
                router={router}
                collectors={collectors}
                collectLoading={interactionsCollectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
                currency={currency}
                setCurrency={setCurrency}
                setBaseColor={setBaseColor}
                selectSize={selectSize}
                baseColor={baseColor}
                setSelectSize={setSelectSize}
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
                viewScreenNFT={viewScreenNFT}
                setViewScreenNFT={setViewScreenNFT}
                handleCheckoutCrypto={handleCheckoutCrypto}
                address={address}
                cryptoCheckoutLoading={cryptoCheckoutLoading}
                oracleValue={oracleValue}
                openChainModal={openChainModal}
                encryptedInformation={encryptedInformation}
                fulfillmentDetails={fulfillmentDetails}
                chain={chain}
                imageIndex={imageIndex}
                setImageIndex={setImageIndex}
                historyReducer={historyReducer}
                historyLoading={historyLoading}
                buyerHistoryReducer={buyerHistoryReducer}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                moreHistoryLoading={moreHistoryLoading}
                hasMoreHistory={hasMoreHistory}
                hasMoreHistorySpecific={hasMoreHistorySpecific}
                isCreator={isCreator}
                action={action}
              />
            </div>
            <div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
              <View
                commentsDispatch={commentsDispatch}
                reactionAmounts={reactionFeedCount}
                individualCount={individualCount}
                quickProfiles={quickProfiles}
                feedType={feedType}
                history={history}
                decryptScrollPos={decryptScrollPos}
                decryptFeed={decryptFeed}
                mainVideo={mainVideo}
                viewer={viewer}
                statsTitles={statsTitles}
                statsLoading={statsLoading}
                topAccountsFollowed={topAccountsFollowed}
                totalChanges={totalChanges}
                graphData={graphData}
                setCanvas={setCanvas}
                canvas={canvas}
                commentAmounts={commentAmounts}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                mirrorLoading={mirrorLoading}
                likeLoading={likeLoading}
                collectLoading={collectLoading}
                hasMore={hasMore}
                reactions={videoCount}
                streamRef={streamRef}
                formatTime={formatTime}
                volume={volume}
                handleVolumeChange={handleVolumeChange}
                volumeOpen={volumeOpen}
                setVolumeOpen={setVolumeOpen}
                handleHeart={handleHeart}
                dispatchProfile={dispatchProfile}
                wrapperRef={wrapperRef}
                progressRef={progressRef}
                handleSeek={handleSeek}
                setVideosLoading={setVideosLoading}
                videoSync={videoSync}
                stats={stats}
                videosLoading={videosLoading}
                dispatchVideos={dispatchVideos}
                fetchMoreVideos={fetchMoreVideos}
                lensProfile={lensProfile}
                error={error}
                moreCollectionsLoading={moreCollectionsLoading}
                collectionsLoading={collectionsLoading}
                rates={rates}
                pies={pies}
                router={router}
                dispatch={dispatch}
                graphs={graphs}
                setDropDownPriceSort={setDropDownPriceSort}
                dropDownPriceSort={dropDownPriceSort}
                dropDownDateSort={dropDownDateSort}
                setDropDownDateSort={setDropDownDateSort}
                handleSearch={handleSearch}
                searchOpen={searchOpen}
                searchResults={searchResults}
                handleSearchChoose={handleSearchChoose}
                hasMoreCollections={hasMoreCollections}
                dateFilter={dateFilter}
                feed={feed}
                priceFilter={priceFilter}
                collections={collections}
                handleGetMoreCollections={handleGetMoreCollections}
                address={address}
                searchProfiles={searchProfiles}
                profilesFound={profilesFound}
                profilesOpenSearch={profilesOpenSearch}
                fetchMoreSearch={fetchMoreSearch}
                hasMoreSearch={hasMoreSearch}
                setProfilesOpenSearch={setProfilesOpenSearch}
                setProfilesFound={setProfilesFound}
                hasMoreProfile={hasMoreProfile}
                fetchMoreProfile={fetchMoreProfile}
                profileRef={profileRef}
                decryptProfileFeedCount={decryptProfileFeedCount}
                followerOnlyProfile={followerOnlyProfile}
                setCollectProfileLoading={setCollectProfileLoading}
                setMirrorProfileLoading={setMirrorProfileLoading}
                profileLoading={profileLoading}
                mirrorProfileLoading={mirrorProfileLoading}
                collectProfileLoading={collectProfileLoading}
                reactProfileLoading={reactProfileLoading}
                setReactProfileLoading={setReactProfileLoading}
                setProfileScroll={setProfileScroll}
                hasMoreDecryptProfile={hasMoreDecryptProfile}
                setScrollPosDecryptProfile={setScrollPosDecryptProfile}
                scrollRefDecryptProfile={scrollRefDecryptProfile}
                followerOnlyProfileDecrypt={followerOnlyProfileDecrypt}
                fetchMoreProfileDecrypt={fetchMoreProfileDecrypt}
                decryptProfileLoading={decryptProfileLoading}
                profileCollections={profileCollections}
                profileCollectionsLoading={profileCollectionsLoading}
                openProfileMirrorChoice={openProfileMirrorChoice}
                setOpenProfileMirrorChoice={setOpenProfileMirrorChoice}
                getMorePostCommentsIndividual={getMorePostCommentsIndividual}
                hasMoreCommentsIndividual={hasMoreCommentsIndividual}
                commentsLoadingIndividual={commentsLoadingIndividual}
                followerOnlyMain={followerOnlyMain}
                mirrorCommentLoadingIndividual={mirrorCommentLoadingIndividual}
                collectCommentLoadingIndividual={
                  collectCommentLoadingIndividual
                }
                profileFeedCount={profileFeedCount}
                hasMoreAllPosts={hasMoreAllPosts}
                mainPostLoading={mainPostLoading}
                mainPost={mainPost}
                followerOnlyComments={followerOnlyComments}
                reactCommentLoading={reactCommentLoading}
                setMirrorCommentLoading={setMirrorCommentLoading}
                setCollectCommentLoading={setCollectCommentLoading}
                setReactCommentLoading={setReactCommentLoading}
                setCollectPostLoading={setCollectPostLoading}
                setMirrorPostLoading={setMirrorPostLoading}
                setReactPostLoading={setReactPostLoading}
                collectPostLoading={collectPostLoading}
                reactPostLoading={reactPostLoading}
                mirrorPostLoading={mirrorPostLoading}
                setOpenCommentMirrorChoice={setOpenCommentMirrorChoice}
                clientRendered={clientRendered}
                setOpenPostMirrorChoice={setOpenPostMirrorChoice}
                openCommentMirrorChoice={openCommentMirrorChoice}
                openPostMirrorChoice={openPostMirrorChoice}
                reactPost={reactPost}
                collectPost={collectPost}
                mirrorPost={mirrorPost}
                reactFeedLoading={reactFeedLoading}
                mirrorFeedLoading={mirrorFeedLoading}
                collectFeedLoading={collectFeedLoading}
                setOpenMirrorChoice={setOpenMirrorChoice}
                openMirrorChoice={openMirrorChoice}
                followerOnly={followerOnly}
                decryptFeedCount={decryptFeedCount}
                postsLoading={postsLoading}
                fetchMore={fetchMore}
                scrollRef={scrollRef}
                setScrollPos={setScrollPos}
                followerOnlyDecrypt={followerOnlyDecrypt}
                hasMoreDecrypt={hasMoreDecrypt}
                decryptLoading={decryptLoading}
                fetchMoreDecrypt={fetchMoreDecrypt}
                scrollRefDecrypt={scrollRefDecrypt}
                setScrollPosDecrypt={setScrollPosDecrypt}
                commentPost={commentPostWavs}
                commentDescription={commentDescriptionWavs}
                textElement={textElementWavs}
                handleCommentDescription={handleCommentDescriptionWavs}
                commentLoading={commentLoadingWavs}
                caretCoord={caretCoordWavs}
                mentionProfiles={mentionProfilesWavs}
                profilesOpen={profilesOpenWavs}
                handleMentionClick={handleMentionClickWavs}
                handleGifSubmit={handleGifSubmitWavs}
                handleGif={handleGifWavs}
                results={resultsWavs}
                handleSetGif={handleSetGifWavs}
                gifOpen={gifOpenWavs}
                scrollPos={scrollPos}
                setGifOpen={setGifOpenWavs}
                handleKeyDownDelete={handleKeyDownDeleteWavs}
                preElement={preElementWavs}
                handleImagePaste={handleImagePasteWavs}
                commentOpen={commentOpen}
                profileDispatch={profileDispatch}
                postImagesDispatched={postImagesDispatched}
                mappedFeaturedFiles={mappedFeaturedFiles}
                collectOpen={collectOpen}
                decryptProfileFeed={decryptProfileFeed}
                uploadImages={uploadImage}
                uploadVideo={uploadVideo}
                videoLoading={videoLoading}
                imageLoading={imageLoading}
                handleRemoveImage={handleRemoveImage}
                handleLensSignIn={handleLensSignIn}
                openConnectModal={openConnectModal}
                collectNotif={collectNotif}
                referral={referral}
                setCollectible={setCollectible}
                collectibleDropDown={collectibleDropDown}
                setCollectibleDropDown={setCollectibleDropDown}
                collectible={collectible}
                setAudienceDropDown={setAudienceDropDown}
                audienceType={audienceType}
                audienceTypes={audienceTypes}
                chargeCollect={chargeCollect}
                limit={limit}
                limitedEdition={limitedEdition}
                audienceDropDown={audienceDropDown}
                setAudienceType={setAudienceType}
                setTimeLimit={setTimeLimit}
                timeLimit={timeLimit}
                timeLimitDropDown={timeLimitDropDown}
                setTimeLimitDropDown={setTimeLimitDropDown}
                setLimitedEdition={setLimitedEdition}
                limitedDropDown={limitedDropDown}
                setLimitedDropDown={setLimitedDropDown}
                setReferral={setReferral}
                setLimit={setLimit}
                setChargeCollect={setChargeCollect}
                setCurrencyDropDown={setCurrencyDropDown}
                chargeCollectDropDown={chargeCollectDropDown}
                setChargeCollectDropDown={setChargeCollectDropDown}
                enabledCurrencies={enabledCurrencies}
                enabledCurrency={enabledCurrency}
                currencyDropDown={currencyDropDown}
                setEnabledCurrency={setEnabledCurrency}
                value={value}
                setValue={setValue}
                filterDecrypt={filterDecrypt}
                decryptProfileScroll={decryptProfileScroll}
                profileScroll={profileScroll}
              />
              {viewer !== "sampler" && viewer !== "chat" && (
                <NFT
                  lensProfile={lensProfile}
                  mainNFT={mainNFT}
                  viewer={viewer}
                  canComment={
                    commentId !== ""
                      ? commentors.find((comment) => comment?.id === comment)
                          ?.operations?.canComment === TriStateValue?.Yes ||
                        TriStateValue?.Unknown
                        ? true
                        : false
                      : true
                  }
                  connected={connected}
                  commentVideo={commentVideo}
                  handleLensSignIn={handleLensSignIn}
                  openConnectModal={openConnectModal}
                  commentDescription={commentDescription}
                  commentLoading={commentLoading}
                  handleCommentDescription={handleCommentDescription}
                  textElement={textElement}
                  caretCoord={caretCoord}
                  mentionProfiles={mentionProfiles}
                  profilesOpen={profilesOpen}
                  handleMentionClick={handleMentionClick}
                  videoLoading={videoLoading}
                  imageLoading={imageLoading}
                  uploadImage={uploadImage}
                  uploadVideo={uploadVideo}
                  handleRemoveImage={handleRemoveImage}
                  postImagesDispatched={postImagesDispatched}
                  mappedFeaturedFiles={mappedFeaturedFiles}
                  handleGifSubmit={handleGifSubmit}
                  handleGif={handleGif}
                  results={results}
                  handleSetGif={handleSetGif}
                  setGifOpen={setGifOpen}
                  gifOpen={gifOpen}
                  collectOpen={collectOpen}
                  collectNotif={collectNotif}
                  referral={referral}
                  setCollectible={setCollectible}
                  collectibleDropDown={collectibleDropDown}
                  setCollectibleDropDown={setCollectibleDropDown}
                  collectible={collectible}
                  setAudienceDropDown={setAudienceDropDown}
                  audienceType={audienceType}
                  audienceTypes={audienceTypes}
                  chargeCollect={chargeCollect}
                  limit={limit}
                  limitedEdition={limitedEdition}
                  audienceDropDown={audienceDropDown}
                  setAudienceType={setAudienceType}
                  setTimeLimit={setTimeLimit}
                  timeLimit={timeLimit}
                  timeLimitDropDown={timeLimitDropDown}
                  setTimeLimitDropDown={setTimeLimitDropDown}
                  setLimitedEdition={setLimitedEdition}
                  limitedDropDown={limitedDropDown}
                  setLimitedDropDown={setLimitedDropDown}
                  setReferral={setReferral}
                  setLimit={setLimit}
                  setChargeCollect={setChargeCollect}
                  setCurrencyDropDown={setCurrencyDropDown}
                  chargeCollectDropDown={chargeCollectDropDown}
                  setChargeCollectDropDown={setChargeCollectDropDown}
                  enabledCurrencies={enabledCurrencies}
                  enabledCurrency={enabledCurrency}
                  currencyDropDown={currencyDropDown}
                  setEnabledCurrency={setEnabledCurrency}
                  value={value}
                  setValue={setValue}
                  dispatch={dispatch}
                  handleKeyDownDelete={handleKeyDownDelete}
                  commentId={commentId}
                  preElement={preElement}
                  handleImagePaste={handleImagePaste}
                  clientRendered={clientRendered}
                  collectionsLoading={collectionsLoading}
                  router={router}
                />
              )}
            </div>
          </div>
          <div className="w-full h-fit flex flex-col lg:hidden">
            <Connect
              router={router}
              openConnectModal={openConnectModal}
              connected={connected}
              handleLensSignIn={handleLensSignIn}
              profile={lensProfile}
            />
            <Tabs tab={tab} setTab={setTab} viewer={viewer} />
            {tab === 0 ? (
              <Channels
                dispatch={dispatch}
                dispatchVideos={dispatchVideos}
                videoSync={videoSync}
                hasMore={hasMore}
                fetchMoreVideos={fetchMoreVideos}
                scrollHeight={scrollHeight}
              />
            ) : (
              <Interactions
                viewer={viewer}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsCollectLoading}
                dispatchVideos={dispatchVideos}
                hasMoreComments={hasMoreComments}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                likeCommentLoading={likeCommentLoading}
                mirrorCommentLoading={mirrorCommentLoading}
                collectCommentLoading={collectCommentLoading}
                dispatch={dispatch}
                lensProfile={lensProfile}
                commentId={commentId}
                router={router}
                collectors={collectors}
                collectLoading={interactionsCollectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
                currency={currency}
                setCurrency={setCurrency}
                setBaseColor={setBaseColor}
                selectSize={selectSize}
                baseColor={baseColor}
                setSelectSize={setSelectSize}
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
                viewScreenNFT={viewScreenNFT}
                setViewScreenNFT={setViewScreenNFT}
                handleCheckoutCrypto={handleCheckoutCrypto}
                address={address}
                cryptoCheckoutLoading={cryptoCheckoutLoading}
                oracleValue={oracleValue}
                openChainModal={openChainModal}
                openConnectModal={openConnectModal}
                encryptedInformation={encryptedInformation}
                fulfillmentDetails={fulfillmentDetails}
                chain={chain}
                imageIndex={imageIndex}
                setImageIndex={setImageIndex}
                historyReducer={historyReducer}
                historyLoading={historyLoading}
                buyerHistoryReducer={buyerHistoryReducer}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                moreHistoryLoading={moreHistoryLoading}
                hasMoreHistory={hasMoreHistory}
                hasMoreHistorySpecific={hasMoreHistorySpecific}
                isCreator={isCreator}
                action={action}
              />
            )}
          </div>
          {viewer !== "sampler" && viewer !== "chat" && (
            <div className="w-fit h-full hidden xl:flex">
              <Interactions
                viewer={viewer}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsCollectLoading}
                dispatchVideos={dispatchVideos}
                hasMoreComments={hasMoreComments}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                likeCommentLoading={likeCommentLoading}
                mirrorCommentLoading={mirrorCommentLoading}
                collectCommentLoading={collectCommentLoading}
                dispatch={dispatch}
                lensProfile={lensProfile}
                commentId={commentId}
                router={router}
                collectors={collectors}
                collectLoading={interactionsCollectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
                currency={currency}
                setCurrency={setCurrency}
                setBaseColor={setBaseColor}
                selectSize={selectSize}
                baseColor={baseColor}
                setSelectSize={setSelectSize}
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
                viewScreenNFT={viewScreenNFT}
                setViewScreenNFT={setViewScreenNFT}
                handleCheckoutCrypto={handleCheckoutCrypto}
                address={address}
                cryptoCheckoutLoading={cryptoCheckoutLoading}
                oracleValue={oracleValue}
                openChainModal={openChainModal}
                openConnectModal={openConnectModal}
                encryptedInformation={encryptedInformation}
                fulfillmentDetails={fulfillmentDetails}
                chain={chain}
                imageIndex={imageIndex}
                setImageIndex={setImageIndex}
                historyReducer={historyReducer}
                historyLoading={historyLoading}
                buyerHistoryReducer={buyerHistoryReducer}
                historySwitch={historySwitch}
                setHistorySwitch={setHistorySwitch}
                getMoreBuyerHistory={getMoreBuyerHistory}
                getMoreUserHistory={getMoreUserHistory}
                moreHistoryLoading={moreHistoryLoading}
                hasMoreHistory={hasMoreHistory}
                hasMoreHistorySpecific={hasMoreHistorySpecific}
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
