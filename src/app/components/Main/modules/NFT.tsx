import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { Viewer } from "../../Common/types/common.types";
import MainDrop from "./MainDrop";
import Description from "./Description";
import UserComment from "./UserComment";
import { NFTProps } from "../types/main.types";

const NFT: FunctionComponent<NFTProps> = ({
  dict,
  commentsLoading,
  mentionProfiles,
  handleCommentDescription,
  handleKeyDownDelete,
  textElement,
  commentDetails,
  preElement,
  handleMentionClick,
  secondaryComment,
  profilesOpen,
  caretCoord,
  comment,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex">
      <div className="relative w-full h-full sm:h-80 xl:h-72 flex flex-col sm:flex-row">
        <MainDrop />
        {context?.viewer !== Viewer.Collect ? (
          <UserComment
            commentLoading={commentsLoading}
            mentionProfiles={mentionProfiles}
            handleCommentDescription={handleCommentDescription}
            handleKeyDownDelete={handleKeyDownDelete}
            textElement={textElement}
            commentDetails={commentDetails}
            preElement={preElement}
            handleMentionClick={handleMentionClick}
            secondaryComment={secondaryComment}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            comment={comment}
            dict={dict}
          />
        ) : (
          <Description />
        )}
      </div>
    </div>
  );
};

export default NFT;
