import { Profile, Post, Comment } from "@/components/Home/types/generated";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

export type ChannelsProps = {
  dispatch: Dispatch<AnyAction>;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  fetchMoreVideos: () => Promise<
    | {
        videos: Post[];
        mirrors: boolean[];
        collects: boolean[];
        likes: boolean[];
      }
    | undefined
  >;
  hasMore: boolean;
  scrollHeight: string;
};

export type UseChannelsResults = {
  tab: number;
  setTab: (e: number) => void;
  fetchMoreVideos: () => Promise<
    | {
        videos: Post[];
        mirrors: boolean[];
        collects: boolean[];
        likes: boolean[];
      }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  scrollHeight: string;
};

export type UseConnectResults = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  handleRefreshProfile: () => Promise<void>;
  signInLoading: boolean;
};

export type ConnectProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
};

export type AuthProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
  mainPage?: boolean;
};

export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
  mainPage?: boolean;
};

export type ProfileProps = {
  profile: Profile | undefined;
  mainPage?: boolean;
};

export type TabProps = {
  tab: number;
  setTab: (e: number) => void;
  viewer: string;
};

export type SideBarProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
  tab: number;
  setTab: (e: number) => void;
  dispatch: Dispatch<AnyAction>;
  viewer: string;
  dispatchVideos: Post[];
  options: string;
  videoSync: VideoSyncState;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  hasMore: boolean;
  scrollHeight: string;
  commentors: Comment[];
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeVideo: (id?: string) => Promise<void>;
  collectVideo: (id?: string) => Promise<void>;
  mirrorVideo: (id?: string) => Promise<void>;
  commentId: string;
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  router: NextRouter;
  mainVideo: MainVideoState;
};

export type SwitcherProps = {
  options: string;
  dispatch: Dispatch<AnyAction>;
};
