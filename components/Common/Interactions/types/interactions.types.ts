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
  baseColor: number;
  selectSize: number;
  setBaseColor: (e: number) => void;
  setSelectSize: (e: number) => void;
  posterSize: number;
  stickerPack: number;
  setPosterSize: (e: number) => void;
  setStickerPack: (e: number) => void;
  posterAmount: number;
  setPosterAmount: (e: number) => void;
};

export type FulfillmentProps = {
  baseColor: number;
  selectSize: number;
  setBaseColor: (e: number) => void;
  setSelectSize: (e: number) => void;
  posterSize: number;
  stickerPack: number;
  setPosterSize: (e: number) => void;
  setStickerPack: (e: number) => void;
  currency: string;
  setCurrency: (e: string) => void;
  posterAmount: number;
  setPosterAmount: (e: number) => void;
  totalAmount: number;
  acceptedtokens: string[]
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
