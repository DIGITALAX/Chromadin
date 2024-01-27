import { FunctionComponent } from "react";
import Comments from "./Comments";
import Collectors from "./Collectors";
import { InteractionProps } from "../types/interactions.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import lodash from "lodash";
import Switch from "./Switch";
import Options from "./Options";

const Interactions: FunctionComponent<InteractionProps> = ({
  viewer,
  commentors,
  getMorePostComments,
  commentsLoading,
  collectors,
  collectLoading,
  getMorePostCollects,
  hasMoreCollects,
  hasMoreComments,
  mirrorVideo,
  collectVideo,
  likeVideo,
  mirrorCommentLoading,
  likeCommentLoading,
  collectCommentLoading,
  router,
  dispatch,
  lensProfile,
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
  historyLoading,
  historySwitch,
  setHistorySwitch,
  getMoreBuyerHistory,
  getMoreUserHistory,
  action,
  mainNFT,
  collections,
  isCreator,
historyData
}): JSX.Element => {
  return (
    <div className="relative w-full lg:w-80 lg:shrink-0 xl:h-full flex-col border border-white h-100 lg:h-128 xl:min-h-[55rem] flex overflow-y-scroll">
      <div className="relative w-full h-full flex flex-col bg-verde">
        <div className="relative w-full h-fit flex flex-row py-2 bg-black rounded-tl-xl border-b border-white">
          <div className="relative w-full h-fit font-arcade text-white flex justify-center text-sm uppercase">
            {viewer !== "collect" ? "STREAM CHAT" : "EMBRACE THE DIN"}
          </div>
          <div className="relative w-fit h-full align-center flex pl-2 rotate-180">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
              width={20}
              height={20}
              alt="player"
              draggable={false}
            />
          </div>
        </div>
        {viewer !== "collect" ? (
          <Comments
            commentors={commentors}
            getMorePostComments={getMorePostComments}
            commentsLoading={commentsLoading}
            video={
              lodash.find(dispatchVideos, {
                id: mainVideo.id,
              })!
            }
            hasMoreComments={hasMoreComments}
            mirrorComment={mirrorVideo}
            collectComment={collectVideo}
            likeComment={likeVideo}
            likeCommentLoading={likeCommentLoading}
            mirrorCommentLoading={mirrorCommentLoading}
            collectCommentLoading={collectCommentLoading}
            dispatch={dispatch}
            lensProfile={lensProfile}
            commentId={commentId}
            router={router}
          />
        ) : (
          <Options router={router} />
        )}
        {viewer !== "collect" ? (
          <Collectors
            collectors={collectors}
            collectLoading={collectLoading}
            getMorePostCollects={getMorePostCollects}
            hasMoreCollects={hasMoreCollects}
          />
        ) : (
          <Switch
            currency={currency}
            setCurrency={setCurrency}
            profile={lensProfile}
            totalAmount={totalAmount}
            approved={approved}
            mainNFT={mainNFT}
            buyNFT={buyNFT}
            approveSpend={approveSpend}
            purchaseLoading={purchaseLoading}
            collections={collections}
            dispatch={dispatch}
            router={router}
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
      </div>
    </div>
  );
};

export default Interactions;
