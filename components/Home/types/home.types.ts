import { AnyAction, Dispatch } from "redux";
import { Profile } from "./lens.types";

export type ViewProps = {
  viewer: string;
};

export type VendingProps = {
  dispatch: Dispatch<AnyAction>;
};

export interface Collection {
  amount: string;
  blockTimestamp: string;
  collectionId: string;
  name: string;
  owner: string;
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
  };
  profile: Profile | undefined;
  prices: string[]
}

export interface Drop {
  dropId: string;
  creator: string;
  collectionIds: string;
  blockTimestamp: string;
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

export interface ApprovalArgs {
  to: string;
  from: string;
  data: string;
}