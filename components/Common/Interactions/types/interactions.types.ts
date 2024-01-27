import { Profile, Comment, Post } from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";
import { MainNFT } from "../../NFT/types/nft.types";
import { Collection } from "@/components/Home/types/home.types";
import { NextRouter } from "next/router";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { HistoryDataState } from "@/redux/reducers/hasMoreHistoryReducer";

export type InteractionProps = {
  viewer: string;
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
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  commentId: string;
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  router: NextRouter;
  dispatchVideos: Post[];
  mainVideo: MainVideoState;
  historyLoading: boolean;
  historySwitch: boolean;
  historyData: HistoryDataState;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  address: `0x${string}` | undefined;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  isCreator: boolean;
  action: string;
  collections: Collection[];
};

export type CommentsProps = {
  commentors: Comment[];
  video: Post;
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeComment: (id?: string) => Promise<void>;
  collectComment: (id?: string) => Promise<void>;
  mirrorComment: (id?: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  commentId: string;
  router: NextRouter;
};

export type AccountProps = {
  profile: Profile | undefined;
  isCreator: boolean;
};

export type FulfillmentProps = {
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  collections: Collection[];
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  address: `0x${string}` | undefined;
};

export type CollectorsProps = {
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
};

export interface FollowArgs {
  follower: string;
  profileIds: [string];
  datas: [any];
  sig: {
    v: any;
    r: any;
    s: any;
    deadline: any;
  };
}

export type PurchaseProps = {
  approved: boolean;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  mainNFT: MainNFT | undefined | Collection;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  router: NextRouter;
};

export interface History {
  subOrders: Sub[];
  orderId: string;
  totalPrice: string;
  currency: string;
  buyer: string;
  blockTimestamp: string;
  transactionHash: string;
  subOrderCollectionIds: string[];
  profile: Profile;
  collection: Collection;
}

export interface Sub {
  price: string;
  status: string;
  collection: {
    name: string;
    image: string;
    origin: string;
    pubId: string;
  };
  isFulfilled: boolean;
  fulfillerAddress: string;
  amount: string;
}

export type useHistoryResults = {
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
};

export type HistoryProps = {
  historyData: HistoryDataState;
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
};


export type SwitchProps = {
  historyData: HistoryDataState;
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  address: `0x${string}` | undefined;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  mainNFT: MainNFT | undefined;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  profile: Profile | undefined;
  isCreator: boolean;
  action: string;
  collections: Collection[];
};

export type OptionsProps = {
  router: NextRouter;
};
