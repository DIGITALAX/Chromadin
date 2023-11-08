import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoProfile from "@/components/Autograph/Home/hooks/useAutoProfile";
import useAutograph from "@/components/Autograph/Home/hooks/useAutograph";
import AutoProfileFeed from "@/components/Autograph/Home/modules/AutoProfileFeed";
import CoinOp from "@/components/Autograph/Home/modules/CoinOp";
import Collections from "@/components/Autograph/Home/modules/Collections";
import Drops from "@/components/Autograph/Home/modules/Drops";
import Encrypted from "@/components/Autograph/Home/modules/Encrypted";
import NotFound from "@/components/Common/Loading/NotFound";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useComment from "@/components/Common/Wavs/hooks/useComment";
import useReactions from "@/components/Common/Wavs/hooks/useReactions";
import Account from "@/components/Common/Wavs/modules/Account";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";

const Autograph: NextPage = (): JSX.Element => {
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autographReducer
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const profileType = useSelector(
    (state: RootState) => state.app.profileReducer.profile?.id
  );
  const commentOpen = useSelector(
    (state: RootState) => state.app.openCommentReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer.value
  );

  const router = useRouter();
  const { push } = router;
  const { autograph } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer();
  const { handleLensSignIn } = useConnect();
  const { openConnectModal } = useConnectModal();
  const { autographLoading, getAllCollections, handleShareCollection } =
    useAutograph();
  const { isLargeScreen } = useBar();
  const { reactPost, collectPost, mirrorPost } = useReactions();
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
  } = useComment();
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
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    uploadImage,
    clientRendered,
  } = useImageUpload();
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
    hasMoreDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileFeed,
    decryptProfileFeed,
    profileFeedCount,
    decryptProfileFeedCount,
    decryptPost,
    decryptLoading,
    setOpenProfileMirrorChoice,
    openProfileMirrorChoice,
  } = useAutoProfile();

  useEffect(() => {
    if (
      !autographLoading &&
      autograph &&
      allDrops.length > 0 &&
      !profileLoading &&
      !decryptProfileLoading &&
      quickProfiles?.length > 0
    ) {
      if (
        quickProfiles?.some(
          (prof) =>
            prof.handle?.toLowerCase() === (autograph as string).toLowerCase()
        )
      ) {
        getAllCollections(autograph as string);
      } else {
        setNotFound(true);
      }
    }
  }, [autograph, allDrops, quickProfiles]);

  useEffect(() => {
    setTimeout(() => {
      if (!autographLoading && !profileLoading && !decryptProfileLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [autographLoading, profileLoading, decryptProfileLoading]);

  if (
    !autographLoading &&
    !profileLoading &&
    !decryptProfileLoading &&
    !globalLoading
  ) {
    return (
      <div
        className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
        id="calc"
      >
        <Head>
          <title>
            Chromadin | {autoDispatch.profile?.handle?.localName?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <meta
            name="og:title"
            content={autoDispatch.profile?.handle?.suggestedFormatted?.localName
              ?.split("@")[1]
              ?.toUpperCase()}
          />
          <meta
            name="og:description"
            content={autoDispatch.profile?.metadata?.bio}
          />
          <meta
            name="og:image"
            content={
              !autoDispatch?.collections?.[0]?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
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
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !autoDispatch?.collections?.[0]?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://www.chromadin.infura-ipfs.io/ipfs/${autoDispatch?.collections?.[0]?.uri?.image?.split(
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
          push={push}
          openConnectModal={openConnectModal}
          connected={connected}
          handleLensSignIn={handleLensSignIn}
          profile={profile}
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          isLargeScreen={isLargeScreen}
        />
        {quickProfiles &&
        allDrops &&
        notFound &&
        !quickProfiles?.some(
          (prof) =>
            prof.handle?.split(".lens")[0]?.toLowerCase() ===
            (autograph as string).toLowerCase()
        ) ? (
          <NotFound router={router} />
        ) : (
          autoDispatch.profile &&
          profileFeed && (
            <div className="relative flex flex-col w-full h-fit gap-3 justify-start px-6 preG:px-8 sm:px-20 py-10">
              <Account dispatch={dispatch} profile={autoDispatch.profile} />
              <div className="relative flex flex-col tablet:flex-row gap-10 tablet:gap-3 items-start justify-center w-full h-full">
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4 order-2 tablet:order-1">
                  <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
                    {profileLoading || decryptProfileLoading ? (
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
                        clientRendered={clientRendered}
                        feedType={profile?.id}
                        hasMoreProfile={hasMoreProfile}
                        fetchMoreProfile={fetchMoreProfile}
                        profileFeed={profileFeed}
                        profileAmounts={profileFeedCount}
                        collectPost={collectPost}
                        mirrorPost={mirrorPost}
                        reactPost={reactPost}
                        commentPost={commentPost}
                        commentOpen={commentOpen}
                        address={address}
                        followerOnly={followerOnlyProfileDecrypt}
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
                        results={results}
                        handleSetGif={handleSetGif}
                        gifOpen={gifOpen}
                        setGifOpen={setGifOpen}
                        handleKeyDownDelete={handleKeyDownDelete}
                        handleLensSignIn={handleLensSignIn}
                        openConnectModal={openConnectModal}
                        handleRemoveImage={handleRemoveImage}
                        profileId={profileId}
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
                        profile={autoDispatch.profile}
                        profileType={profileType}
                        preElement={preElement}
                        handleImagePaste={handleImagePaste}
                        router={router}
                        decryptPost={decryptPost}
                        decryptLoading={decryptLoading}
                      />
                    )}
                  </div>
                </div>
                <div className="relative w-full h-fit flex flex-col gap-2 px-4 order-1 tablet:order-2">
                  <Collections
                    autoCollections={autoDispatch.collections}
                    router={router}
                    handleShareCollection={handleShareCollection}
                    autoProfile={autoDispatch.profile}
                    imageLoading={imageLoading}
                    address={address}
                    profileId={profileId}
                    openConnectModal={openConnectModal}
                    handleLensSignIn={handleLensSignIn}
                  />
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-10 md:gap-5 pt-10">
                {decryptProfileFeed?.length > 0 && (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
                    <div className="relative w-fit h-fit items-start justify-start font-earl text-white break-words text-2xl">
                      Encrypted Posts
                    </div>
                    <Encrypted
                      clientRendered={clientRendered}
                      feedType={profile?.id}
                      hasMoreProfile={hasMoreDecryptProfile}
                      fetchMoreProfile={fetchMoreProfileDecrypt}
                      profileFeed={decryptProfileFeed}
                      profileAmounts={decryptProfileFeedCount}
                      collectPost={collectPost}
                      mirrorPost={mirrorPost}
                      reactPost={reactPost}
                      commentPost={commentPost}
                      commentOpen={commentOpen}
                      address={address}
                      followerOnly={followerOnlyProfile}
                      mirrorLoading={mirrorProfileLoading}
                      reactLoading={reactProfileLoading}
                      setOpenMirrorChoice={setOpenProfileMirrorChoice}
                      openMirrorChoice={openProfileMirrorChoice}
                      collectLoading={collectProfileLoading}
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
                      results={results}
                      handleSetGif={handleSetGif}
                      gifOpen={gifOpen}
                      setGifOpen={setGifOpen}
                      handleKeyDownDelete={handleKeyDownDelete}
                      handleLensSignIn={handleLensSignIn}
                      openConnectModal={openConnectModal}
                      handleRemoveImage={handleRemoveImage}
                      profileId={profileId}
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
                      profile={autoDispatch.profile}
                      profileType={profileType}
                      preElement={preElement}
                      handleImagePaste={handleImagePaste}
                      router={router}
                      decryptPost={decryptPost}
                      decryptLoading={decryptLoading}
                    />
                  </div>
                )}
                {autoDispatch?.collections &&
                  autoDispatch?.collections
                    ?.map((item) => item.coinOp)
                    ?.filter((coinOp) => coinOp !== undefined)?.length > 0 && (
                    <CoinOp
                      coinOpItems={
                        autoDispatch.collections
                          ?.map((item) => item.coinOp)
                          .filter((coinOp) => coinOp !== undefined)!
                      }
                      autoProfile={autoDispatch.profile}
                      router={router}
                      dispatch={dispatch}
                    />
                  )}
                <Drops
                  allDrops={autoDispatch.drops}
                  autoProfile={autoDispatch.profile}
                  router={router}
                />
              </div>
            </div>
          )
        )}
      </div>
    );
  }

  return <RouterChange />;
};

export default Autograph;
