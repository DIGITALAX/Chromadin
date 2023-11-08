import { Collection } from "@/components/Home/types/home.types";
import {
  Erc20,
  FollowModule,
  Profile,
  Post,
  Mirror,
  Quote,
  Comment,
} from "@/components/Home/types/generated";
import { CommentFeedCountState } from "@/redux/reducers/commentFeedCountSlice";
import { DecryptFeedCountState } from "@/redux/reducers/decryptFeedCountSlice";
import { DecryptProfileFeedCountState } from "@/redux/reducers/decryptProfileCountSlice";
import { IndividualFeedCountState } from "@/redux/reducers/individualFeedCountReducer";
import { ProfileFeedCountState } from "@/redux/reducers/profileFeedCountSlice";
import { ReactionFeedCountState } from "@/redux/reducers/reactionFeedCountSlice";
import { Url } from "next/dist/shared/lib/router/router";
import { NextRouter } from "next/router";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  Ref,
  RefObject,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AnyAction, Dispatch } from "redux";

export enum MediaType {
  Video,
  Image,
  Gif,
}

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
}

export type FeedPublicationProps = {
  router: NextRouter;
  publication: Post | Mirror | Quote | Comment;
  hasCollected: boolean | undefined;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean;
  height?: string;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  feedType: string;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  profileType: string;
  decryptPost?:
    | ((post: Post | Mirror | Quote | Comment) => Promise<void>)
    | ((post: Post) => Promise<void>);
  decryptLoading?: boolean;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
};

export type ProfileSideBarProps = {
  publication: Post | Mirror | Quote | Comment;
  followerOnly: boolean | undefined;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  dispatch: Dispatch<AnyAction>;
  index: number;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  hasCollected: boolean | undefined;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  feedType: string;
  router: NextRouter;
  profileType: string;
};

export type ReactionProps = {
  id?: string;
  textColor: string;
  commentColor: string;
  mirrorColor: string;
  collectColor: string;
  heartColor: string;
  hasCollected: boolean | undefined;
  hasMirrored: boolean | undefined;
  hasReacted: boolean | undefined;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean;
  publication: Post | Quote | Mirror | Comment;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  index: number;
  mirrorLoading: boolean;
  reactLoading: boolean;
  collectLoading: boolean;
  reactAmount: number;
  collectAmount: number;
  mirrorAmount: number;
  commentAmount: number;
  setCollectLoader?: (e: boolean[]) => void;
  setReactLoader?: (e: boolean[]) => void;
  setMirrorLoader?: (e: boolean[]) => void;
  openComment: string;
  feedType: string;
  profileType: string;
  router: NextRouter;
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
};

export type FeedProps = {
  profile: Profile | undefined;
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  openPostMirrorChoice: boolean[];
  setOpenPostMirrorChoice: (e: boolean[]) => void;
  setOpenCommentMirrorChoice: (e: boolean[]) => void;
  openCommentMirrorChoice: boolean[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  setOpenProfileMirrorChoice: (e: boolean[]) => void;
  openProfileMirrorChoice: boolean[];
  followerOnly: boolean[];
  feedDispatch: (Post | Mirror | Quote)[];
  clientRendered: boolean;
  postsLoading: boolean;
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  profileType: string;
  reactionAmounts: ReactionFeedCountState;
  mainPost: Post | Mirror | Quote | Comment;
  followerOnlyMain: boolean;
  mainPostLoading: boolean;
  hasMoreComments: boolean;
  getMorePostComments: () => Promise<void>;
  commentors: Comment[];
  commentsLoading: boolean;
  reactCommentLoading: boolean[];
  mirrorCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  commentAmounts: CommentFeedCountState;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
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
  gifOpen: boolean;
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
  postImagesDispatched?: UploadedMedia[];
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
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  feedType: string;
  scrollRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  individualAmounts: IndividualFeedCountState;
  fetchMoreProfile: () => Promise<void>;
  hasMoreProfile: boolean;
  followerOnlyProfile: boolean[];
  profileRef: Ref<InfiniteScroll>;
  profileDispatch: (Post | Mirror | Quote)[];
  profileAmounts: ProfileFeedCountState;
  profileLoading: boolean;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  collectProfileLoading: boolean[];
  mirrorProfileLoading: boolean[];
  reactProfileLoading: boolean[];
  setProfileScroll: (e: MouseEvent) => void;
  profileScroll: number;
  quickProfiles: QuickProfilesInterface[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  filterDecrypt: boolean;
  decryptFeed: (Post | Mirror | Quote)[];
  decryptAmounts: DecryptFeedCountState;
  followerOnlyDecrypt: boolean[];
  decryptLoading: boolean;
  fetchMoreDecrypt: () => Promise<void>;
  hasMoreDecrypt: boolean;
  decryptScrollPos: number;
  setScrollPosDecrypt: (e: MouseEvent) => void;
  scrollRefDecrypt: Ref<InfiniteScroll>;
  decryptFeedProfile: (Post | Mirror | Quote)[];
  decryptProfileAmounts: DecryptProfileFeedCountState;
  decryptProfileLoading: boolean;
  fetchMoreProfileDecrypt: () => Promise<void>;
  followerOnlyProfileDecrypt: boolean[];
  scrollRefDecryptProfile: Ref<InfiniteScroll>;
  setScrollPosDecryptProfile: (e: MouseEvent) => void;
  hasMoreDecryptProfile: boolean;
  decryptProfileScrollPos: number;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  profileCollectionsLoading: boolean;
};

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type PersonalTimelineProps = {
  feed: (Post | Mirror | Quote)[];
  feedDispatch: (Post | Mirror | Quote)[];
  reactionAmounts: ReactionFeedCountState;
  dispatch: Dispatch<AnyAction>;
  hasCollected: boolean[];
  followerOnly: boolean[];
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  address: `0x${string}` | undefined;
  viewerOpen: boolean;
  router: NextRouter;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
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

export type IndividualProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  mainPost: Post | Mirror | Quote | Comment;
  feedType: string;
  profileType: string;
  clientRendered: boolean;
  openPostMirrorChoice: boolean[];
  setOpenPostMirrorChoice: (e: boolean[]) => void;
  openCommentMirrorChoice: boolean[];
  setOpenCommentMirrorChoice: (e: boolean[]) => void;
  address: `0x${string}` | undefined;
  followerOnlyMain: boolean;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mainPostLoading: boolean;
  commentAmounts: CommentFeedCountState;
  commentors: Comment[];
  mirrorCommentLoading: boolean[];
  reactCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  followerOnlyComments: boolean[];
  hasMoreComments: boolean;
  fetchMoreComments: () => Promise<void>;
  commentsLoading: boolean;
  collectPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  reactPostLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  postAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
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
  gifOpen: boolean;
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
  postImagesDispatched?: UploadedMedia[];
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
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  individualAmounts: IndividualFeedCountState;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type CommentsProps = {
  router: NextRouter;
  clientRendered: boolean;
  commentAmounts: CommentFeedCountState;
  commentors: Comment[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  feedType: string;
  dispatch: Dispatch<AnyAction>;
  address: `0x${string}` | undefined;
  followerOnly: boolean[];
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  fetchMoreComments: () => Promise<void>;
  hasMoreComments: boolean;
  commentsLoading: boolean;
  setReactLoader: (e: boolean[]) => void;
  setMirrorLoader: (e: boolean[]) => void;
  setCollectLoader: (e: boolean[]) => void;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  commentDescription: string;
  commentLoading: boolean;
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
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
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
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  openComment: string;
  profileType: string;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export interface UploadedMedia {
  cid: string;
  type: MediaType;
}

export interface PostImage {
  item: string;
  type: string;
  altTag: string;
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

export type ImageUploadsProps = {
  handleRemoveImage: (e: UploadedMedia, feed?: boolean) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};

export type MakeCommentProps = {
  address: `0x${string}` | undefined;
  canComment: boolean;
  profileId: string;
  commentPost: (id: string) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  clientRendered: boolean;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  handleRemoveImage: (e: UploadedMedia) => void;
  postImagesDispatched?: UploadedMedia[];
  openConnectModal:( () => void) | undefined;
  mappedFeaturedFiles: UploadedMedia[];
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent) => void;
  results: any[];
  handleSetGif: (result: any) => void;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
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
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type OptionsCommentProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImages: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  dispatch: Dispatch<AnyAction>;
};

export type ProfileFeedProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  profileDispatch: (Post | Mirror | Quote)[];
  hasMoreProfile: boolean;
  fetchMoreProfile: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  clientRendered: boolean;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  profileType: string;
  profileAmounts: ProfileFeedCountState;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
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
  gifOpen: boolean;
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
  postImagesDispatched?: UploadedMedia[];
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
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  feedType: string;
  profileRef: Ref<InfiniteScroll> | undefined;
  setScrollPos?: (e: MouseEvent) => void;
  scrollPos?: number;
  profile: Profile | undefined;
  profileCollections?: Collection[];
  filterDecrypt: boolean;
  decryptFeedProfile: (Post | Mirror | Quote)[];
  decryptProfileAmounts: DecryptProfileFeedCountState;
  fetchMoreProfileDecrypt: () => Promise<void>;
  followerOnlyProfileDecrypt: boolean[];
  scrollRefDecryptProfile?: Ref<InfiniteScroll>;
  setScrollPosDecryptProfile?: (e: MouseEvent) => void;
  hasMoreDecryptProfile: boolean;
  decryptProfileScrollPos?: number;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type SwitchProps = {
  router: NextRouter;
  filterDecrypt: boolean;
  clientRendered: boolean;
  setOpenProfileMirrorChoice: (e: boolean[]) => void;
  openProfileMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  feedDispatch: (Post | Mirror | Quote)[];
  hasMore: boolean;
  profileType: string;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
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
  gifOpen: boolean;
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
  postImagesDispatched?: UploadedMedia[];
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
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  feedType: string;
  scrollRef: Ref<InfiniteScroll>;
  profileRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  profile: Profile | undefined;
  hasMoreProfile: boolean;
  fetchMoreProfile: () => Promise<void>;
  profileDispatch: (Post | Mirror | Quote)[];
  followerOnlyProfile: boolean[];
  profileAmounts: ProfileFeedCountState;
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  setReactProfileLoading: (e: boolean[]) => void;
  collectProfileLoading: boolean[];
  mirrorProfileLoading: boolean[];
  reactProfileLoading: boolean[];
  setProfileScroll: (e: MouseEvent) => void;
  profileScroll: number;
  quickProfiles: QuickProfilesInterface[];
  profileCollections: Collection[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  hasMoreSearch: boolean;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  decryptFeed: (Post | Mirror | Quote)[];
  decryptAmounts: DecryptFeedCountState;
  followerOnlyDecrypt: boolean[];
  fetchMoreDecrypt: () => Promise<void>;
  hasMoreDecrypt: boolean;
  decryptScrollPos: number;
  setScrollPosDecrypt: (e: MouseEvent) => void;
  scrollRefDecrypt: Ref<InfiniteScroll>;
  decryptFeedProfile: (Post | Mirror | Quote)[];
  decryptProfileAmounts: DecryptProfileFeedCountState;
  fetchMoreProfileDecrypt: () => Promise<void>;
  followerOnlyProfileDecrypt: boolean[];
  scrollRefDecryptProfile: Ref<InfiniteScroll>;
  setScrollPosDecryptProfile: (e: MouseEvent) => void;
  hasMoreDecryptProfile: boolean;
  decryptProfileScrollPos: number;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;

  profileCollectionsLoading: boolean;
};

export type AllPostsProps = {
  router: NextRouter;
  filterDecrypt: boolean;
  clientRendered: boolean;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  feedDispatch: (Post | Mirror | Quote)[];
  hasMore: boolean;
  fetchMore: () => Promise<void>;
  address: `0x${string}` | undefined;
  collectPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  reactPost: (
    id: string,
    loader?: (e: boolean[]) => void,
    inputIndex?: number,
    mirrorId?: string
  ) => Promise<void>;
  mirrorLoading: boolean[];
  reactLoading: boolean[];
  collectLoading: boolean[];
  reactionAmounts: ReactionFeedCountState;
  commentOpen: string;
  commentPost: (id: string) => Promise<void>;
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
  gifOpen: boolean;
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
  postImagesDispatched?: UploadedMedia[];
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
  profileId: string;
  handleLensSignIn: () => Promise<void>;
  openConnectModal:( () => void) | undefined;
  feedType: string;
  scrollRef: Ref<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  scrollPos: number;
  quickProfiles: QuickProfilesInterface[];
  searchProfiles: (e: FormEvent) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  hasMoreSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  profileType: string;
  decryptFeed: (Post | Mirror | Quote)[];
  decryptAmounts: DecryptFeedCountState;
  followerOnlyDecrypt: boolean[];
  fetchMoreDecrypt: () => Promise<void>;
  hasMoreDecrypt: boolean;
  decryptScrollPos: number;
  setScrollPosDecrypt: (e: MouseEvent) => void;
  scrollRefDecrypt: Ref<InfiniteScroll>;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export interface QuickProfilesInterface {
  handle: string;
  id: string;
  image: string;
  followModule: FollowModule;
  name: string;
  ownedBy: string;
}

export type QuickProfilesProps = {
  quickProfiles: QuickProfilesInterface[];
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
  openConnectModal:( () => void) | undefined;  profileId: string;
  address: `0x${string}` | undefined;
};

export type MakePostProps = {
  dispatch: Dispatch<AnyAction>;
  profileId: string;
  address: `0x${string}` | undefined;
};

export type QuoteProps = {
  publication: Comment | Post | Quote;
};
