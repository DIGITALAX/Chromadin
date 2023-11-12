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
  chain,
  openChainModal,
  currency,
  setCurrency,
  baseColor,
  setBaseColor,
  selectSize,
  setSelectSize,
  totalAmount,
  approved,
  buyNFT,
  approveSpend,
  purchaseLoading,
  viewScreenNFT,
  setViewScreenNFT,
  handleCheckoutCrypto,
  oracleValue,
  cryptoCheckoutLoading,
  imageIndex,
  setImageIndex,
  historyLoading,
  historySwitch,
  setHistorySwitch,
  getMoreBuyerHistory,
  getMoreUserHistory,
  moreHistoryLoading,
  action,
  profile,
  encryptedInformation,
  mainNFT,
  historyReducer,
  collections,
  isCreator,
  buyerHistoryReducer,
  fulfillmentDetails,
  hasMoreHistory,
  hasMoreHistorySpecific,
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
          setBaseColor={setBaseColor}
          selectSize={selectSize}
          baseColor={baseColor}
          setSelectSize={setSelectSize}
          totalAmount={totalAmount}
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collections={collections}
          viewScreenNFT={viewScreenNFT}
          setViewScreenNFT={setViewScreenNFT}
          handleCheckoutCrypto={handleCheckoutCrypto}
          address={address}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          oracleValue={oracleValue}
          openChainModal={openChainModal}
          openConnectModal={openConnectModal}
          encryptedInformation={encryptedInformation}
          fulfillmentDetails={fulfillmentDetails}
          chain={chain as any}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
          historyReducer={historyReducer}
          historyLoading={historyLoading}
          buyerHistoryReducer={buyerHistoryReducer}
          historySwitch={historySwitch}
          setHistorySwitch={setHistorySwitch}
          getMoreBuyerHistory={getMoreBuyerHistory}
          getMoreUserHistory={getMoreUserHistory}
          moreHistoryLoading={moreHistoryLoading}
          hasMoreHistory={hasMoreHistory}
          hasMoreHistorySpecific={hasMoreHistorySpecific}
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
