import { AnyAction, Dispatch } from "redux";
import { Erc20, Mirror, Profile, Quote, Comment, Post } from "./generated";
import { NextRouter } from "next/router";
import { FormEvent, KeyboardEvent, RefObject, SetStateAction } from "react";
import { Viewer } from "@/components/Common/Interactions/types/interactions.types";
import { FilterState } from "@/redux/reducers/filterSlice";
import { CollectionInfoState } from "@/redux/reducers/collectionInfoSlice";
import { SamplerState } from "@/redux/reducers/samplerSlice";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";
import { TFunction } from "i18next";

export type VendingProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  setDropDownPriceSort: (e: boolean) => void;
  dropDownPriceSort: boolean;
  dropDownDateSort: boolean;
  setDropDownDateSort: (e: boolean) => void;
  handleSearch: (e: FormEvent) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  collectionsLoading: boolean;
  moreCollectionsLoading: boolean;
  handleGetMoreCollections: () => Promise<void>;
  filters: FilterState;
  collectionInfo: CollectionInfoState;
  t: TFunction<"common", undefined>;
};

export interface Collection {
  amount: string;
  pubId: string;
  uri: string;
  dropURI: string;
  profileId: string;
  printType: string;
  prices: string[];
  acceptedTokens: string[];
  owner: string;
  soldTokens: string;
  fulfillerPercent: string;
  fulfillerBase: string;
  fulfiller: string;
  designerPercent: string;
  dropId: string;
  dropCollectionIds: string[];
  collectionId: string;
  unlimited: boolean;
  origin: string;
  publication: Post;
  blockTimestamp: string;
  dropMetadata: {
    dropTitle: string;
    dropCover: string;
  };
  collectionMetadata: {
    access: string[];
    visibility: string;
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    communities: string[];
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string;
    profileHandle: string;
    microbrandCover: string;
    microbrand: string;
    images: string[];
    video: string;
    audio: string;
    onChromadin: string;
    sex: string;
    style: string;
  };
  profile: Profile;
}

export interface Drop {
  dropId: string;
  dropDetails: {
    dropTitle: string;
    dropCover: string;
  };
  publication: Profile;
}

export enum MediaType {
  Video = "video/mp4",
  Image = "image/png",
  Gif = "image/gif",
}

export interface UploadedMedia {
  media: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
}

export type WaveformProps = {
  video: string;
};

export type SwitchViewProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  viewer: Viewer;
  history: string;
  lensProfile: Profile | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  postsLoading: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
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
  mainPost: Post | Mirror | Quote | Comment | undefined;
  mainPostLoading: boolean;
  hasMoreComments: boolean;
  commentors: Comment[];
  commentsLoading: boolean;
  openComment: number | undefined;
  comment: (id: string, index: number) => Promise<void>;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  profile: Profile | undefined;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  commentLoading: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  mediaLoading: {
    image: boolean;
    video: boolean;
  }[];
  enabledCurrencies: Erc20[];
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  allPosts: (Post | Mirror | Quote)[];
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  quickProfiles: Profile[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  statsLoading: boolean;
  graphData: SamplerState;
  setCanvas: (e: string) => void;
  canvas: string;
  setDropDownPriceSort: (e: boolean) => void;
  dropDownPriceSort: boolean;
  dropDownDateSort: boolean;
  setDropDownDateSort: (e: boolean) => void;
  handleSearch: (e: FormEvent) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  moreCollectionsLoading: boolean;
  handleGetMoreCollections: () => Promise<void>;
  filters: FilterState;
  collectionInfo: CollectionInfoState;
  collectionsLoading: boolean;
  mainMediaLoading: {
    image: boolean;
    video: boolean;
  }[];
  interactionsLoading: {
    collect: boolean;
    comment: boolean;
    like: boolean;
    mirror: boolean;
  }[];
  postCollectGif: PostCollectGifState;
  fetchMoreComments: () => Promise<void>;
  setMainOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  setOpenComment: (e: SetStateAction<number | undefined>) => void;
  openMainMirrorChoice: boolean[];
  mainInteractionsLoading: {
    collect: boolean;
    comment: boolean;
    like: boolean;
    mirror: boolean;
  };

  t: TFunction<"common", undefined>;
  setMainMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
};

export type SamplerProps = {
  statsLoading: boolean;
  graphData: SamplerState;
  t: TFunction<"common", undefined>;
  setCanvas: (e: string) => void;
  canvas: string;
};
