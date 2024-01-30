import {
  Erc20,
  Profile,
  ProfileWhoReactedResult,
  Post,
  SimpleCollectOpenActionModuleInput,
  SimpleCollectOpenActionSettings,
  MultirecipientFeeCollectOpenActionSettings,
} from "@/components/Home/types/generated";
import { NextRouter } from "next/router";
import {
  FormEvent,
  KeyboardEvent,
  Ref,
  RefObject,
  SetStateAction,
} from "react";
import { Action, AnyAction, Dispatch } from "redux";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";
import { Collection, UploadedMedia } from "@/components/Home/types/home.types";
import { Quest } from "../../Video/types/controls.types";

export type IndexingModalProps = {
  message: string | undefined;
};

export type CollectModalProps = {
  message: string;
  dispatch: Dispatch<AnyAction>;
};

export type ErrorProps = {
  dispatch: Dispatch<AnyAction>;
};

export type ImageLargeProps = {
  mainImage: string;
  dispatch: Dispatch<AnyAction>;
  type: string;
};

export type SuccessProps = {
  media: string;
  dispatch: Dispatch<AnyAction>;
};

export type ImageViewerProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
  type: string;
};

export type WhoProps = {
  accounts: ProfileWhoReactedResult[];
  fetchMore: () => Promise<void>;
  loading: boolean;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  router: NextRouter;
  type: number;
};

export type SuperFollowProps = {
  dispatch: Dispatch<AnyAction>;
  followSuper: () => Promise<void>;
  quickProfiles: Profile[];
  router: NextRouter;
  superCreatorLoading: boolean;
  followedSuper: boolean;
};

export type QuestGatesProps = {
  dispatch: Dispatch<Action>;
  gates: {
    erc20?: {
      address: string;
      amount: string;
    }[];
    erc721?: Collection[];
    oneOf?: boolean;
  };
};

export enum ItemType {
  CoinOp = "coinop",
  Chromadin = "chromadin",
  Legend = "legend",
  Listener = "listener",
  F3M = "f3m",
  Other = "other",
  Kinora = "kinora",
  TheDial = "dial",
}

export type PostProps = {
  dispatch: Dispatch<AnyAction>;
  postLoading: boolean;
  handlePostDescription: (e: FormEvent<Element>) => Promise<void>;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  lensProfile: Profile | undefined;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  mediaLoading: {
    image: boolean;
    video: boolean;
  }[];
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  postCollectGif: PostCollectGifState;
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  handlePost: (quote: string | undefined) => Promise<void>;
  postDescription: string;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  quote: Post;
};

export type ClaimProps = {
  message: string;
  dispatch: Dispatch<AnyAction>;
  handleLensSignIn: () => Promise<void>;
  signInLoading: boolean;
  address: `0x${string}` | undefined;
  openConnectModal: (() => void) | undefined;
  lensProfile: Profile | undefined;
};

export type LoginProps = {
  dispatch: Dispatch<AnyAction>;
  loginWithWeb2Auth: () => Promise<void>;
  loginLoading: boolean;
};

export type CollectOptionsProps = {
  id: string;
  type: string;
  dispatch: Dispatch<AnyAction>;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  gifs:
    | {
        [key: string]: UploadedMedia[] | undefined;
      }
    | undefined;
  openMeasure: {
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
};

export type PostCollectGifProps = {
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
  handleGif: (e: string) => Promise<void>;
  openMeasure: {
    searchedGifs: string[];
    search: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
  searchGifLoading: boolean;
};

export type FollowCollectProps = {
  dispatch: Dispatch<AnyAction>;
  type: string;
  collect:
    | {
        item:
          | SimpleCollectOpenActionSettings
          | MultirecipientFeeCollectOpenActionSettings
          | undefined;
        stats: number | undefined;
        id: string;
      }
    | undefined;
  follower: Profile | undefined;
  handleFollow: () => Promise<void>;
  handleCollect: () => Promise<void>;
  handleUnfollow: () => Promise<void>;
  approveSpend: () => Promise<void>;
  transactionLoading: boolean;
  informationLoading: boolean;
  approved: boolean;
};

export type QuestsProps = {
  dispatch: Dispatch<AnyAction>;
  video: Post;
  quests: Quest[];
  signInLoading: boolean;
  questsLoading: boolean;
  handleJoinQuest: (quest: Quest) => Promise<void>;
  joinLoading: boolean[];
  lensProfile: Profile | undefined;
  address: `0x${string}` | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
};

export type MetricsProps = {
  dispatch: Dispatch<AnyAction>;
  mainVideo: Post | undefined;
  lensProfile: Profile | undefined;
  address: `0x${string}` | undefined;
  metricsOpen: boolean;
};

export type QuestSuccessProps = {
  dispatch: Dispatch<AnyAction>;
  image: string;
};
