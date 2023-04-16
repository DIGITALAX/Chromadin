import Marquee from "@/components/Common/Marquee/Marquee";
import SideBar from "@/components/Common/SideBar/modules/SideBar";
import { NextPage } from "next";
import Head from "next/head";
import NFT from "@/components/Common/NFT/modules/NFT";
import Frequency from "@/components/Common/Frequency/modules/Frequency";
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

const Home: NextPage = (): JSX.Element => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const authStatus = useSelector(
    (state: RootState) => state.app.authStatusReducer.value
  );
  const dispatchVideos = useSelector(
    (state: RootState) => state.app.channelsReducer.value
  );
  const dispatch = useDispatch();
  const { handleConnect, handleLensSignIn, connected } = useConnect();
  const { videos, liked, mirrored, tab, setTab, videosLoading } = useChannels();
  return (
    <div className="relative w-full h-full flex flex-col overflow-x-hidden">
      <Head>
        <title>Chromadin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative w-full h-full flex flex-row xl:flex-nowrap flex-wrap">
        <div className="relative w-full h-fit flex lg:hidden">
          <Switcher />
        </div>
        <div className="relative w-full h-full flex flex-row items-center">
          <div className="relative w-fit h-full hidden lg:flex">
            <SideBar
              handleConnect={handleConnect}
              connected={connected}
              handleLensSignIn={handleLensSignIn}
              authStatus={authStatus}
              profile={profile}
              tab={tab}
              setTab={setTab}
              videos={videos}
              liked={liked}
              mirrored={mirrored}
              viewer={viewer}
              dispatch={dispatch}
              videosLoading={videosLoading}
              dispatchVideos={dispatchVideos}
            />
          </div>
          <div className="relative w-full h-full flex flex-col gap-5 items-center justify-center">
            <View viewer={viewer} />
            <NFT mainNFT={mainNFT} viewer={viewer} />
          </div>
        </div>
        <div className="w-full h-fit flex flex-col lg:hidden">
          <Connect
            handleConnect={handleConnect}
            connected={connected}
            handleLensSignIn={handleLensSignIn}
            authStatus={authStatus}
            profile={profile}
          />
          <Tabs tab={tab} setTab={setTab} viewer={viewer} />
          {tab === 0 ? (
            <Channels
              videos={videos}
              dispatch={dispatch}
              liked={liked}
              mirrored={mirrored}
              videosLoading={videosLoading}
              dispatchVideos={dispatchVideos}
            />
          ) : (
            <Interactions viewer={viewer} />
          )}
        </div>
        <div className="w-fit h-full hidden xl:flex">
          <Interactions viewer={viewer} />
        </div>
      </div>
      <Frequency />
      <Marquee />
    </div>
  );
};

export default Home;
