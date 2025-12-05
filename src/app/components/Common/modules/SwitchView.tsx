import { FunctionComponent, JSX, useContext } from "react";
import { SwitchViewProps, Viewer } from "../types/common.types";
import { ModalContext } from "@/app/providers";
import Video from "../../Player/modules/Video";
import NFT from "../../Main/modules/NFT";
import useComment from "../../Main/hooks/useComment";
import Vending from "../../Market/modules/Vending";
import MakePost from "../../Chat/modules/MakePost";
import AllPosts from "../../Chat/modules/AllPosts";
import Sampler from "../../Sampler/modules/Sampler";

const SwitchView: FunctionComponent<SwitchViewProps> = ({
  dict,
  fetchMoreVideos,
  setSecondaryComment,
  setCommentsLoading,
  commentsLoading,
  secondaryComment,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const {
    mentionProfiles,
    handleCommentDescription,
    handleKeyDownDelete,
    textElement,
    commentDetails,
    preElement,
    handleMentionClick,
    profilesOpen,
    caretCoord,
    comment,
  } = useComment(dict, setSecondaryComment, setCommentsLoading);

  switch (context?.viewer) {
    case Viewer.Collect:
      return (
        <div className="relative w-full h-full flex items-start justify-start flex-col">
          <Video fetchMoreVideos={fetchMoreVideos} dict={dict} />
          <Vending dict={dict} />
          <NFT
            mentionProfiles={mentionProfiles}
            handleCommentDescription={handleCommentDescription}
            handleKeyDownDelete={handleKeyDownDelete}
            textElement={textElement}
            commentDetails={commentDetails}
            preElement={preElement}
            handleMentionClick={handleMentionClick}
            commentsLoading={commentsLoading}
            secondaryComment={secondaryComment}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            comment={comment}
            dict={dict}
          />
        </div>
      );

    case Viewer.Sampler:
      return (
        <div className="relative w-full h-full flex items-start justify-start flex-col">
          <Video fetchMoreVideos={fetchMoreVideos} dict={dict} />
          <Sampler dict={dict} />
          <NFT
            mentionProfiles={mentionProfiles}
            handleCommentDescription={handleCommentDescription}
            handleKeyDownDelete={handleKeyDownDelete}
            textElement={textElement}
            commentDetails={commentDetails}
            preElement={preElement}
            handleMentionClick={handleMentionClick}
            commentsLoading={commentsLoading}
            secondaryComment={secondaryComment}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            comment={comment}
            dict={dict}
          />
        </div>
      );

    case Viewer.Chat:
      return (
        <div className="relative w-full h-full gap-3 flex items-start justify-center pt-10 overflow-y-hidden">
          <div className="relative w-5/6 md:w-3/4 h-fit flex flex-col items-start justify-start gap-4">
            <div className="relative w-full h-full flex flex-col items-start justify-center gap-3">
              <MakePost dict={dict} />
              <AllPosts dict={dict} />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="relative w-full h-full flex items-start justify-start flex-col">
          <Video fetchMoreVideos={fetchMoreVideos} dict={dict} />
          <NFT
            mentionProfiles={mentionProfiles}
            handleCommentDescription={handleCommentDescription}
            handleKeyDownDelete={handleKeyDownDelete}
            textElement={textElement}
            commentDetails={commentDetails}
            preElement={preElement}
            handleMentionClick={handleMentionClick}
            commentsLoading={commentsLoading}
            secondaryComment={secondaryComment}
            profilesOpen={profilesOpen}
            caretCoord={caretCoord}
            comment={comment}
            dict={dict}
          />
        </div>
      );
  }
};

export default SwitchView;
