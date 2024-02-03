import { Profile, Post, Comment } from "@/components/Home/types/generated";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { Options, Viewer } from "../../Interactions/types/interactions.types";
import { HistoryDataState } from "@/redux/reducers/historyDataReducer";
import { ChannelsState } from "@/redux/reducers/channelsSlice";
import { CollectionInfoState } from "@/redux/reducers/collectionInfoSlice";
import { SetStateAction } from "react";
import { VideoControls } from "../../Video/types/controls.types";

export type ChannelsProps = {
  dispatch: Dispatch<AnyAction>;
  allVideos: ChannelsState;
  videoSync: VideoControls;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  hasMore: boolean;
  setVideoSync: (e: SetStateAction<VideoControls>) => void;
};

export type ConnectProps = {
  handleLogout: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
};

export type AuthProps = {
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
  mainPage?: boolean;
  handleLogout: () => Promise<void>;
};

export type WalletProps = {
  handleTransaction: (() => void) | undefined;
  isConnected: boolean;
  buttonText: string;
  mainPage?: boolean;
};

export type ProfileProps = {
  profile: Profile | undefined;
  mainPage?: boolean;
  handleLogout: () => Promise<void>;
};

export type TabProps = {
  tab: number;
  setTab: (e: number) => void;
  viewer: Viewer;
};

export type SideBarProps = {
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
  tab: number;
  setTab: (e: number) => void;
  dispatch: Dispatch<AnyAction>;
  viewer: Viewer;
  allVideos: ChannelsState;
  options: Options;
  videoSync: VideoControls;
  setVideoSync: (e: SetStateAction<VideoControls>) => void;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  hasMoreVideos: boolean;
  collectors: any[];
  collectsLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  handleLogout: () => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    collect: boolean;
    comment: boolean;
  }[];
  collectionInfo: CollectionInfoState;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  secondaryComment: string;
  hasMoreCollects: boolean;
  router: NextRouter;
  historyData: HistoryDataState;
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  address: `0x${string}` | undefined;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  isCreator: boolean;
  action: Options;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  like: (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ) => Promise<void>;
  collect: (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirror: (id: string, index: number, main?: boolean) => Promise<void>;
  commentors: Comment[];
  getMorePostComments: () => Promise<void>;
};

export type SwitcherProps = {
  options: Options;
  router: NextRouter;
};
