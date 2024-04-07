import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoDrop from "@/components/Autograph/Drop/hooks/useAutoDrop";
import AllDrops from "@/components/Autograph/Drop/modules/AllDrops";
import NotFound from "@/components/Common/Loading/NotFound";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useControls from "@/components/Common/Video/hooks/useControls";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { NextPage } from "next";
import Head from "next/head";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { useTranslation } from "next-i18next";

const Drop: NextPage<{ router: NextRouter }> = ({ router }): JSX.Element => {
  const { t, i18n } = useTranslation("common");
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { openAccountModal } = useAccountModal();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const videoInfo = useSelector(
    (state: RootState) => state.app.videoInfoReducer
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer?.value
  );
  const channels = useSelector((state: RootState) => state.app.channelsReducer);
  const enabledCurrencies = useSelector(
    (state: RootState) => state.app.enabledCurrenciesReducer?.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const { autograph, drop } = router.query;
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
    enabledCurrencies,

    t,
    i18n
  );
  const { isLargeScreen } = useBar();
  const { dropLoading, dropData } = useAutoDrop(
    autograph as string,
    drop as string,
    lensProfile
  );

  const {
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
    setVideoControlsInfo,
    videoControlsInfo,
  } = useControls(dispatch, address, publicClient, channels, postCollectGif, t);
  const { fetchMoreVideos, videosLoading, setVideosLoading } = useChannels(
    dispatch,
    lensProfile,
    channels,
    videoInfo,
    setVideoControlsInfo
  );
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
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
            Chromadin |{" "}
            {dropData?.collections?.[0]?.dropMetadata?.dropTitle?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              dropData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/drop/${dropData?.collections?.[0]?.dropMetadata?.dropTitle
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="og:title"
            content={dropData?.collections?.[0]?.dropMetadata?.dropTitle?.toUpperCase()}
          />
          <meta
            name="og:description"
            content={dropData?.collections?.[0]?.dropMetadata?.dropTitle}
          />
          <meta
            name="og:image"
            content={
              !dropData?.collections?.[0]?.dropMetadata?.dropCover
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${dropData?.collections?.[0]?.dropMetadata?.dropCover?.split(
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
              dropData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/drop/${dropData?.collections?.[0]?.dropMetadata?.dropTitle
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              dropData?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/drop/${dropData?.collections?.[0]?.dropMetadata?.dropTitle
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !dropData?.collections?.[0]?.dropMetadata?.dropCover
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${dropData?.collections?.[0]?.dropMetadata?.dropCover?.split(
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
          setVideoControlsInfo={setVideoControlsInfo}
          interactionsLoading={controlInteractionsLoading}
          videoSync={videoControlsInfo}
          allVideos={channels}
          router={router}
          t={t}
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
        {dropData?.collections?.length > 0 ? (
          <div className="relative flex flex-col w-full h-fit gap-10 px-3 sm:px-8 lg:px-20 py-10">
            <AllDrops
              t={t}
              collections={dropData?.collections}
              autoProfile={dropData?.profile}
              router={router}
            />
          </div>
        ) : (
          <NotFound t={t} router={router} />
        )}
      </div>
    );
  }

  return <RouterChange />;
};

export default Drop;

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});
