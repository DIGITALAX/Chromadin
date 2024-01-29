import { Collection } from "@/components/Home/types/home.types";
import {
  Erc20,
  Profile,
  Post,
  Mirror,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { NextRouter } from "next/router";
import { FormEvent, KeyboardEvent, RefObject, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";

export type FeedPublicationProps = {
  router: NextRouter;
  publication: Post | Mirror | Quote | Comment;
  dispatch: Dispatch<AnyAction>;
  height?: string;
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
  index: number;
  openMirrorChoice: boolean[];
  main: boolean;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    comment: boolean;
    like: boolean;
  };
  setOpenComment: (e: SetStateAction<number | undefined>) => void;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
};

export type ProfileSideBarProps = {
  publication: Post | Mirror | Quote | Comment;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  dispatch: Dispatch<AnyAction>;
  index: number;
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
  setOpenComment: (e: SetStateAction<number | undefined>) => void;
  main: boolean;
  router: NextRouter;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    comment: boolean;
    like: boolean;
  };
};

export type ReactionProps = {
  id: string;
  dispatch: Dispatch<AnyAction>;
  publication: Post;
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
  index: number;
  setOpenComment: (e: SetStateAction<number | undefined>) => void;
  router: NextRouter;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    comment: boolean;
    like: boolean;
  };
  main: boolean;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type PersonalTimelineProps = {
  feed: (Post | Mirror | Quote)[];
  feedDispatch: (Post | Mirror | Quote)[];
  dispatch: Dispatch<AnyAction>;
  hasCollected: boolean[];
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
  address: `0x${string}` | undefined;
  viewerOpen: boolean;
  router: NextRouter;
};

export type CommentsProps = {
  router: NextRouter;
  commentors: Comment[];
  lensProfile: Profile | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  feedType: string;
  dispatch: Dispatch<AnyAction>;
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
  fetchMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  commentsLoading: boolean;
  comment: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  profileType: string;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  mediaLoading: {
    video: boolean;
    image: boolean;
  };
  enabledCurrencies: Erc20[];
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  secondaryComment: string;
  openComment: number | undefined;
};

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export interface CollectValueType {
  freeCollectModule?: {
    followerOnly: boolean;
  };
  revertCollectModule?: boolean;
  feeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  limitedTimedFeeCollectModule?: {
    collectLimit: string;
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
  timedFeeCollectModule?: {
    amount: {
      currency: string;
      value: string;
    };
    recipient: string;
    referralFee: number;
    followerOnly: boolean;
  };
}

export type MakeCommentProps = {
  address: `0x${string}` | undefined;
  comment: (id: string, index: number, main?: boolean) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentDescription: string;
  lensProfile: Profile | undefined;
  postCollectGif: PostCollectGifState;
  commentLoading: boolean;
  id: string;
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  index: number;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  main?: boolean;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  mediaLoading: {
    video: boolean;
    image: boolean;
  }[];
  openConnectModal: (() => void) | undefined;
  enabledCurrencies: Erc20[];
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
};

export type OptionsPostProps = {
  dispatch: Dispatch<AnyAction>;
  mediaLoading: {
    video: boolean;
    image: boolean;
  }[];
  index: number;
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  id: string;
  postLoading: boolean;
  postCollectGif: PostCollectGifState;
};

export type SwitchProps = {
  router: NextRouter;
  history: string;
  profileType: string;
  lensProfile: Profile | undefined;
  setOpenProfileMirrorChoice: (e: boolean[]) => void;
  openProfileMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: (Post | Mirror | Quote)[];
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
  commentOpen: number | undefined;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  commentLoading: boolean;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  mediaLoading: {
    video: boolean;
    image: boolean;
  };
  enabledCurrencies: Erc20[];
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  profile: Profile | undefined;
  profileDispatch: (Post | Mirror | Quote)[];
  quickProfiles: Profile[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  hasMoreSearch: boolean;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  profileCollectionsLoading: boolean;
};

export type AllPostsProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  openMirrorChoice: boolean[];
  history: string;
  setOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    comment: boolean;
    like: boolean;
  }[];
  setOpenComment: (e: SetStateAction<number | undefined>) => void;
  hasMore: boolean;
  mainPost: Post | Mirror | Quote | Comment | undefined;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  like: (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ) => Promise<void>;
  comment: (id: string, index: number) => Promise<void>;
  collect: (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirror: (id: string, index: number, main?: boolean) => Promise<void>;
  commentOpen: number | undefined;
  commentDescription: string;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  lensProfile: Profile | undefined;
  mediaLoading: {
    video: boolean;
    image: boolean;
  }[];
  allPosts: (Mirror | Quote | Post)[];
  enabledCurrencies: Erc20[];
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  quickProfiles: Profile[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  mainInteractionsLoading: {
    mirror: boolean;
    collect: boolean;
    comment: boolean;
    like: boolean;
  };
  profileCollections: Collection[];
  profile: Profile | undefined;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  commentors: Comment[];
  fetchMoreComments: () => Promise<void>;
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  commentLoading: boolean;
  postCollectGif: PostCollectGifState;
  mainPostLoading: boolean;
  openMainMirrorChoice: boolean[];
  setMainOpenMirrorChoice: (e: SetStateAction<boolean[]>) => void;
  setMainMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  mainMediaLoading: {
    image: boolean;
    video: boolean;
  }[];
  postsLoading: boolean;
};

export type QuickProfilesProps = {
  quickProfiles: Profile[];
  router: NextRouter;
};

export type AccountProps = {
  profile: Profile | undefined;
  profileCollections?: Collection[];
  dispatch: Dispatch<AnyAction>;
  router?: NextRouter;
};

export type SearchProps = {
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  router: NextRouter;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
};

export type SuperCreatorProps = {
  dispatch: Dispatch<AnyAction>;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  lensProfile: Profile | undefined;
};

export type MakePostProps = {
  dispatch: Dispatch<AnyAction>;
  lensProfile: Profile | undefined;
  address: `0x${string}` | undefined;
};

export type QuoteProps = {
  publication: Comment | Post | Quote;
};
