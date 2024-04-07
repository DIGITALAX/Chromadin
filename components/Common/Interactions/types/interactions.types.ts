import { Profile, Comment, Post } from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";
import { Collection } from "@/components/Home/types/home.types";
import { NextRouter } from "next/router";
import { HistoryDataState } from "@/redux/reducers/historyDataReducer";
import { SetStateAction } from "react";
import { ChannelsState } from "@/redux/reducers/channelsSlice";
import { CollectionInfoState } from "@/redux/reducers/collectionInfoSlice";
import { TFunction } from "i18next";

export enum Viewer {
  Collect = "collect",
  Sampler = "sampler",
  Autograph = "autograph",
  Chat = "chat",
  Stream = "stream",
}

export type InteractionProps = {
  viewer: Viewer;
  commentors: Comment[];
  t: TFunction<"common", undefined>;
  getMorePostComments: () => Promise<void>;
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
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  router: NextRouter;
  allVideos: ChannelsState;
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
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  isCreator: boolean;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  secondaryComment: string;
  collectionInfo: CollectionInfoState;
  interactionsLoading: {
    comment: boolean;
    like: boolean;
    mirror: boolean;
    collect: boolean;
  }[];
  action: Options;
};

export type CommentsProps = {
  commentors: Comment[];
  video: Post;
  interactionsLoading: {
    comment: boolean;
    like: boolean;
    mirror: boolean;
    collect: boolean;
  }[];
  getMorePostComments: () => Promise<void>;
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
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  router: NextRouter;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  secondaryComment: string;
};

export type AccountProps = {
  profile: Profile | undefined;
  isCreator: boolean;
};

export type FulfillmentProps = {
  currency: string;
  t: TFunction<"common", undefined>;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  collectionInfo: CollectionInfoState;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  address: `0x${string}` | undefined;
};

export type CollectorsProps = {
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
  t: TFunction<"common", undefined>;
};

export type PurchaseProps = {
  approved: boolean;
  t: TFunction<"common", undefined>;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  mainNFT: Collection;
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

export type HistoryProps = {
  historyData: HistoryDataState;
  historyLoading: boolean;
  historySwitch: boolean;
  setHistorySwitch: (e: boolean) => void;
  getMoreUserHistory: () => Promise<void>;
  getMoreBuyerHistory: () => Promise<void>;
  t: TFunction<"common", undefined>;
};

export type SwitchProps = {
  t: TFunction<"common", undefined>;
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
  approveSpend: () => Promise<void>;
  buyNFT: () => void;
  purchaseLoading: boolean;
  profile: Profile | undefined;
  isCreator: boolean;
  action: Options;
  collectionInfo: CollectionInfoState;
};

export type OptionsProps = {
  router: NextRouter;
};

export enum Options {
  Account = "account",
  Fulfillment = "fulfillment",
  History = "history",
}
