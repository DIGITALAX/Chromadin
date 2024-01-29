import { FunctionComponent } from "react";
import UserComment from "./UserComment";
import MainDrop from "./MainDrop";
import { NFTProps } from "../types/nft.types";
import Description from "./Description";
import { Viewer } from "../../Interactions/types/interactions.types";

const NFT: FunctionComponent<NFTProps> = ({
  mainNFT,
  viewer,
  secondaryComment,
  comment,
  commentDetails,
  interactionsLoading,
  handleCommentDescription,
  textElement,
  caretCoord,
  mentionProfiles,
  profilesOpen,
  handleMentionClick,
  handleKeyDownDelete,
  preElement,
  collectionsLoading,
  openConnectModal,
  handleLensSignIn,
  router,
  dispatch,
  mediaLoading,
  connected,
  lensProfile,
  setMediaLoading,
  postCollectGif,
  mainVideo
}): JSX.Element => {
  return (
    <div className="relative w-full h-full sm:h-80 xl:h-72 flex flex-col sm:flex-row">
      <MainDrop
        mainNFT={mainNFT}
        collectionsLoading={collectionsLoading}
        dispatch={dispatch}
        router={router}
      />
      {viewer !== Viewer.Collect ? (
        <UserComment
          postCollectGif={postCollectGif}
          setMediaLoading={setMediaLoading}
          lensProfile={lensProfile}
          comment={comment}
          main={secondaryComment !== "" ? false : true}
          id={
            secondaryComment !== ""
              ? secondaryComment
              : mainVideo?.id
          }
          handleLensSignIn={handleLensSignIn}
          openConnectModal={openConnectModal}
          connected={connected}
          commentDescription={commentDetails?.description}
          commentLoading={interactionsLoading?.comment}
          handleCommentDescription={handleCommentDescription}
          textElement={textElement}
          caretCoord={caretCoord}
          mentionProfiles={mentionProfiles}
          profilesOpen={profilesOpen}
          handleMentionClick={handleMentionClick}
          mediaLoading={mediaLoading}
          dispatch={dispatch}
          handleKeyDownDelete={handleKeyDownDelete}
          secondaryComment={secondaryComment}
          preElement={preElement}
        />
      ) : (
        <Description
          mainNFT={mainNFT}
          collectionsLoading={collectionsLoading}
        />
      )}
    </div>
  );
};

export default NFT;
