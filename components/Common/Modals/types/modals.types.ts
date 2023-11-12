import {
  Erc20,
  Post,
  Profile,
  ProfileWhoReactedResult,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { FollowerOnlyState } from "@/redux/reducers/followerOnlySlice";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { PostCollectValuesState } from "@/redux/reducers/postCollectSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { NextRouter } from "next/router";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  Ref,
  RefObject,
} from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";
import { QuickProfilesInterface } from "../../Wavs/types/wavs.types";
import { Collection, UploadedMedia } from "@/components/Home/types/home.types";

export type IndexingModalProps = {
  message: string | undefined;
};

export type CollectModalProps = {
  message: string;
};

export type CollectInfoProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  lensProfile: Profile | undefined;
  address: `0x${string}` | undefined;
  openConnectModal: (() => void) | undefined;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type PurchaseProps = {
  collectInfoLoading: boolean;
  openConnectModal: (() => void) | undefined;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: Profile | undefined;
  collectComment: (id?: any) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
  dispatch: Dispatch<AnyAction>;
};

export type FollowerOnlyProps = {
  profile: Profile | undefined;
  followProfile: () => Promise<void>;
  followLoading: boolean;
  approved: boolean;
  approveCurrency: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  followDetails: FollowerOnlyState;
  unfollowProfile: () => Promise<void>;
};

export type ImageLargeProps = {
  mainImage: string;
  dispatch: Dispatch<AnyAction>;
  type: string;
};

export type SuccessProps = {
  media: string;
  dispatch: Dispatch<AnyAction>;
  coinOp: boolean;
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
  mainVideo: MainVideoState;
  videoRef: Ref<HTMLDivElement>;
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Post[];
  videoSync: VideoSyncState;
  viewer: string;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type SuperFollowProps = {
  dispatch: Dispatch<AnyAction>;
  followSuper: () => Promise<void>;
  quickProfiles: QuickProfilesInterface[];
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
  gifOpen: boolean;
  lensProfile: Profile | undefined;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  enabledCurrencies: Erc20[];
  audienceTypes: string[];
  setAudienceType: (e: string) => void;
  audienceType: string;
  setEnabledCurrency: (e: string) => void;
  enabledCurrency: string | undefined;
  setChargeCollectDropDown: (e: boolean) => void;
  setAudienceDropDown: (e: boolean) => void;
  setCurrencyDropDown: (e: boolean) => void;
  chargeCollectDropDown: boolean;
  quote: Post | Quote | Comment | undefined;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  setReferral: (e: number) => void;
  limit: number;
  setLimit: (e: number) => void;
  value: number;
  setValue: (e: number) => void;
  collectibleDropDown: boolean;
  setCollectibleDropDown: (e: boolean) => void;
  collectible: string;
  setCollectible: (e: string) => void;
  chargeCollect: string;
  setChargeCollect: (e: string) => void;
  limitedDropDown: boolean;
  setLimitedDropDown: (e: boolean) => void;
  limitedEdition: string;
  setLimitedEdition: (e: string) => void;
  setTimeLimit: (e: string) => void;
  timeLimit: string;
  timeLimitDropDown: boolean;
  setTimeLimitDropDown: (e: boolean) => void;
  collectNotif: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  address: `0x${string}` | undefined;
  handlePost: (quote: string | undefined) => Promise<void>;
  postDescription: string;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  clientRendered: boolean;
  caretCoord: {
    x: number;
    y: number;
  };
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
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

export type DecryptProps = {
  dispatch: Dispatch<AnyAction>;
  collections: Collection[];
};

export type LoginProps = {
  dispatch: Dispatch<AnyAction>;
  loginWithWeb2Auth: () => Promise<void>;
  loginLoading: boolean;
};
