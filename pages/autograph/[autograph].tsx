import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutograph from "@/components/Autograph/Home/hooks/useAutograph";
import Collections from "@/components/Autograph/Home/modules/Collections";
import Drops from "@/components/Autograph/Home/modules/Drops";
import NotFound from "@/components/Common/Loading/NotFound";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useControls from "@/components/Common/Video/hooks/useControls";
import useAllPosts from "@/components/Common/Wavs/hooks/useAllPosts";
import Account from "@/components/Common/Wavs/modules/Account";
import FeedPublication from "@/components/Common/Wavs/modules/FeedPublication";
import MakeComment from "@/components/Common/Wavs/modules/MakeComment";
import useViewer from "@/components/Home/hooks/useViewer";
import { Mirror, Post, Quote } from "@/components/Home/types/generated";
import { RootState } from "@/redux/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
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
  const { openAccountModal } = useAccountModal();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const enabledCurrencies = useSelector(
    (state: RootState) => state.app.enabledCurrenciesReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const allVideos = useSelector(
    (state: RootState) => state.app.channelsReducer
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const videoInfo = useSelector(
    (state: RootState) => state.app.videoInfoReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const viewer = useSelector(
    (state: RootState) => state.app.viewReducer?.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer(router, dispatch, quickProfiles, lensProfile);
  const { handleLensSignIn, handleLogout } = useConnect(
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
  const { autographLoading, autographData } = useAutograph(
    autograph as string,
    lensProfile
  );
  const { isLargeScreen } = useBar();

  const { fetchMoreVideos, videosLoading, setVideosLoading } = useChannels(
    dispatch,
    lensProfile,
    allVideos,
    fullScreenVideo,
    videoInfo
  );
  const {
    streamRef,
    formatTime,
    volume,
    handleVolumeChange,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    mirror,
    like,
    collect,
    wrapperRef,
    progressRef,
    handleSeek,
    controlInteractionsLoading,
  } = useControls(
    dispatch,
    address,
    publicClient,
    fullScreenVideo,
    allVideos,
    postCollectGif
  );
  const {
    fetchMore,
    postInfo,
    allPosts,
    postMediaLoading,
    setPostMediaLoading,
    postsLoading,
    postInteractionsLoading,
    commentDetails,
    postCaretCoord,
    postProfilesOpen,
    handleMentionClickPost,
    handleKeyDownDeletePost,
    handlePostCommentDescription,
    setOpenComment,
    openComment,
    textElementPost,
    preElementPost,
    mentionProfilesPost,
    openPostMirrorChoice,
    setPostOpenMirrorChoice,
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
    autographData?.profile?.id
  );
  useEffect(() => {
    setTimeout(() => {
      if (!autographLoading && !postsLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [autographLoading]);

  if (!autographLoading && !postsLoading && !globalLoading) {
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
          interactionsLoading={controlInteractionsLoading}
          videoSync={fullScreenVideo}
          allVideos={allVideos}
          router={router}
          openConnectModal={openConnectModal}
          connected={walletConnected}
          handleLogout={handleLogout}
          handleLensSignIn={handleLensSignIn}
          lensProfile={lensProfile}
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          isLargeScreen={isLargeScreen}
          hasMore={videoInfo?.hasMore}
          streamRef={streamRef}
          formatTime={formatTime}
          volume={volume}
          handleVolumeChange={handleVolumeChange}
          volumeOpen={volumeOpen}
          setVolumeOpen={setVolumeOpen}
          handleHeart={handleHeart}
          mirror={mirror}
          collect={collect}
          like={like}
          wrapperRef={wrapperRef}
          progressRef={progressRef}
          handleSeek={handleSeek}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
          dispatch={dispatch}
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
          allPosts?.length > 0 && (
            <div className="relative flex flex-col w-full h-fit gap-20 justify-start px-2 preG:px-8 md:px-20 py-10">
              <Account dispatch={dispatch} profile={autographData?.profile} />
              <div className="relative flex flex-col tablet:flex-row gap-10 tablet:gap-3 items-start justify-center w-full h-full">
                <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4 order-2 tablet:order-1">
                  <InfiniteScroll
                    height={"104.5rem"}
                    loader={""}
                    hasMore={postInfo?.hasMore}
                    next={fetchMore}
                    dataLength={allPosts?.length}
                    className={`relative row-start-1 w-full ml-auto h-full max-w-full overflow-y-scroll`}
                    style={{ color: "#131313", fontFamily: "Digi Reg" }}
                    scrollThreshold={0.9}
                    scrollableTarget={"scrollableDiv"}
                  >
                    <div className="w-full h-full relative flex flex-col gap-4 pb-3">
                      {allPosts?.map(
                        (publication: Post | Quote | Mirror, index: number) => {
                          return (
                            <div
                              className="relative w-full h-fit gap-2 flex flex-col"
                              key={index}
                            >
                              <FeedPublication
                                main={false}
                                setOpenComment={setOpenComment}
                                dispatch={dispatch}
                                publication={publication}
                                collect={collectPost}
                                mirror={mirrorPost}
                                like={likePost}
                                interactionsLoading={
                                  postInteractionsLoading?.[index]
                                }
                                address={address}
                                index={index}
                                openMirrorChoice={openPostMirrorChoice}
                                setOpenMirrorChoice={setPostOpenMirrorChoice}
                                router={router}
                              />
                              {index === openComment && (
                                <MakeComment
                                  id={
                                    publication?.__typename === "Mirror"
                                      ? publication?.mirrorOn?.id
                                      : publication?.id
                                  }
                                  postCollectGif={postCollectGif}
                                  index={index}
                                  enabledCurrencies={enabledCurrencies}
                                  setMediaLoading={setPostMediaLoading}
                                  mediaLoading={postMediaLoading}
                                  comment={commentPost}
                                  commentDescription={
                                    commentDetails?.description
                                  }
                                  textElement={textElementPost}
                                  handleCommentDescription={
                                    handlePostCommentDescription
                                  }
                                  commentLoading={
                                    postInteractionsLoading?.[index]?.comment
                                  }
                                  caretCoord={postCaretCoord}
                                  mentionProfiles={mentionProfilesPost}
                                  profilesOpen={postProfilesOpen}
                                  handleMentionClick={handleMentionClickPost}
                                  handleKeyDownDelete={handleKeyDownDeletePost}
                                  handleLensSignIn={handleLensSignIn}
                                  openConnectModal={openConnectModal}
                                  address={address}
                                  lensProfile={lensProfile}
                                  dispatch={dispatch}
                                  preElement={preElementPost}
                                />
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </InfiniteScroll>
                </div>
                {autographData?.collections?.length > 0 && (
                  <div className="relative w-full h-fit flex flex-col gap-2 px-1 sm:px-4 order-1 tablet:order-2">
                    <Collections
                      dispatch={dispatch}
                      autoCollections={autographData?.collections}
                      router={router}
                      autoProfile={autographData?.profile}
                      address={address}
                      lensProfile={lensProfile}
                      openConnectModal={openConnectModal}
                      handleLensSignIn={handleLensSignIn}
                    />
                  </div>
                )}
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
