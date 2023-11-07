import { FunctionComponent } from "react";
import Switcher from "./Switcher";
import Channels from "./Channels";
import Connect from "./Connect";
import Tabs from "./Tabs";
import Interactions from "../../Interactions/modules/Interactions";
import { SideBarProps } from "../types/sidebar.types";

const SideBar: FunctionComponent<SideBarProps> = ({
  profile,
  handleConnect,
  connected,
  handleLensSignIn,
  tab,
  setTab,
  dispatch,
  viewer,
  dispatchVideos,
  options,
  videoSync,
  fetchMoreVideos,
  hasMore,
  scrollHeight,
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
  commentId,
  mainVideo,
}): JSX.Element => {
  return (
    <div className="relative w-full lg:w-80 h-fit lg:h-full flex flex-col">
      <Switcher options={options} dispatch={dispatch} />
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
        />
      )}
      <Connect
        handleConnect={handleConnect}
        connected={connected}
        handleLensSignIn={handleLensSignIn}
        profile={profile}
      />
    </div>
  );
};

export default SideBar;
