import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoProfile from "@/components/Autograph/Home/hooks/useAutoProfile";
import useAutograph from "@/components/Autograph/Home/hooks/useAutograph";
import AutoProfileFeed from "@/components/Autograph/Home/modules/AutoProfileFeed";
import Collections from "@/components/Autograph/Home/modules/Collections";
import Drops from "@/components/Autograph/Home/modules/Drops";
import NotFound from "@/components/Common/Loading/NotFound";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useControls from "@/components/Common/Video/hooks/useControls";
import useComment from "@/components/Common/Wavs/hooks/useComment";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";
import Account from "@/components/Common/Wavs/modules/Account";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";

const Autograph: NextPage<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { autograph } = router.query;
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const feed = useSelector((state: RootState) => state.app.feedReducer.value);
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const profileType = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const collectModuleType = useSelector(
    (state: RootState) => state.app.collectValueTypeReducer?.type
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const postOpen = useSelector(
    (state: RootState) => state.app.makePostReducer.value
  );
  const page = useSelector((state: RootState) => state.app.viewReducer.value);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const publicationImages = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );
  const feedType = useSelector(
    (state: RootState) => state.app.feedTypeReducer?.value
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer.value
  );
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer(router, dispatch, quickProfiles, lensProfile);
  const {
    videoLoading,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    uploadImage,
    clientRendered,
  } = useImageUpload(
    dispatch,
    page,
    postOpen,
    postImagesDispatched,
    publicationImages
  );
  const { handleLensSignIn } = useConnect(
    router,
    address,
    isConnected,
    dispatch,
    connectModalOpen,
    publicClient,
    oracleData
  );
  const { autographLoading, autographData } = useAutograph(
    autograph as string,
    lensProfile
  );
  const { isLargeScreen } = useBar();
  const { reactPost, collectPost, mirrorPost } = useReactions(
    publicClient,
    dispatch,
    address,
    lensProfile,
    feed,
    approvalArgs,
    purchase
  );
  const {
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
    preElement,
    handleImagePaste,
  } = useComment(
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
    profileFeed,
    profileFeedCount,
    setOpenProfileMirrorChoice,
    openProfileMirrorChoice,
  } = useAutoProfile(
    router,
    dispatch,
    address,
    autographData?.profile,
    lensProfile
  );
  const { fetchMoreVideos, videosLoading, setVideosLoading } = useChannels(
    dispatch,
    mainVideo,
    lensProfile,
    dispatchVideos,
    index.message,
    reactId,
    videoSync,
    reactions
  );
  const {
    streamRef,
    formatTime,
    volume,
    handleVolumeChange,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorLoading,
    collectLoading,
    likeLoading,
    wrapperRef,
    progressRef,
    handleSeek,
  } = useControls(
    dispatch,
    address,
    publicClient,
    purchase,
    seek,
    approvalArgs,
    mainVideo,
    videoSync,
    lensProfile,
    fullScreenVideo,
    commentId,
    index,
    router
  );

  useEffect(() => {
    setTimeout(() => {
      if (!autographLoading && !profileLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [autographLoading, profileLoading]);

  if (!autographLoading && !profileLoading && !globalLoading) {
    return (
      <div
        className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
        id="calc"
      >
        <Head>
          <title>
            Chromadin |{" "}
            {autographData?.profile?.handle?.localName?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              autographData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <meta
            name="og:title"
            content={autographData?.profile?.handle?.suggestedFormatted?.localName
              ?.split("@")[1]
              ?.toUpperCase()}
          />
          <meta
            name="og:description"
            content={autographData?.profile?.metadata?.bio}
          />
          <meta
            name="og:image"
            content={
              !autographData?.collections?.[0]?.collectionMetadata?.images?.[0]
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autographData?.collections?.[0]?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )}`
            }
          />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@digitalax" />
          <meta name="twitter:creator" content="@digitalax" />
          <meta
            name="twitter:image"
            content={`https://www.chromadin.xyz/autograph/${
              autographData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              autographData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !autographData?.collections?.[0]?.collectionMetadata?.images?.[0]
                ? "https://www.chromadin.xyz/card.png/"
                : `https://www.chromadin.infura-ipfs.io/ipfs/${autographData?.collections?.[0]?.collectionMetadata?.images?.[0]?.split(
                    "ipfs://"
                  )}`
            }
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/ArcadeClassic.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/DSDigi.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/EarlsRevenge.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/Geometria.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/ClashDisplay.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/DosisRegular.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/EconomicaBold.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/EconomicaRegular.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
          <link
            rel="preload"
            href="https://www.chromadin.xyz/fonts/Manaspc.ttf"
            as="font"
            crossOrigin="anonymous"
            type="font/ttf"
          />
        </Head>
        <Bar
          router={router}
          openConnectModal={openConnectModal}
          connected={connected}
          handleLensSignIn={handleLensSignIn}
          lensProfile={lensProfile}
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          isLargeScreen={isLargeScreen}
          hasMore={hasMore}
          reactions={reactions}
          streamRef={streamRef}
          formatTime={formatTime}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          handleHeart={handleHeart}
          mirrorVideo={mirrorVideo}
          collectVideo={collectVideo}
          likeVideo={likeVideo}
          mirrorLoading={mirrorLoading}
          collectLoading={collectLoading}
          likeLoading={likeLoading}
          mainVideo={mainVideo}
          wrapperRef={wrapperRef}
          progressRef={progressRef}
          handleSeek={handleSeek}
          videoSync={videoSync}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
          dispatch={dispatch}
          dispatchVideos={dispatchVideos}
        />
        {quickProfiles &&
        !globalLoading &&
        !quickProfiles?.some(
          (prof) =>
            prof.handle?.suggestedFormatted?.localName
              ?.split("@")?.[1]
              ?.toLowerCase() === (autograph as string).toLowerCase()
        ) ? (
          <NotFound router={router} />
        ) : (
          autographData?.profile &&
          profileFeed && (
            <div className="relative flex flex-col w-full h-fit gap-20 justify-start px-6 preG:px-8 sm:px-20 py-10">
              <Account dispatch={dispatch} profile={autographData?.profile} />
              <div className="relative flex flex-col tablet:flex-row gap-10 tablet:gap-3 items-start justify-center w-full h-full">
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4 order-2 tablet:order-1">
                  <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
                    {profileLoading ? (
                      <div className="relative w-full h-full flex flex-col gap-4 overflow-y-scroll">
                        {Array.from({ length: 3 }).map((_, index: number) => {
                          return (
                            <div
                              key={index}
                              className="relative w-full h-48 rounded-md animate-pulse border border-white min-w-full opacity-70"
                              id="staticLoad"
                            ></div>
                          );
                        })}
                      </div>
                    ) : (
                      <AutoProfileFeed
                        feedType={feedType}
                        followerOnly={followerOnlyProfile}
                        clientRendered={clientRendered}
                        hasMoreProfile={hasMoreProfile}
                        fetchMoreProfile={fetchMoreProfile}
                        profileFeed={profileFeed}
                        profileAmounts={profileFeedCount}
                        collectPost={collectPost}
                        mirrorPost={mirrorPost}
                        reactPost={reactPost}
                        commentPost={commentPost}
                        commentOpen={commentOpen}
                        lensProfile={lensProfile}
                        address={address}
                        mirrorLoading={mirrorProfileLoading}
                        reactLoading={reactProfileLoading}
                        collectLoading={collectProfileLoading}
                        openMirrorChoice={openProfileMirrorChoice}
                        setOpenMirrorChoice={setOpenProfileMirrorChoice}
                        dispatch={dispatch}
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
                        profileType={profileType}
                        results={results}
                        handleSetGif={handleSetGif}
                        gifOpen={gifOpen}
                        setGifOpen={setGifOpen}
                        handleKeyDownDelete={handleKeyDownDelete}
                        handleLensSignIn={handleLensSignIn}
                        openConnectModal={openConnectModal}
                        handleRemoveImage={handleRemoveImage}
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
                        setCollectProfileLoading={setCollectProfileLoading}
                        setMirrorProfileLoading={setMirrorProfileLoading}
                        setReactProfileLoading={setReactProfileLoading}
                        // profile={autographData?.profile}
                        preElement={preElement}
                        handleImagePaste={handleImagePaste}
                        router={router}
                      />
                    )}
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col gap-2 px-4 order-1 tablet:order-2">
                  <Collections
                    dispatch={dispatch}
                    autoCollections={autographData?.collections}
                    router={router}
                    autoProfile={autographData?.profile}
                    imageLoading={imageLoading}
                    address={address}
                    lensProfile={lensProfile}
                    openConnectModal={openConnectModal}
                    handleLensSignIn={handleLensSignIn}
                  />
                </div>
              </div>
              <Drops
                allDrops={autographData?.drops}
                autoProfile={autographData?.profile}
                router={router}
              />
            </div>
          )
        )}
      </div>
    );
  }

  return <RouterChange />;
};

export default Autograph;
