import { Profile, Publication } from "@/components/Home/types/lens.types";
import { AnyAction, Dispatch } from "redux";

export type InteractionProps = {
  viewer: string;
};

export type CommentsProps = {
  commentors: Publication[];
  video: Publication;
  getMorePostComments: () => Promise<void>;
  commentsLoading: boolean;
  hasMoreComments: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  likeComment: (id?: string) => Promise<void>;
  collectComment: (id?: string) => Promise<void>;
  mirrorComment: (id?: string) => Promise<void>;
  dispatch: Dispatch<AnyAction>;
  hasMirrored: boolean[];
  hasReacted: boolean[];
  authStatus: boolean;
  lensProfile: Profile | undefined;
};

export type AccountProps = {
  profile: Profile | undefined;
};

export type IRLOptionsProps = {
  baseColor: number | undefined;
  selectSize: number | undefined;
  setBaseColor: (e: number | undefined) => void;
  setSelectSize: (e: number | undefined) => void;
  posterSize: number | undefined;
  stickerPack: number | undefined;
  setPosterSize: (e: number | undefined) => void;
  setStickerPack: (e: number | undefined) => void;
  posterAmount: number | undefined;
  setPosterAmount: (e: number | undefined) => void;
};

export type FulfillmentProps = {
  baseColor: number | undefined;
  selectSize: number | undefined;
  setBaseColor: (e: number | undefined) => void;
  setSelectSize: (e: number | undefined) => void;
  posterSize: number | undefined;
  stickerPack: number | undefined;
  setPosterSize: (e: number | undefined) => void;
  setStickerPack: (e: number | undefined) => void;
  currency: number | undefined;
  setCurrency: (e: number | undefined) => void;
  posterAmount: number | undefined;
  setPosterAmount: (e: number | undefined) => void;
};

export type CollectorsProps = {
  collectors: any[];
  collectLoading: boolean;
  getMorePostCollects: () => Promise<void>;
  hasMoreCollects: boolean;
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