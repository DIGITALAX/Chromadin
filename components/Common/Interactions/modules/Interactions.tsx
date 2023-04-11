import { FunctionComponent } from "react";
import Comments from "./Comments";
import Collectors from "./Collectors";
import { InteractionProps } from "../types/interactions.types";
import Image from "next/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import useInteractions from "../hooks/useInteractions";
import useChannels from "../../SideBar/hooks/useChannels";
import lodash from "lodash";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import Switch from "./Switch";
import Options from "./Options";
import useControls from "../../Video/hooks/useControls";

const Interactions: FunctionComponent<InteractionProps> = ({
  viewer,
}): JSX.Element => {
  const {
    commentors,
    getMorePostComments,
    commentsLoading,
    collectors,
    collectLoading,
    getMorePostCollects,
    hasMoreCollects,
    hasMoreComments,
    hasMirrored,
    hasReacted,
  } = useInteractions();
  const { videos } = useChannels();
  const {
    mirrorVideo,
    collectVideo,
    likeVideo,
    mirrorCommentLoading,
    likeCommentLoading,
    collectCommentLoading,
  } = useControls();
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const dispatch = useDispatch();
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
            video={lodash.find(videos, { id: mainVideo.id })!}
            hasMoreComments={hasMoreComments}
            mirrorComment={mirrorVideo}
            collectComment={collectVideo}
            likeComment={likeVideo}
            likeCommentLoading={likeCommentLoading}
            mirrorCommentLoading={mirrorCommentLoading}
            collectCommentLoading={collectCommentLoading}
            dispatch={dispatch}
            hasMirrored={hasMirrored}
            hasReacted={hasReacted}
          />
        ) : (
          <Options />
        )}
        {viewer !== "collect" ? (
          <Collectors
            collectors={collectors}
            collectLoading={collectLoading}
            getMorePostCollects={getMorePostCollects}
            hasMoreCollects={hasMoreCollects}
          />
        ) : (
          <Switch />
        )}
      </div>
    </div>
  );
};

export default Interactions;
