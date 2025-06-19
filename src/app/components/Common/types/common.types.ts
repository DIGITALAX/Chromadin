import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import { Account, Post, SessionClient } from "@lens-protocol/client";
import { SetStateAction } from "react";

export interface LensConnected {
  profile?: Account;
  apollo?: ApolloClient<NormalizedCacheObject>;
  sessionClient?: SessionClient;
}

export interface Drop {
  dropId: string;
  metadata: {
    title: string;
    cover: string;
  };
  publication: Account;
}

export interface Collection {
  amount: string;
  postId: string;
  uri: string;
  printType: string;
  price: string;
  acceptedTokens: string[];
  designer: string;
  tokenIdsMinted: string[];
  collectionId: string;
  unlimited: boolean;
  origin: string;
  publication: Post;
  blockTimestamp: string;
  drop: {
    dropId: string;
    metadata: {
      title: string;
      cover: string;
    };
    uri: string;
    collections: Collection[];
  };
  metadata: {
    access: string[];
    visibility: string;
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string;
    microbrandCover: string;
    microbrand: string;
    images: string[];
    video: string;
    audio: string;
    onChromadin: string;
    sex: string;
    style: string;
  };
}

export enum Options {
  Account = "account",
  Fulfillment = "fulfillment",
  History = "history",
}

export enum Viewer {
  Collect = "collect",
  Sampler = "sampler",
  Autograph = "autograph",
  Chat = "chat",
  Stream = "stream",
}

export interface VideoControls {
  currentTime: number;
  heart: boolean;
  duration: number;
  isPlaying: boolean;
  videosLoading: boolean;
}

export enum Indexar {
  Inactivo = "inactivo",
  Exito = "succ",
  Indexando = "index",
}

export type TabProps = {
  dict: any;
  tab: number;
  setTab: (e: SetStateAction<number>) => void;
};

export type SwitchViewProps = {
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  setCommentsLoading: (e: SetStateAction<boolean>) => void;
  commentsLoading: boolean;
  secondaryComment: string;
  dict: any;
};

export interface CollectionInfo {
  skip: number;
  hasMore: boolean;
  main?: Collection;
  collections: Collection[];
  collectionsLoading: boolean;
  moreCollectionsLoading: boolean;
}

export interface VideoInfo {
  paginated?: string | undefined;
  hasMore: boolean;
  channels: Post[];
  currentIndex: number;
}

export interface Filter {
  prices: { en: string; es: string }[];
  priceSelected: { en: string; es: string };
  dates: { en: string; es: string }[];
  dateSelected: { en: string; es: string };
}
