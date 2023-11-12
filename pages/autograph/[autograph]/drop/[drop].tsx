import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoDrop from "@/components/Autograph/Drop/hooks/useAutoDrop";
import AllDrops from "@/components/Autograph/Drop/modules/AllDrops";
import MoreDrops from "@/components/Autograph/Drop/modules/MoreDrops";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useControls from "@/components/Common/Video/hooks/useControls";
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

const Drop: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(),
  });
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoDropReducer
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer?.value
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const { autograph, drop } = router.query;
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer(router, dispatch, quickProfiles, allDrops);
  const { handleLensSignIn } = useConnect(
    router,
    address,
    isConnected,
    dispatch,
    connectModalOpen,
    publicClient
  );
  const { isLargeScreen } = useBar();
  const { dropLoading, getDrop, otherDrops } = useAutoDrop(
    dispatch,
    lensProfile,
    allDrops
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
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!dropLoading && autograph && drop && allDrops.length > 0) {
      getDrop(autograph as string, drop as string);
    }
  }, [autograph, drop, allDrops]);

  useEffect(() => {
    setTimeout(() => {
      if (!dropLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [dropLoading]);

  if (!dropLoading && !globalLoading) {
    return (
      <div
        className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
        id="calc"
      >
        <Head>
          <title>
            Chromadin | {autoDispatch.drop?.uri?.name?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/drop/${autoDispatch.drop?.uri?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="og:title"
            content={autoDispatch.drop?.uri?.name?.toUpperCase()}
          />
          <meta name="og:description" content={autoDispatch.drop?.uri?.name} />
          <meta
            name="og:image"
            content={
              !autoDispatch.drop?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.drop?.uri?.image?.split(
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
            }/drop/${autoDispatch.drop?.uri?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/drop/${autoDispatch.drop?.uri?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !autoDispatch.drop?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.drop?.uri?.image?.split(
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
        {autoDispatch && (
          <div className="relative flex flex-col w-full h-fit gap-10 px-8 sm:px-20 py-10">
            <AllDrops
              autoDrop={autoDispatch.drop}
              autoCollections={autoDispatch.collection}
              autoProfile={autoDispatch.profile}
              router={router}
            />
            {otherDrops?.length > 0 && (
              <MoreDrops
                otherDrops={otherDrops}
                autoProfile={autoDispatch.profile}
                router={router}
              />
            )}
          </div>
        )}
      </div>
    );
  }

  return <RouterChange />;
};

export default Drop;
