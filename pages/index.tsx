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
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import useFulfillment from "@/components/Common/Interactions/hooks/useFulfillment";
import useHistory from "@/components/Common/Interactions/hooks/useHistory";
import useStats from "@/components/Common/Sampler/hooks/useStats";
import useViewer from "@/components/Home/hooks/useViewer";
import useSearch from "@/components/Common/Wavs/hooks/useSearch";
import useProfileFeed from "@/components/Common/Wavs/hooks/useProfileFeed";
import useIndividual from "@/components/Common/Wavs/hooks/useIndividual";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";

const Home: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { address, isConnected } = useAccount();
  const { connectModalOpen } = useConnectModal();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
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
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const individualCount = useSelector(
    (state: RootState) => state.app.individualFeedCountReducer
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
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
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
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
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
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
  const videoCount = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const collections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const feed = useSelector((state: RootState) => state.app.feedReducer.value);
  const dispatchProfile = useSelector(
    (state: RootState) => state.app.profileReducer.profile
  );
  const profilePageData = useSelector(
    (state: RootState) => state.app.profilePaginatedReducer.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );
  const isCreator = useSelector(
    (state: RootState) => state.app.isCreatorReducer.value
  );
  const historyData = useSelector(
    (state: RootState) => state.app.historyDataReducer
  );
  const hasMoreCollections = useSelector(
    (state: RootState) => state.app.hasMoreCollectionReducer.value
  );
  const paginatedCollection = useSelector(
    (state: RootState) => state.app.collectionPaginatedReducer
  );
  const paginated = useSelector(
    (state: RootState) => state.app.paginatedReducer.value
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
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
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
    publicClient,
    oracleData
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
  } = useViewer(router, dispatch, quickProfiles, lensProfile);
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
    hasMoreCollections,
    quickProfiles,
    dispatchProfile
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
    totalAmount,
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  } = useFulfillment(publicClient, dispatch, address, mainNFT, oracleData);
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
  } = useAllPosts(
    dispatch,
    router,
    lensProfile,
    dispatchProfile,
    feed,
    profileDispatch,
    indexModal,
    feedId,
    reactionFeedCount,
    postSent,
    commentAmounts,
    comments,
    paginated,
    individualCount,
    profileFeedCount,
    feedType
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
    commentAmounts,
    indexModal,
    commentsDispatch,
    feedType
  );
  const {
    hasMoreProfile,
    fetchMoreProfile,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    profileCollections,
    profileCollectionsLoading,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  } = useProfileFeed(
    router,
    dispatch,
    profileDispatch,
    postSent,
    quickProfiles,
    lensProfile,
    dispatchProfile,
    profilePageData,
    profileFeedCount
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
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
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
              <View
                feedType={feedType}
                commentsDispatch={commentsDispatch}
                reactionAmounts={reactionFeedCount}
                individualCount={individualCount}
                quickProfiles={quickProfiles}
                history={historyURL}
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
                followerOnlyProfile={followerOnlyProfile}
                setCollectProfileLoading={setCollectProfileLoading}
                setMirrorProfileLoading={setMirrorProfileLoading}
                profileLoading={profileLoading}
                mirrorProfileLoading={mirrorProfileLoading}
                collectProfileLoading={collectProfileLoading}
                reactProfileLoading={reactProfileLoading}
                setReactProfileLoading={setReactProfileLoading}
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
                postsLoading={postsLoading}
                fetchMore={fetchMore}
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
                setGifOpen={setGifOpenWavs}
                handleKeyDownDelete={handleKeyDownDeleteWavs}
                preElement={preElementWavs}
                handleImagePaste={handleImagePasteWavs}
                commentOpen={commentOpen}
                profileDispatch={profileDispatch}
                postImagesDispatched={postImagesDispatched}
                mappedFeaturedFiles={mappedFeaturedFiles}
                collectOpen={collectOpen}
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
                historyData={historyData}
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
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
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
          {viewer !== "sampler" && viewer !== "chat" && (
            <div className="w-fit h-full hidden xl:flex">
              <Interactions
                viewer={viewer}
                historyData={historyData}
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
                totalAmount={totalAmount}
                approved={approved}
                mainNFT={mainNFT}
                buyNFT={buyNFT}
                approveSpend={approveSpend}
                purchaseLoading={purchaseLoading}
                collections={collections}
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
