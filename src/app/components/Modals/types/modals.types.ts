import { Post, Account, EvmAddress, BigDecimal, DateTime } from "@lens-protocol/client";
import { Collection } from "../../Common/types/common.types";

export type WhoSwitchProps = {
  reactors: Account[];
  quoters: Post[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  mirrorQuote: boolean;
  dict: any;
};

export interface SimpleCollect {
  isImmutable?: boolean | null | undefined;
  endsAt?: DateTime | null | undefined;
  followerOnGraph?:
    | {
        globalGraph: true;
      }
    | {
        graph: EvmAddress;
      }
    | null
    | undefined;
  collectLimit?: number | null | undefined;
  payToCollect?:
    | {
        referralShare?: number | null | undefined;
        recipients: {
          percent: number;
          address: EvmAddress;
        }[];
        amount: {
          value: BigDecimal;
          currency: EvmAddress;
        };
      }
    | null
    | undefined;
}

export type PlayerMetricsProps = {
  metrics: VideoActivity | undefined;
  text: string;
};


export interface Quest {
  gate: Gate;
  post: Post;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
  status: boolean;
  postId: string;
  milestones: Milestone[];
  questId: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
  blockTimestamp: string;
}


export interface Milestone {
  gated: Gate;
  milestoneMetadata: {
    title: string;
    description: string;
    cover: string;
  };
  milestoneId: string;
  rewards: Reward[];
  rewardsLength: string;
  videoLength: string;
  videos: Video[];
}


export interface Reward {
  amount: string;
  tokenAddress: string;
  rewardMetadata: {
    mediaCover: string;
    images: string;
    video: string;
    mediaType: string;
    audio: string;
    title: string;
    description: string;
    prompt: string;
  };
  uri: string;
  type: string;
  questId: string;
  postId: string;
  milestone: string;
  questURI: string;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
}

export interface Player {
  milestonesCompleted: {
    questId: string;
    milestonesCompleted: String;
  }[];
  eligibile: {
    milestone: string;
    questId: string;
    status: boolean;
  }[];
  playerProfile: string;
  questsCompleted: string[];
  questsJoined: string[];
  videos: VideoActivity[];
  profile: Account;
}

export interface Video {
  uri: string;
  details?: {
    cover: string;
    title: string;
    description: string;
  };
  post?: Post;
  react: boolean;
  quote: boolean;
  postId: string;
  playerId: string;
  minPlayCount: string;
  mirror: boolean;
  minDuration: string;
  minAVD: string;
  minSecondaryQuoteOnQuote: string;
  minSecondaryMirrorOnQuote: string;
  minSecondaryReactOnQuote: string;
  minSecondaryCommentOnQuote: string;
  minSecondaryCollectOnQuote: string;
  minSecondaryQuoteOnComment: string;
  minSecondaryMirrorOnComment: string;
  minSecondaryReactOnComment: string;
  minSecondaryCommentOnComment: string;
  minSecondaryCollectOnComment: string;
  comment: boolean;
  bookmark: boolean;
}
export interface Gate {
  erc721Logic: Collection[];
  erc20Logic: {
    address: string;
    amount: string;
  }[];
  oneOf: boolean;
}


export interface VideoActivity {
  playCount: number;
  postId: string;
  uri: string;
  details?: {
    cover: string;
    title: string;
    description: string;
  };
  videoMetadata: {
    cover: string;
    title: string;
    description: string;
  };
  playerId: string;
  mostReplayed: string;
  duration: number;
  hasReacted: boolean;
  hasQuoted: boolean;
  hasMirrored: boolean;
  hasCommented: boolean;
  hasBookmarked: boolean;
  avd: number;
  secondaryQuoteOnQuote: number;
  secondaryMirrorOnQuote: number;
  secondaryReactOnQuote: number;
  secondaryCommentOnQuote: number;
  secondaryCollectOnQuote: number;
  secondaryQuoteOnComment: number;
  secondaryMirrorOnComment: number;
  secondaryReactOnComment: number;
  secondaryCommentOnComment: number;
  secondaryCollectOnComment: number;
  post?: Post;
}