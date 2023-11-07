import { AnyAction, Dispatch } from "redux";
import { Profile } from "./generated";
import { NextRouter } from "next/router";
import { PreRoll } from "@/components/Common/NFT/types/nft.types";

export type ViewProps = {
  viewer: string;
};

export type VendingProps = {
  dispatch: Dispatch<AnyAction>;
  router: NextRouter;
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
  altTag: string;
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
