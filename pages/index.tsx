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
import { useRouter } from "next/router";
import useControls from "@/components/Common/Video/hooks/useControls";
import useInteractions from "@/components/Common/Interactions/hooks/useInteractions";
import useDrop from "@/components/Home/hooks/useDrop";
import useComment from "@/components/Common/NFT/hooks/useComment";
import useCollectOptions from "@/components/Common/NFT/hooks/useCollectOptions";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import RouterChange from "@/components/Common/Loading/RouterChange";
import { TriStateValue } from "@/components/Home/types/generated";

const Home: NextPage = (): JSX.Element => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const profile = useSelector(
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
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );

  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const postImagesDispatched = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer.value
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { handleConnect, handleLensSignIn } = useConnect();
  const { tab, setTab, fetchMoreVideos, scrollHeight } = useChannels();
  const {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
  } = useInteractions();
  const {
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorCommentLoading,
    likeCommentLoading,
    collectCommentLoading,
  } = useControls();
  const { collectionsLoading } = useDrop();
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
    uploadImage,
    uploadVideo,
    handleRemoveImage,
    mappedFeaturedFiles,
    clientRendered,
  } = useImageUpload();
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
            <Switcher options={options} dispatch={dispatch} />
          </div>
          <div className="relative w-full h-full flex flex-row items-center">
            <div className="relative w-fit h-full hidden lg:flex">
              <SideBar
                handleConnect={handleConnect}
                connected={connected}
                handleLensSignIn={handleLensSignIn}
                profile={profile}
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
                commentsLoading={commentsLoading}
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
                collectLoading={collectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
              />
            </div>
            <div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
              <View viewer={viewer} />
              {viewer !== "sampler" && viewer !== "chat" && (
                <NFT
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
                  profileId={profile?.id}
                  commentVideo={commentVideo}
                  handleLensSignIn={handleLensSignIn}
                  handleConnect={handleConnect}
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
              handleConnect={handleConnect}
              connected={connected}
              handleLensSignIn={handleLensSignIn}
              profile={profile}
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
                commentsLoading={commentsLoading}
                dispatchVideos={dispatchVideos}
                hasMoreComments={hasMoreComments}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                likeCommentLoading={likeCommentLoading}
                mirrorCommentLoading={mirrorCommentLoading}
                collectCommentLoading={collectCommentLoading}
                dispatch={dispatch}
                lensProfile={profile}
                commentId={commentId}
                router={router}
                collectors={collectors}
                collectLoading={collectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
              />
            )}
          </div>
          {viewer !== "sampler" && viewer !== "chat" && (
            <div className="w-fit h-full hidden xl:flex">
              <Interactions
                viewer={viewer}
                commentors={commentors}
                getMorePostComments={getMorePostComments}
                commentsLoading={commentsLoading}
                dispatchVideos={dispatchVideos}
                hasMoreComments={hasMoreComments}
                mirrorVideo={mirrorVideo}
                collectVideo={collectVideo}
                likeVideo={likeVideo}
                likeCommentLoading={likeCommentLoading}
                mirrorCommentLoading={mirrorCommentLoading}
                collectCommentLoading={collectCommentLoading}
                dispatch={dispatch}
                lensProfile={profile}
                commentId={commentId}
                router={router}
                collectors={collectors}
                collectLoading={collectLoading}
                getMorePostCollects={getMorePostCollects}
                hasMoreCollects={hasMoreCollects}
                mainVideo={mainVideo}
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
