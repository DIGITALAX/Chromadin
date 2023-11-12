import { AnyAction, Dispatch } from "redux";
import { Erc20, Mirror, Post, Profile, Quote, Comment } from "./generated";
import { NextRouter } from "next/router";
import { MainNFT, PreRoll } from "@/components/Common/NFT/types/nft.types";
import { ReactionFeedCountState } from "@/redux/reducers/reactionFeedCountSlice";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  Ref,
  RefObject,
} from "react";
import { CommentFeedCountState } from "@/redux/reducers/commentFeedCountSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { DecryptFeedCountState } from "@/redux/reducers/decryptFeedCountSlice";
import { DecryptProfileFeedCountState } from "@/redux/reducers/decryptProfileCountSlice";
import { IndividualFeedCountState } from "@/redux/reducers/individualFeedCountReducer";
import { ProfileFeedCountState } from "@/redux/reducers/profileFeedCountSlice";
import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { PriceFilterState } from "@/redux/reducers/priceFilterSlice";
import { DateFilterState } from "@/redux/reducers/dateFilterSlice";
import { VideoCountState } from "@/redux/reducers/videoCountSlice";
import ReactPlayer from "react-player";
import { MainNFTState } from "@/redux/reducers/mainNFTSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";

export type ViewProps = {
  viewer: string;
  commentsDispatch: Comment[];
  lensProfile: Profile | undefined;
  mainVideo: MainVideoState;
  feedType: string;
  history: string;
  quickProfiles: QuickProfilesInterface[];
  collectionsLoading: boolean;
  error: boolean;
  moreCollectionsLoading: boolean;
  rates: any[];
  pies: any[];
  graphs: any[];
  statsTitles: any[][];
  stats: any[][];
  statsLoading: boolean;
  totalChanges: number[];
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  graphData: any[];
  setCanvas: (e: string) => void;
  canvas: string;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  commentAmounts: CommentFeedCountState;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  hasMoreAllPosts: boolean;
  scrollPos: number;
  individualCount: IndividualFeedCountState;
  profileFeedCount: ProfileFeedCountState;
  reactions: VideoCountState;
  profileDispatch: (Post | Quote | Mirror)[];
  postImagesDispatched: UploadedMedia[];
  mappedFeaturedFiles: UploadedMedia[];
  collectOpen: boolean;
  streamRef: Ref<ReactPlayer>;
  formatTime: (time: number) => string;
  volume: number;
  handleVolumeChange: (e: FormEvent<Element>) => void;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleHeart: () => void;
  dispatchProfile: Profile | undefined;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  videoSync: VideoSyncState;
  dispatchVideos: Post[];
  fetchMoreVideos: () => Promise<
    | {
        videos: Post[];
        mirrors: boolean[];
        collects: boolean[];
        likes: boolean[];
      }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  setDropDownPriceSort: (e: boolean) => void;
  dropDownPriceSort: boolean;
  dropDownDateSort: boolean;
  setDropDownDateSort: (e: boolean) => void;
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | QuickProfilesInterface)[];
  handleSearchChoose: (
    chosen: Collection | Drop | QuickProfilesInterface
  ) => Promise<void>;
  dateFilter: DateFilterState;
  priceFilter: PriceFilterState;
  collections: Collection[];
  hasMoreCollections: {
    new: boolean;
    old: boolean;
  };
  feed: (Post | Quote | Mirror)[];
  handleGetMoreCollections: () => Promise<void>;
  address: `0x${string}` | undefined;
  searchProfiles: (e: any) => Promise<void>;
  profilesFound: Profile[];
  profilesOpenSearch: boolean;
  fetchMoreSearch: () => Promise<void>;
  hasMoreSearch: boolean;
  setProfilesOpenSearch: (e: boolean) => void;
  setProfilesFound: (e: Profile[]) => void;
  hasMoreProfile: boolean;
  fetchMoreProfile: () => Promise<void>;
  profileRef: RefObject<InfiniteScroll>;
  followerOnlyProfile: boolean[];
  setCollectProfileLoading: (e: boolean[]) => void;
  setMirrorProfileLoading: (e: boolean[]) => void;
  profileLoading: boolean;
  mirrorProfileLoading: boolean[];
  collectProfileLoading: boolean[];
  reactProfileLoading: boolean[];
  setReactProfileLoading: (e: boolean[]) => void;
  setProfileScroll: (e: MouseEvent) => void;
  decryptProfileFeedCount: DecryptProfileFeedCountState;
  hasMoreDecryptProfile: boolean;
  setScrollPosDecryptProfile: (e: MouseEvent) => void;
  scrollRefDecryptProfile: RefObject<InfiniteScroll>;
  followerOnlyProfileDecrypt: boolean[];
  fetchMoreProfileDecrypt: () => Promise<void>;
  decryptProfileLoading: boolean;
  profileCollections: Collection[];
  profileCollectionsLoading: boolean;
  openProfileMirrorChoice: boolean[];
  setOpenProfileMirrorChoice: (e: boolean[]) => void;
  getMorePostCommentsIndividual: () => Promise<void>;
  hasMoreCommentsIndividual: boolean;
  commentsLoadingIndividual: boolean;
  followerOnlyMain: boolean;
  mirrorCommentLoadingIndividual: boolean[];
  collectCommentLoadingIndividual: boolean[];
  hasMore: boolean;
  mainPostLoading: boolean;
  mainPost: Post | Quote | Comment | Mirror | undefined;
  followerOnlyComments: boolean[];
  reactCommentLoading: boolean[];
  setMirrorCommentLoading: (e: boolean[]) => void;
  setCollectCommentLoading: (e: boolean[]) => void;
  setReactCommentLoading: (e: boolean[]) => void;
  setCollectPostLoading: (e: boolean[]) => void;
  setMirrorPostLoading: (e: boolean[]) => void;
  setReactPostLoading: (e: boolean[]) => void;
  collectPostLoading: boolean[];
  reactPostLoading: boolean[];
  mirrorPostLoading: boolean[];
  setOpenCommentMirrorChoice: (e: boolean[]) => void;
  setOpenPostMirrorChoice: (e: boolean[]) => void;
  openCommentMirrorChoice: boolean[];
  openPostMirrorChoice: boolean[];
  clientRendered: boolean;
  reactPost: (
    id: string,
    loader?: ((e: any) => void) | undefined,
    inputIndex?: number | undefined,
    mirrorId?: string | undefined
  ) => Promise<void>;
  collectPost: (
    id: string,
    loader?: ((e: any) => void) | undefined,
    inputIndex?: number | undefined,
    mirrorId?: string | undefined
  ) => Promise<void>;
  mirrorPost: (
    id: string,
    loader?: ((e: any) => void) | undefined,
    inputIndex?: number | undefined,
    mirrorId?: string | undefined
  ) => Promise<void>;
  reactFeedLoading: boolean[];
  mirrorFeedLoading: boolean[];
  collectFeedLoading: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
  openMirrorChoice: boolean[];
  followerOnly: boolean[];
  postsLoading: boolean;
  fetchMore: () => Promise<void>;
  scrollRef: RefObject<InfiniteScroll>;
  setScrollPos: (e: MouseEvent) => void;
  followerOnlyDecrypt: boolean[];
  hasMoreDecrypt: boolean;
  decryptFeedCount: DecryptFeedCountState;
  decryptLoading: boolean;
  fetchMoreDecrypt: () => Promise<void>;
  scrollRefDecrypt: RefObject<InfiniteScroll>;
  setScrollPosDecrypt: (e: MouseEvent) => void;
  commentPost: (id: string) => Promise<void>;
  commentDescription: string;
  textElement: RefObject<HTMLTextAreaElement>;
  handleCommentDescription: (e: any) => Promise<void>;
  commentLoading: boolean;
  caretCoord: {
    x: number;
    y: number;
  };
  profileScroll: number;
  decryptScrollPos: number;
  decryptFeed: Post[];
  filterDecrypt: boolean;
  decryptProfileScroll: number;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  handleGifSubmit: () => Promise<void>;
  handleGif: (e: FormEvent<Element>) => void;
  results: any;
  handleSetGif: (result: any) => void;
  gifOpen: boolean;
  setGifOpen: (e: boolean) => void;
  handleKeyDownDelete: (e: KeyboardEvent) => void;
  preElement: RefObject<HTMLPreElement>;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => Promise<void>;
  commentOpen: string;
  decryptProfileFeed: Post[];
  reactionAmounts: ReactionFeedCountState;
  uploadImages: (
    e: FormEvent<Element> | File[],
    pasted?: boolean | undefined,
    feed?: boolean | undefined
  ) => Promise<void>;
  uploadVideo: (
    e: FormEvent<Element>,
    feed?: boolean | undefined
  ) => Promise<void>;
  imageLoading: boolean;
  videoLoading: boolean;
  handleRemoveImage: (image: UploadedMedia, feed?: boolean | undefined) => void;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
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
};

export type VendingProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  setDropDownPriceSort: (e: boolean) => void;
  dropDownPriceSort: boolean;
  dropDownDateSort: boolean;
  setDropDownDateSort: (e: boolean) => void;
  handleSearch: (e: FormEvent) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | QuickProfilesInterface)[];
  handleSearchChoose: (
    chosen: QuickProfilesInterface | Drop | Collection
  ) => Promise<void>;
  collectionsLoading: boolean;
  error: boolean;
  moreCollectionsLoading: boolean;
  handleGetMoreCollections: () => Promise<void>;
  dateFilter: DateFilterState;
  priceFilter: PriceFilterState;
  dispatchCollections: Collection[];
  hasMoreCollections: {
    new: boolean;
    old: boolean;
  };
};

export interface Collection {
  amount: string;
  blockTimestamp: string;
  collectionId: string;
  name: string;
  owner: string;
  coinOp?: PreRoll;
  drop: {
    name: string;
    image: string;
  };
  uri: {
    description: string;
    external_url: string;
    image: string;
    name: string;
    type: string;
    audio?: string;
  };
  profile: Profile | undefined;
  basePrices: string[];
  acceptedTokens: string[];
  timeStamp?: string;
  tokenIds: string[];
  soldTokens: string[] | null;
  id: string;
  blockNumber: string;
  hasAudio: boolean;
}

export interface Drop {
  dropId: string;
  creator: string;
  collectionIds: string[];
  blockTimestamp: string;
  uri: {
    name: string;
    image: string;
  };
  blockNumber: string;
}

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
}

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}

export type WaveformProps = {
  audio: string | undefined;
  image: string;
};

export type WavsProps = {
  lensProfile: Profile | undefined;
  history: string;
  router: NextRouter;
  decryptProfileScroll: number;
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
  profile: Profile | undefined;
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
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
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
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  profileCollectionsLoading: boolean;
};

export type SwitchViewProps = {
  router: NextRouter;
  dispatch: Dispatch<AnyAction>;
  viewer: string;
  history: string;
  lensProfile: Profile | undefined;
  mirrorFeedLoading: boolean[];
  collectFeedLoading: boolean[];
  reactFeedLoading: boolean[];
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
  profileType: string;
  reactionAmounts: ReactionFeedCountState;
  mainPost: Post | Mirror | Quote | Comment | undefined;
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
  profile: Profile | undefined;
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
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
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
  rates: any[];
  pies: any[];
  graphs: any[];
  statsTitles: any[][];
  stats: any[][];
  statsLoading: boolean;
  totalChanges: number[];
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  graphData: any[];
  setCanvas: (e: string) => void;
  canvas: string;
  setDropDownPriceSort: (e: boolean) => void;
  dropDownPriceSort: boolean;
  dropDownDateSort: boolean;
  setDropDownDateSort: (e: boolean) => void;
  handleSearch: (e: FormEvent) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | QuickProfilesInterface)[];
  handleSearchChoose: (
    chosen: QuickProfilesInterface | Drop | Collection
  ) => Promise<void>;
  collectionsLoading: boolean;
  error: boolean;
  moreCollectionsLoading: boolean;
  handleGetMoreCollections: () => Promise<void>;
  dateFilter: DateFilterState;
  priceFilter: PriceFilterState;
  dispatchCollections: Collection[];
  hasMoreCollections: {
    new: boolean;
    old: boolean;
  };
};

export type SamplerProps = {
  rates: any[];
  pies: any[];
  graphs: any[];
  statsTitles: any[][];
  stats: any[][];
  statsLoading: boolean;
  totalChanges: number[];
  topAccountsFollowed: {
    handle: string;
    percentage: string;
  }[];
  graphData: any[];
  setCanvas: (e: string) => void;
  canvas: string;
};
