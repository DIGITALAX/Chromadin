import useBar from "@/components/Autograph/Common/hooks/useBar";
import Bar from "@/components/Autograph/Common/modules/Bar";
import useAutoDrop from "@/components/Autograph/Drop/hooks/useAutoDrop";
import AllDrops from "@/components/Autograph/Drop/modules/AllDrops";
import MoreDrops from "@/components/Autograph/Drop/modules/MoreDrops";
import RouterChange from "@/components/Common/Loading/RouterChange";
import useConnect from "@/components/Common/SideBar/hooks/useConnect";
import useViewer from "@/components/Home/hooks/useViewer";
import { RootState } from "@/redux/store";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Drop: NextPage = (): JSX.Element => {
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoDropReducer
  );
  const connected = useSelector(
    (state: RootState) => state.app.connectedReducer?.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const {
    query: { autograph, drop },
    push,
  } = useRouter();
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useViewer();
  const { handleLensSignIn } = useConnect();
  const { openConnectModal } = useConnectModal();
  const { isLargeScreen } = useBar();
  const { dropLoading, getDrop, otherDrops } = useAutoDrop();
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
        {autoDispatch && (
          <div className="relative flex flex-col w-full h-fit gap-10 px-8 sm:px-20 py-10">
            <AllDrops
              autoDrop={autoDispatch.drop}
              autoCollections={autoDispatch.collection}
              autoProfile={autoDispatch.profile}
              push={push}
            />
            {otherDrops?.length > 0 && (
              <MoreDrops
                otherDrops={otherDrops}
                autoProfile={autoDispatch.profile}
                push={push}
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
