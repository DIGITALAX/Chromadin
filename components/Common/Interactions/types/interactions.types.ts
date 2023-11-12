import { Profile, Comment, Post } from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";
import { MainNFT, PreRoll } from "../../NFT/types/nft.types";
import { Collection } from "@/components/Home/types/home.types";
import { NextRouter } from "next/router";
import { Url } from "next/dist/shared/lib/router/router";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { Details } from "@/redux/reducers/fulfillmentDetailsSlice";

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
  openConnectModal: (() => void) | undefined;
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
  collections: Collection[];
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  viewScreenNFT: boolean;
  setViewScreenNFT: (e: boolean) => void;
  address: `0x${string}` | undefined;
  oracleValue: number;
  openConnectModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
  cryptoCheckoutLoading: boolean;
  encryptedInformation: string[] | undefined;
  chain: any;
  handleCheckoutCrypto: () => Promise<void>;
  fulfillmentDetails: Details;
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
  tokenIds: string[];
  buyer: string;
  totalPrice: string;
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
  };
  name: string;
  creator: string;
  profile: Profile;
  transactionHash: string;
  blockTimestamp: string;
  type: string;
  chosenAddress: string;
  price: string;
}

export type useHistoryResults = {
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  moreHistoryLoading: boolean;
};

export type HistoryProps = {
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
};

export type CryptoProps = {
  address: `0x${string}` | undefined;
  handleCheckoutCrypto: () => Promise<void>;
  cryptoCheckoutLoading: boolean;
  approved: boolean;
  handleApproveSpend: () => Promise<void>;
  chain: any;
  openChainModal: (() => void) | undefined;
  openConnectModal: (() => void) | undefined;
  coinOp: PreRoll;
};

export type PurchaseCoinOpProps = {
  address: `0x${string}` | undefined;
  currency: string;
  setCurrency: (e: string) => void;
  mainNFT: MainNFT | undefined | Collection;
  dispatch: Dispatch<AnyAction>;
  imageIndex?: number;
  setImageIndex?: (e: number) => void;
  push?: (
    url: Url,
    as?: Url | undefined,
    options?: any | undefined
  ) => Promise<boolean>;
  oracleValue: number;
  openConnectModal: (() => void) | undefined;
  openChainModal: (() => void) | undefined;
  cryptoCheckoutLoading: boolean;
  handleApproveSpend: () => Promise<void>;
  approved: boolean;
  router: NextRouter;
  encryptedInformation: string[] | undefined;
  chain: any;
  handleCheckoutCrypto: () => Promise<void>;
  fulfillmentDetails: Details;
  hideImage?: boolean;
};

export type ShippingInfoProps = {
  fulfillmentDetails: Details;
  dispatch: Dispatch<AnyAction>;
  hideImage?: boolean;
};

export type SwitchProps = {
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
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  address: `0x${string}` | undefined;
  openConnectModal: (() => void) | undefined;
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
  profile: Profile | undefined;
  isCreator: boolean;
  action: string;
  collections: Collection[];
};

export type OptionsProps = {
  router: NextRouter
}