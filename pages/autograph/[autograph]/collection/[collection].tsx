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
import Image from "next/legacy/image";
import Link from "next/link";
import { NextRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useNetwork } from "wagmi";
import useBar from "@/components/Autograph/Common/hooks/useBar";
import WaveformComponent from "@/components/Home/modules/Waveform";
import Checkout from "@/components/Autograph/Collection/modules/Checkout";
import { setNftScreen } from "@/redux/reducers/nftScreenSlice";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import usePurchase from "@/components/Autograph/Collection/hooks/usePurchase";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import useChannels from "@/components/Common/SideBar/hooks/useChannels";
import useControls from "@/components/Common/Video/hooks/useControls";

const Collection: NextPage<{ router: NextRouter; client: LitNodeClient }> = ({
  router,
  client,
}): JSX.Element => {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { autograph, collection } = router.query;
  const { openConnectModal, connectModalOpen } = useConnectModal();
  const { chain } = useNetwork();
  const { openChainModal } = useChainModal();
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoCollectionReducer
  );
  const purchase = useSelector((state: RootState) => state.app.purchaseReducer);
  const fullScreenVideo = useSelector(
    (state: RootState) => state.app.fullScreenVideoReducer
  );
  const imageLoading = useSelector(
    (state: RootState) => state.app.imageLoadingReducer.value
  );
  const viewScreenNFT = useSelector(
    (state: RootState) => state.app.nftScreenReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer?.value
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const index = useSelector((state: RootState) => state.app.indexModalReducer);
  const postOpen = useSelector(
    (state: RootState) => state.app.makePostReducer.value
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const videoSync = useSelector(
    (state: RootState) => state.app.videoSyncReducer
  );
  const reactId = useSelector(
    (state: RootState) => state.app.reactIdReducer.value
  );
  const approvalArgs = useSelector(
    (state: RootState) => state.app.approvalArgsReducer.args
  );
  const reactions = useSelector(
    (state: RootState) => state.app.videoCountReducer
  );
  const hasMore = useSelector(
    (state: RootState) => state.app.hasMoreVideosReducer.value
  );
  const page = useSelector((state: RootState) => state.app.viewReducer.value);
  const postImages = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const publicationImages = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );
  const seek = useSelector(
    (state: RootState) => state.app.seekSecondReducer.seek
  );
  const encryptedInformation = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer.information
  );
  const { uploadImage } = useImageUpload(
    dispatch,
    page,
    postOpen,
    postImages,
    publicationImages
  );
  const {
    purchaseLoading,
    buyNFT,
    totalAmount,
    approved,
    approveSpend,
    currency,
    setCurrency,
    handleCheckoutCrypto,
    oracleValue,
    cryptoCheckoutLoading,
  } = usePurchase(
    publicClient,
    dispatch,
    address,
    autoDispatch,
    fulfillmentDetails,
    viewScreenNFT,
    success,
    client
  );
  const {
    collectionLoading,
    getCollection,
    otherCollectionsDrop,
    handleShareCollection,
    setImageIndex,
    imageIndex,
  } = useAutoCollection(
    dispatch,
    lensProfile,
    viewScreenNFT,
    autoDispatch.collection,
    allDrops,
    uploadImage
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
  const { isLargeScreen } = useBar();
  const pfp = createProfilePicture(autoDispatch.profile?.metadata?.picture);
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
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!collectionLoading && autograph && collection && allDrops.length > 0) {
      getCollection(autograph as string, collection as string);
    }
  }, [autograph, collection, allDrops]);

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
            Chromadin | {autoDispatch.collection?.name?.toUpperCase()}
          </title>
          <meta
            name="og:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/collection/${autoDispatch.collection?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="og:title"
            content={autoDispatch.collection?.name?.toUpperCase()}
          />
          <meta
            name="og:description"
            content={autoDispatch.collection?.uri?.description}
          />
          <meta
            name="og:image"
            content={
              !autoDispatch.collection?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.collection?.uri?.image?.split(
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
            }/collection/${autoDispatch.collection?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <meta
            name="twitter:url"
            content={`https://www.chromadin.xyz/autograph/${
              autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )[1]
            }/collection/${autoDispatch.collection?.name
              ?.replaceAll(" ", "_")
              ?.toLowerCase()}`}
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="canonical"
            href={
              !autoDispatch.collection?.uri?.image
                ? "https://www.chromadin.xyz/card.png/"
                : `https://chromadin.infura-ipfs.io/ipfs/${autoDispatch.collection?.uri?.image?.split(
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
        {autoDispatch.collection && autoDispatch.profile && (
          <div
            className={`relative w-full h-full flex flex-col lg:flex-row bg-black items-center lg:items-start justify-center gap-12 lg:gap-8 lg:pl-20 pt-10`}
          >
            <div
              className={`relative top-10 w-5/6 h-128 flex flex-col items-center justify-center gap-3`}
            >
              <div className="relative flex flex-col w-full h-full bg-offBlack/50 p-2 items-center justify-center">
                <div className="relative w-full h-full flex">
                  {autoDispatch.collection?.uri?.image &&
                    (autoDispatch.collection.uri.type === "video/mp4" ? (
                      <video
                        playsInline
                        muted
                        loop
                        className="flex flex-col w-full h-full object-contain"
                        controls={
                          autoDispatch.collection.hasAudio ? false : true
                        }
                        id={autoDispatch.collection?.uri?.image}
                        key={autoDispatch.collection?.uri?.image}
                      >
                        <source
                          src={`${INFURA_GATEWAY}/ipfs/${
                            autoDispatch.collection?.uri?.image?.split(
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
                          viewScreenNFT
                            ? autoDispatch.collection?.uri?.image?.split(
                                "ipfs://"
                              )[1]
                            : autoDispatch.collection?.coinOp?.uri?.image[
                                imageIndex
                              ]?.split("ipfs://")[1]
                        }`}
                        layout="fill"
                        objectFit="contain"
                        className="flex flex-col w-full h-full"
                        draggable={false}
                      />
                    ))}
                  {!viewScreenNFT && (
                    <div
                      className={`absolute bottom-2 right-2 w-fit h-fit flex flex-row gap-1.5`}
                    >
                      <div
                        className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageIndex(imageIndex < 1 ? imageIndex + 1 : 0);
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                      <div
                        className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageIndex(imageIndex > 0 ? imageIndex - 1 : 1);
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                    </div>
                  )}
                  {(autoDispatch.collection.uri.audio ||
                    autoDispatch.collection.hasAudio) && (
                    <div
                      className="absolute w-full h-fit flex bottom-0 cursor-default"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <WaveformComponent
                        audio={autoDispatch.collection.uri?.audio}
                        image={autoDispatch.collection.uri?.image}
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
                        actionImage: viewScreenNFT
                          ? autoDispatch.collection?.uri?.image?.split(
                              "ipfs://"
                            )[1]
                          : autoDispatch.collection?.coinOp?.uri?.image[
                              imageIndex
                            ]?.split("ipfs://")[1],
                        actionType: autoDispatch.collection?.uri?.type,
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
                      : imageLoading
                      ? () => {}
                      : () => handleShareCollection()
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
            <div className="relative w-full h-fit flex flex-col items-center lg:justify-start justify-center px-6 sm:px-10 pb-8 lg:overflow-y-scroll">
              <div className="relative flex flex-col gap-3 text-center lg:text-right items-center lg:items-end lg:justify-end w-full h-fit">
                <div className="relative flex flex-col gap-0.5 items-center lg:items-end w-fit h-fit text-center lg:text-right">
                  <div className="relative w-fit h-fit text-white font-earl text-4xl">
                    {autoDispatch.collection?.name}
                  </div>
                  <div className="relative w-fit h-fit font-digi text-lg text-verde">
                    {autoDispatch.collection?.drop?.name}
                  </div>
                </div>
                {autoDispatch.collection?.coinOp && (
                  <div className="relative w-fit h-fit flex flex-col gap-px items-center lg:items-end">
                    <div className="text-center lg:text-right items-center lg:items-end lg:justify-end w-full h-fit font-earl text-moda text-sm flex flex-row">
                      Select mode: NFT or IRL fulfillment
                    </div>
                    <div
                      className="flex relative flex flex-row text-center lg:text-right items-center lg:justify-end w-fit h-full gap-1.5 cursor-pointer"
                      onClick={() => dispatch(setNftScreen(!viewScreenNFT))}
                    >
                      <div className="relative w-7 h-7 flex items-center justify-center">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                          objectFit="cover"
                          draggable={false}
                        />
                      </div>
                      <div className="relative w-fit h-full items-center justify-center flex text-white">
                        <div className="relative flex items-center justify-center w-4 h-3">
                          <Image
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                            draggable={false}
                          />
                        </div>
                      </div>
                      <div className="relative w-7 h-7 flex items-center justify-center">
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmbjKczJYHKu6FkZMoBRBg2ZuszkJ5CA74x8YF2rYzmA7b`}
                          objectFit="cover"
                          draggable={false}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {autoDispatch.collection && (
                  <div className="relative w-fit h-fit text-white font-earl text-2xl">
                    {Number(autoDispatch.collection?.tokenIds?.length) -
                      (autoDispatch.collection?.soldTokens?.length
                        ? autoDispatch.collection?.soldTokens?.length
                        : 0) ===
                    0
                      ? "SOLD OUT"
                      : `${
                          Number(autoDispatch.collection?.tokenIds?.length) -
                          (autoDispatch.collection?.soldTokens?.length
                            ? autoDispatch.collection?.soldTokens?.length
                            : 0)
                        } /
                  ${Number(autoDispatch.collection?.tokenIds?.length)}`}
                  </div>
                )}
                {autoDispatch.profile && autoDispatch.collection && (
                  <Link
                    className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                    href={`/autograph/${
                      autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
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
                        autoDispatch.profile?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )[1]
                      }
                    </div>
                  </Link>
                )}
                <div className="relative w-5/6 break-words h-fit max-h-80 text-white font-earl text-base overflow-y-scroll">
                  {autoDispatch.collection?.uri?.description}
                </div>
              </div>
              <Checkout
                dispatch={dispatch}
                address={address}
                viewScreenNFT={viewScreenNFT}
                router={router}
                autoDispatch={autoDispatch}
                encryptedInformation={encryptedInformation}
                fulfillmentDetails={fulfillmentDetails}
                openChainModal={openChainModal}
                openConnectModal={openConnectModal}
                chain={chain}
                purchaseLoading={purchaseLoading}
                buyNFT={buyNFT}
                totalAmount={totalAmount}
                approved={approved}
                approveSpend={approveSpend}
                currency={currency}
                setCurrency={setCurrency}
                handleCheckoutCrypto={handleCheckoutCrypto}
                oracleValue={oracleValue}
                cryptoCheckoutLoading={cryptoCheckoutLoading}
              />
              {otherCollectionsDrop?.length > 0 && (
                <InDrop
                  autoCollection={autoDispatch.collection}
                  otherCollectionsDrop={otherCollectionsDrop}
                  router={router}
                  autoProfile={autoDispatch.profile}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
  return <RouterChange />;
};

export default Collection;
