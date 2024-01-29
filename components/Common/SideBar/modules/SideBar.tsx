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
  hasMoreVideos,
  collectors,
  collectsLoading,
  action,
  getMorePostCollects,
  hasMoreCollects,
  router,
  allVideos,
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
  profile,
  isCreator,
  historyLoading,
  commentors,
  collect,
  like,
  getMorePostComments,
  mirror,
  hasMoreComments,
  commentsLoading,
  historyData,
  handleLogout,
  interactionsLoading,
  collectionInfo,
  setSecondaryComment,
  secondaryComment,
}): JSX.Element => {
  return (
    <div className="relative w-full lg:w-80 h-fit lg:h-full flex flex-col">
      <Switcher router={router} options={options} />
      <Tabs tab={tab} setTab={setTab} viewer={viewer} />
      {tab === 0 ? (
        <Channels
          dispatch={dispatch}
          allVideos={allVideos}
          videoSync={videoSync}
          fetchMoreVideos={fetchMoreVideos}
          hasMore={hasMoreVideos}
        />
      ) : (
        <Interactions
          interactionsLoading={interactionsLoading}
          viewer={viewer}
          collectionInfo={collectionInfo}
          commentors={commentors}
          getMorePostComments={getMorePostComments}
          commentsLoading={commentsLoading}
          allVideos={allVideos}
          hasMoreComments={hasMoreComments}
          mirror={mirror}
          collect={collect}
          like={like}
          dispatch={dispatch}
          lensProfile={profile}
          secondaryComment={secondaryComment}
          setSecondaryComment={setSecondaryComment}
          router={router}
          collectors={collectors}
          collectLoading={collectsLoading}
          getMorePostCollects={getMorePostCollects}
          hasMoreCollects={hasMoreCollects}
          currency={currency}
          setCurrency={setCurrency}
          totalAmount={totalAmount}
          approved={approved}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
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
        handleLogout={handleLogout}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
        openConnectModal={openConnectModal}
      />
    </div>
  );
};

export default SideBar;
