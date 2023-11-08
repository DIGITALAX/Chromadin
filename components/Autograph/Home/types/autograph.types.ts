import { PreRoll } from "@/components/Common/NFT/types/nft.types";
import {
  Collection,
  Drop,
  UploadedMedia,
} from "@/components/Home/types/home.types";
import {
  Erc20,
  Profile,
  Post,
  Quote,
  Mirror,
} from "@/components/Home/types/generated";
import { ProfileFeedCountState } from "@/redux/reducers/profileFeedCountSlice";
import { NextRouter, Url } from "next/dist/shared/lib/router/router";
import { ClipboardEvent, FormEvent, KeyboardEvent, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type AutoProfileFeedProps = {
  router: NextRouter;
  clientRendered: boolean;
  dispatch: Dispatch<AnyAction>;
  followerOnly: boolean[];
  profileFeed: (Post | Mirror | Quote)[];
  openMirrorChoice: boolean[];
  setOpenMirrorChoice: (e: boolean[]) => void;
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
  openConnectModal: (() => void) | undefined;
  feedType: string;
  profile: Profile | undefined;
  profileCollections?: Collection[];
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
  decryptPost:
    | ((post: Post | Mirror | Quote | Comment) => Promise<void>)
    | ((post: Post | Mirror) => Promise<void>);
  decryptLoading: boolean;
};

export type CollectionsProps = {
  autoCollections: Collection[] | undefined;
  router: NextRouter;
  autoProfile: Profile | undefined;
  handleShareCollection: (collection: Collection) => Promise<void>;
  imageLoading: boolean;
  address: `0x${string}` | undefined;
  profileId: string;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
};

export type CollectionCaseProps = {
  collection: Collection | undefined;
  router: NextRouter;
  autoProfile: Profile | undefined;
  handleShareCollection: (collection: Collection) => Promise<void>;
  imageLoading: boolean;
  address: `0x${string}` | undefined;
  profileId: string;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
};

export type DropsProps = {
  router: NextRouter;
  allDrops: Drop[] | undefined;
  autoProfile: Profile | undefined;
};

export type CoinOpProps = {
  router: NextRouter;
  coinOpItems: (PreRoll | undefined)[];
  autoProfile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
};
