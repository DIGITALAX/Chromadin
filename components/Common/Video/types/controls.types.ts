import { Post, Profile } from "@/components/Home/types/generated";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { ReactionStateState } from "@/redux/reducers/reactionStateSlice";
import { VideoCountState } from "@/redux/reducers/videoCountSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";

export type ControlsProps = {
  videoSync: VideoSyncState;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  lensProfile: Profile | undefined;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  mainVideo: MainVideoState;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Post[];
  collectAmount: number[];
  mirrorAmount: number[];
  likeAmount: number[];
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  viewer: string;
};

export type UseControlsResults = {
  streamRef: Ref<ReactPlayer>;
  fullVideoRef: Ref<ReactPlayer>;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  approvalLoading: boolean;
  collectInfoLoading: boolean;
  approveCurrency: () => Promise<void>;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type VideoProps = {
  videoSync: VideoSyncState;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  lensProfile: Profile | undefined;
  reactions: VideoCountState;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatchVideos: Post[];
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  viewer: string;
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  mainVideo: MainVideoState;
};

export type PlayerProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  volume: number;
  wrapperRef: Ref<HTMLDivElement>;
  dispatchVideos: Post[];
  fullScreen: boolean;
  muted: boolean;
  videoSync: VideoSyncState;
  viewer: string;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  isPlaying: boolean;
  volume: number;
  dispatchVideos: Post[];
  muted: boolean;
  videoSync: VideoSyncState;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<
    | { videos: any[]; mirrors: any[]; collects: boolean[]; likes: any[] }
    | undefined
  >;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};
