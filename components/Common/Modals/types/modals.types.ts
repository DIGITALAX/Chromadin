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
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";
import { Viewer } from "../../Interactions/types/interactions.types";
import { ChannelsState } from "@/redux/reducers/channelsSlice";
import { FullScreenVideoState } from "@/redux/reducers/fullScreenVideoSlice";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";
import { UploadedMedia } from "@/components/Home/types/home.types";

export type IndexingModalProps = {
  message: string | undefined;
};

export type CollectModalProps = {
  message: string;
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

export type FullScreenVideoProps = {
  dispatch: Dispatch<AnyAction>;
  allVideos: ChannelsState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  videoSync: FullScreenVideoState;
  viewer: Viewer;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type SuperFollowProps = {
  dispatch: Dispatch<AnyAction>;
  followSuper: () => Promise<void>;
  quickProfiles: Profile[];
  router: NextRouter;
  superCreatorLoading: boolean;
  rain: boolean;
  canvasRef: Ref<HTMLCanvasElement>;
};

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
    collectibleOpen: boolean;
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
      collectibleOpen: boolean;
      collectible: string;
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
    collectibleOpen: boolean;
    collectible: string;
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
      collectibleOpen: boolean;
      collectible: string;
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
