import { FunctionComponent } from "react";
import Switcher from "./Switcher";
import Channels from "./Channels";
import Connect from "./Connect";
import Tabs from "./Tabs";
import Interactions from "../../Interactions/modules/Interactions";
import { SideBarProps } from "../types/sidebar.types";

const SideBar: FunctionComponent<SideBarProps> = ({
  openConnectModal,
  connected,
  handleLensSignIn,
  tab,
  setTab,
  dispatch,
  viewer,
  options,
  videoSync,
  fetchMoreVideos,
  hasMore,
  scrollHeight,
  collectors,
  collectLoading,
  getMorePostCollects,
  hasMoreCollects,
  router,
  commentId,
  dispatchVideos,
  mainVideo,
  address,
  currency,
  setCurrency,
  totalAmount,
  approved,
  buyNFT,
  approveSpend,
  purchaseLoading,
  historySwitch,
  setHistorySwitch,
  getMoreBuyerHistory,
  getMoreUserHistory,
  action,
  profile,
  mainNFT,
  collections,
  isCreator,
  historyLoading,
  commentors,
  likeCommentLoading,
  mirrorCommentLoading,
  collectCommentLoading,
  collectVideo,
  likeVideo,
  getMorePostComments,
  mirrorVideo,
  hasMoreComments,
  commentsLoading,
  historyData
}): JSX.Element => {
  return (
    <div className="relative w-full lg:w-80 h-fit lg:h-full flex flex-col">
      <Switcher router={router} options={options} dispatch={dispatch} />
      <Tabs tab={tab} setTab={setTab} viewer={viewer} />
      {tab === 0 ? (
        <Channels
          dispatch={dispatch}
          dispatchVideos={dispatchVideos}
          videoSync={videoSync}
          fetchMoreVideos={fetchMoreVideos}
          hasMore={hasMore}
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
          currency={currency}
          setCurrency={setCurrency}
          totalAmount={totalAmount}
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collections={collections}
          address={address}
          historyData={historyData}
          historyLoading={historyLoading}
          historySwitch={historySwitch}
          setHistorySwitch={setHistorySwitch}
          getMoreBuyerHistory={getMoreBuyerHistory}
          getMoreUserHistory={getMoreUserHistory}
          isCreator={isCreator}
          action={action}
        />
      )}
      <Connect
        router={router}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        openConnectModal={openConnectModal}
      />
    </div>
  );
};

export default SideBar;
