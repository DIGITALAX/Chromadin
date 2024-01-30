import { Post, Profile } from "@/components/Home/types/generated";
import { FormEvent, MouseEvent, Ref, SetStateAction } from "react";
import { AnyAction, Dispatch } from "redux";
import { Viewer } from "../../Interactions/types/interactions.types";
import { ChannelsState } from "@/redux/reducers/channelsSlice";
import { Collection } from "@/components/Home/types/home.types";

export type ControlsProps = {
  videoSync: VideoControls;
  setVideoControlsInfo: (e: SetStateAction<VideoControls>) => void;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  lensProfile: Profile | undefined;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    collect: boolean;
    comment: boolean;
  };
  like: (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ) => Promise<void>;
  collect: (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirror: (id: string, index: number, main?: boolean) => Promise<void>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  viewer: Viewer;
  allVideos: ChannelsState;
};

export type VideoProps = {
  videoSync: VideoControls;
  setVideoControlsInfo: (e: SetStateAction<VideoControls>) => void;
  volume: number;
  volumeOpen: boolean;
  lensProfile: Profile | undefined;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    collect: boolean;
    comment: boolean;
  };
  like: (
    id: string,
    hasReacted: boolean,
    index: number,
    main?: boolean
  ) => Promise<void>;
  collect: (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirror: (id: string, index: number, main?: boolean) => Promise<void>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  viewer: Viewer;
  wrapperRef: Ref<HTMLDivElement>;
  allVideos: ChannelsState;
};

export type PlayerProps = {
  allVideos: ChannelsState;
  volume: number;
  setVideoControlsInfo: (e: SetStateAction<VideoControls>) => void;
  fullScreen: boolean;
  wrapperRef: Ref<HTMLDivElement>;
  muted: boolean;
  videoSync: VideoControls;
  viewer: Viewer;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type ComponentProps = {
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  videoSync: VideoControls;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  allVideos: ChannelsState;
};

export interface Quest {
  gate: Gate;
  publication: Post;
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
  pubId: string;
  profileId: string;
  milestones: Milestone[];
  questId: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
  blockTimestamp: string;
}

export interface VideoActivity {
  playCount: number;
  pubId: number;
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
  profileId: number;
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
  publication?: Post;
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
  profileId: string;
  questsCompleted: string[];
  questsJoined: string[];
  videos: VideoActivity[];
  profile: Profile;
}

export interface Video {
  videoBytes: string;
  uri: string;
  details?: {
    cover: string;
    title: string;
    description: string;
  };
  publication?: Post;
  react: boolean;
  quote: boolean;
  pubId: string;
  profileId: string;
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
  pubId: string;
  profileId: string;
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

export type PlayerMetricsProps = {
  metrics: VideoActivity | undefined;
  text: string;
};

export interface VideoControls {
  currentTime: number;
  heart: boolean;
  duration: number;
  isPlaying: boolean;
  videosLoading: boolean;
}
