import { Profile, Post, Comment } from "@/components/Home/types/generated";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import { MainNFT } from "../../NFT/types/nft.types";
import { Details } from "@/redux/reducers/fulfillmentDetailsSlice";
import { Collection } from "@/components/Home/types/home.types";
import { History } from "../../Interactions/types/interactions.types";

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
  handleLensSignIn: () => Promise<void>;
  handleRefreshProfile: () => Promise<void>;
  signInLoading: boolean;
};

export type ConnectProps = {
  router: NextRouter;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
};

export type AuthProps = {
  router: NextRouter;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  profile: Profile | undefined;
  mainPage?: boolean;
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
  router: NextRouter;
};

export type TabProps = {
  tab: number;
  setTab: (e: number) => void;
  viewer: string;
};

export type SideBarProps = {
  openConnectModal: (() => void) | undefined;
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
  commentId: string;
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  router: NextRouter;
  mainVideo: MainVideoState;
  historyReducer: History[];
  historyLoading: boolean;
  buyerHistoryReducer: History[];
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  moreHistoryLoading: boolean;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  hasMoreHistory: {
    old: boolean;
    new: boolean;
  };
  hasMoreHistorySpecific: {
    old: boolean;
    new: boolean;
  };
  address: `0x${string}` | undefined;
  chain: any;
  openChainModal: (() => void) | undefined;
  baseColor: number;
  selectSize: number;
  setBaseColor: (e: number) => void;
  setSelectSize: (e: number) => void;
  currency: string;
  setCurrency: (e: string) => void;
  imageIndex: number;
  setImageIndex: (e: number) => void;
  totalAmount: number;
  approved: boolean;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  viewScreenNFT: boolean;
  setViewScreenNFT: (e: boolean) => void;
  oracleValue: number;
  cryptoCheckoutLoading: boolean;
  encryptedInformation: string[] | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  fulfillmentDetails: Details;
  isCreator: boolean;
  action: string;
  collections: Collection[];
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeVideo: (id?: string) => Promise<void>;
  collectVideo: (id?: string) => Promise<void>;
  mirrorVideo: (id?: string) => Promise<void>;
  commentors: Comment[];
  getMorePostComments: () => Promise<void>;
};

export type SwitcherProps = {
  options: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
};
