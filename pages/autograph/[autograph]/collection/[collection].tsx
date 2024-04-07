import useAutoCollection from "@/components/Autograph/Collection/hooks/useAutoCollection";
import Bar from "@/components/Autograph/Common/modules/Bar";
import InDrop from "@/components/Autograph/Collection/modules/InDrop";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useViewer from "@/components/Home/hooks/useViewer";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { setImageViewer } from "@/redux/reducers/imageViewerSlice";
import { RootState } from "@/redux/store";
import { NextPage } from "next";
import Head from "next/head";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/legacy/image";
import Link from "next/link";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import useBar from "@/components/Autograph/Common/hooks/useBar";
import WaveformComponent from "@/components/Home/modules/Waveform";
import Checkout from "@/components/Autograph/Collection/modules/Checkout";
import { useTranslation } from "next-i18next";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useControls from "@/components/Common/Video/hooks/useControls";
import useFulfillment from "@/components/Common/Interactions/hooks/useFulfillment";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import NotFound from "@/components/Common/Loading/NotFound";

const Collection: NextPage<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const { t } = useTranslation("common");
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { autograph, collection } = router.query;
  const { openAccountModal } = useAccountModal();
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer?.value
  );
  const enabledCurrencies = useSelector(
    (state: RootState) => state.app.enabledCurrenciesReducer?.value
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const videoInfo = useSelector(
    (state: RootState) => state.app.videoInfoReducer
  );
  const channels = useSelector((state: RootState) => state.app.channelsReducer);

  const {
    collectionLoading,
    otherCollectionsDrop,
    collection: autoCollection,
  } = useAutoCollection(lensProfile, autograph as string, collection as string);
  const {
    purchaseLoading,
    buyNFT,
    totalAmount,
    approved,
    approveSpend,
    currency,
    setCurrency,
  } = useFulfillment(
    publicClient,
    dispatch,
    address,
    autoCollection!,
    oracleData,
    t
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
  const { isLargeScreen } = useBar();
  const pfp = createProfilePicture(autoCollection?.profile?.metadata?.picture);
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
    t
  );
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      if (!collectionLoading) {
        setGlobalLoading(false);
      }
    }, 1000);
  }, [collectionLoading]);

  if (!collectionLoading && !globalLoading) {
    return (
      <div
        className="relative w-full flex flex-col bg-black items-center justify-start h-full gap-6 z-0"
        id="calc"
      >
        <Head>
          <title>
            Chromadin |{" "}
            {autoCollection?.collectionMetadata?.title?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoCollection?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/collection/${autoCollection?.collectionMetadata?.title
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="og:title"
            content={autoCollection?.collectionMetadata?.title?.toUpperCase()}
          />
          <meta
            name="og:description"
            content={autoCollection?.collectionMetadata?.description}
          />
          <meta
            name="og:image"
            content={
              !autoCollection?.collectionMetadata?.images?.[0]
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoCollection?.collectionMetadata?.images?.[0]?.split(
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
              autoCollection?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/collection/${autoCollection?.collectionMetadata?.title
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoCollection?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/collection/${autoCollection?.collectionMetadata?.title
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !autoCollection?.collectionMetadata?.images?.[0]
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoCollection?.collectionMetadata?.images?.[0]?.split(
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
          router={router}
          t={t}
          interactionsLoading={controlInteractionsLoading}
          handleLogout={handleLogout}
          openConnectModal={openConnectModal}
          connected={walletConnected}
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
          videoSync={videoControlsInfo}
          fetchMoreVideos={fetchMoreVideos}
          videosLoading={videosLoading}
          setVideosLoading={setVideosLoading}
          dispatch={dispatch}
          allVideos={channels}
        />
        {autoCollection && autoCollection?.profile ? (
          <div
            className={`relative w-full h-full flex flex-col lg:flex-row bg-black items-center lg:items-start justify-center gap-12 lg:gap-8 lg:pl-20 pt-10`}
          >
            <div
              className={`relative w-5/6 h-128 flex flex-col items-center justify-center gap-3`}
            >
              <div className="relative flex flex-col w-full h-full bg-offBlack/50 p-2 items-center justify-center">
                <div className="relative w-full h-full flex">
                  {autoCollection?.collectionMetadata?.mediaTypes
                    ?.toLowerCase()
                    ?.toLowerCase()
                    ?.includes("video") ? (
                    <video
                      playsInline
                      muted
                      loop
                      className="flex flex-col w-full h-full object-contain"
                      id={autoCollection?.collectionMetadata?.video}
                      key={autoCollection?.collectionMetadata?.video}
                    >
                      <source
                        src={`${INFURA_GATEWAY}/ipfs/${
                          autoCollection?.collectionMetadata?.video?.split(
                            "ipfs://"
                          )[1]
                        }`}
                        type="video/mp4"
                        draggable={false}
                      />
                    </video>
                  ) : (
                    <Image
                      src={`${INFURA_GATEWAY}/ipfs/${
                        autoCollection?.collectionMetadata?.images?.[0]?.split(
                          "ipfs://"
                        )[1] ||
                        autoCollection?.collectionMetadata?.mediaCover?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      layout="fill"
                      objectFit="contain"
                      className="flex flex-col w-full h-full"
                      draggable={false}
                    />
                  )}

                  {autoCollection?.collectionMetadata?.video && (
                    <div
                      className="absolute w-full h-fit flex bottom-0 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WaveformComponent
                        video={autoCollection?.collectionMetadata?.video}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-row gap-3 justify-end items-end">
                <div
                  className="relative w-5 h-5 cursor-pointer justify-end items-end flex ml-auto"
                  onClick={() =>
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionImage: `${INFURA_GATEWAY}/ipfs/${
                          autoCollection?.collectionMetadata?.images?.[0]?.split(
                            "ipfs://"
                          )[1] ||
                          autoCollection?.collectionMetadata?.video?.split(
                            "ipfs://"
                          )[1]
                        }`,
                        actionType:
                          autoCollection?.collectionMetadata?.mediaTypes,
                      })
                    )
                  }
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
                    alt="expand"
                    layout="fill"
                    className="flex items-center"
                    draggable={false}
                  />
                </div>
                <div
                  className={`relative text-ama items-center flex cursor-pointer justify-center top-1 rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
                  onClick={
                    !address && !lensProfile?.id
                      ? openConnectModal
                      : address && !lensProfile?.id
                      ? () => handleLensSignIn()
                      : () =>
                          dispatch(
                            setMakePost({
                              actionValue: true,
                              actionQuote: autoCollection?.publication,
                            })
                          )
                  }
                >
                  <div className="relative w-6 h-4 flex items-center justify-center">
                    <Image
                      layout="fill"
                      alt="post to lens"
                      src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
                      draggable={false}
                    />
                  </div>
                  <div className="relative w-4 h-4 flex items-center justify-center">
                    <Image
                      layout="fill"
                      alt="post to lens"
                      src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-col lg:items-end items-center lg:justify-start justify-center px-6 sm:px-10 pb-8 lg:overflow-y-scroll">
              <div className="relative flex flex-col gap-3 text-center lg:text-right items-center lg:items-end lg:justify-end w-full h-fit">
                <div className="relative flex flex-col gap-0.5 items-center lg:items-end w-fit h-fit text-center lg:text-right">
                  <div className="relative w-fit h-fit text-white font-earl text-4xl">
                    {autoCollection?.collectionMetadata?.title}
                  </div>
                  <div className="relative w-fit h-fit font-digi text-lg text-verde">
                    {autoCollection?.dropMetadata?.dropTitle}
                  </div>
                </div>

                {autoCollection && (
                  <div className="relative w-fit h-fit text-white font-earl text-2xl">
                    {Number(autoCollection?.soldTokens) ===
                    Number(autoCollection?.amount)
                      ? t("sold")
                      : `${Number(autoCollection?.soldTokens)} /
                  ${Number(autoCollection?.amount)}`}
                  </div>
                )}
                {autoCollection?.profile && autoCollection && (
                  <Link
                    className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                    href={`/autograph/${
                      autoCollection?.profile?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )[1]
                    }`}
                  >
                    <div
                      className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                      id="crt"
                    >
                      {pfp && (
                        <Image
                          src={pfp}
                          layout="fill"
                          alt="pfp"
                          className="rounded-full w-full h-full flex"
                          draggable={false}
                        />
                      )}
                    </div>
                    <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                      {
                        autoCollection?.profile?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )[1]
                      }
                    </div>
                  </Link>
                )}
                <div className="relative w-5/6 break-words h-fit max-h-80 text-white font-earl text-base overflow-y-scroll">
                  {autoCollection?.collectionMetadata?.description}
                </div>
              </div>
              <Checkout
                t={t}
                router={router}
                collection={autoCollection}
                purchaseLoading={purchaseLoading}
                buyNFT={buyNFT}
                totalAmount={totalAmount}
                approved={approved}
                approveSpend={approveSpend}
                currency={currency}
                setCurrency={setCurrency}
              />
              {otherCollectionsDrop?.length > 0 && (
                <InDrop
                  t={t}
                  autoCollection={autoCollection}
                  otherCollectionsDrop={otherCollectionsDrop}
                  router={router}
                  autoProfile={autoCollection?.profile}
                />
              )}
            </div>
          </div>
        ) : (
          <NotFound t={t} router={router} />
        )}
      </div>
    );
  }
  return <RouterChange />;
};

export default Collection;

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
