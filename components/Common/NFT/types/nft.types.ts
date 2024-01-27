import { UploadedMedia } from "@/components/Home/types/home.types";
import { Erc20, Post, Profile } from "@/components/Home/types/generated";
import { NextRouter } from "next/router";
import { ClipboardEvent, FormEvent, KeyboardEvent, RefObject } from "react";
import { AnyAction, Dispatch } from "redux";

export type NFTProps = {
  mainNFT: MainNFT | undefined;
  viewer: string;
  canComment: boolean;
  connected: boolean;
  lensProfile: Profile | undefined;
  collectionsLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  commentVideo: () => Promise<void>;
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
  clientRendered: boolean;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImage: (e: FormEvent) => Promise<void>;
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
  commentId: string | undefined;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type UserCommentProps = {
  connected: boolean;
  lensProfile: Profile | undefined;
  canComment: boolean;
  commentVideo: () => Promise<void>;
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
  clientRendered: boolean;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
  videoLoading: boolean;
  imageLoading: boolean;
  uploadImage: (e: FormEvent) => Promise<void>;
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
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  commentId: string | undefined;
  handleImagePaste: (e: ClipboardEvent<HTMLTextAreaElement>) => void;
};

export type MainDropProps = {
  mainNFT: MainNFT | undefined;
  collectionsLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
};

export interface MainNFT {
  title: string;
  image: string;
  audio: string;
  video: string;
  mediaCover: string;
  description: string;
  type: string;
  drop: {
    dropTitle: string;
    dropCover: string;
  };
  prices: string[];
  acceptedTokens: string[];
  amount: string;
  soldTokens: string;
  publication: Post;
}

export type DescriptionProps = {
  mainNFT: MainNFT | undefined;
  collectionsLoading: boolean;
};

export type OptionsProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  postImages: UploadedMedia[] | undefined;
  uploadImage: (
    e: FormEvent,
    canvas?: boolean,
    feed?: boolean
  ) => Promise<void>;
  uploadVideo: (e: FormEvent, feed?: boolean) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  dispatch: Dispatch<AnyAction>;
};

export type ImageUploadsProps = {
  handleRemoveImage: (e: UploadedMedia, feed?: boolean) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};
