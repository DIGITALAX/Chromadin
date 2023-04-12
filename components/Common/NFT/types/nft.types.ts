import { UploadedMedia } from "@/components/Home/types/home.types";
import { Erc20, Profile } from "@/components/Home/types/lens.types";
import { FormEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";

export type NFTProps = {
  mainNFT: MainNFT | undefined;
  viewer: string;
};

export type UserCommentProps = {
  authStatus: boolean;
  profileId: string;
  commentVideo: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  handleConnect: () => void;
  commentDescription: string;
  commentLoading: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: Ref<HTMLTextAreaElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: any) => void;
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
  setCollectOpen: (e: boolean) => void;
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
};

export type MainDropProps = {
  mainNFT: MainNFT | undefined;
};

export interface MainNFT {
  name: string;
  media: string;
  description: string;
  drop: {
    name: string;
    image: string;
  };
  type: string;
  creator: {
    media: string;
    name: string;
  };
  price: string[];
  acceptedTokens: string[];
}

export type DescriptionProps = {
  mainNFT: MainNFT | undefined;
};

export type OptionsProps = {
  videoLoading: boolean;
  imageLoading: boolean;
  commentLoading: boolean;
  uploadImage: (e: FormEvent) => Promise<void>;
  uploadVideo: (e: FormEvent) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  gifOpen: boolean;
  collectOpen: boolean;
  setCollectOpen: (e: boolean) => void;
};

export type ImageUploadsProps = {
  handleRemoveImage: (e: UploadedMedia) => void;
  commentLoading: boolean;
  postImagesDispatched?: UploadedMedia[];
};
