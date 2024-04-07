import { Collection, UploadedMedia } from "@/components/Home/types/home.types";
import { Post, Profile } from "@/components/Home/types/generated";
import { NextRouter } from "next/router";
import { FormEvent, KeyboardEvent, RefObject, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Viewer } from "../../Interactions/types/interactions.types";
import { PostCollectGifState } from "@/redux/reducers/postCollectGifSlice";
import { TFunction } from "i18next";

export type NFTProps = {
  mainNFT: Collection | undefined;
  viewer: Viewer;
  connected: boolean;
  lensProfile: Profile | undefined;
  collectionsLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
  comment: (id: string, index: number) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  commentDetails: {
    html: string;
    description: string;
  };
  interactionsLoading: {
    comment: boolean;
    like: boolean;
    mirror: boolean;
    collect: boolean;
  };
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
  postCollectGif: PostCollectGifState;
  mediaLoading: {
    image: boolean;
    video: boolean;
  }[];
  mainVideo: Post;
  t: TFunction<"common", undefined>;
  setMediaLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  secondaryComment: string;
};

export type UserCommentProps = {
  connected: boolean;
  t: TFunction<"common", undefined>;
  lensProfile: Profile | undefined;
  comment: (id: string, index: number, main?: boolean) => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  commentDescription: string;
  commentLoading: boolean;
  main: boolean;
  handleCommentDescription: (e: FormEvent) => Promise<void>;
  textElement: RefObject<HTMLTextAreaElement>;
  preElement: RefObject<HTMLPreElement>;
  caretCoord: {
    x: number;
    y: number;
  };
  id: string;
  postCollectGif: PostCollectGifState;
  secondaryComment: string;
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  handleMentionClick: (user: Profile) => void;
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
  dispatch: Dispatch<AnyAction>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
};

export type MainDropProps = {
  mainNFT: Collection | undefined;
  collectionsLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
};

export type DescriptionProps = {
  mainNFT: Collection | undefined;
  collectionsLoading: boolean;
};

export type OptionsProps = {
  mediaLoading: {
    image: boolean;
    video: boolean;
  };
  commentLoading: boolean;
  postImages: UploadedMedia[] | undefined;
  uploadImage: (
    e: FormEvent,
    canvas?: boolean,
    feed?: boolean
  ) => Promise<void>;
  uploadVideo: (e: FormEvent, feed?: boolean) => Promise<void>;
  setGifOpen: (e: boolean) => void;
  dispatch: Dispatch<AnyAction>;
};

export type ImageUploadsProps = {
  id: string;
  commentLoading: boolean;
  dispatch: Dispatch<AnyAction>;
  postCollectGif: PostCollectGifState;
};
