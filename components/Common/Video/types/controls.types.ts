import { Post, Profile } from "@/components/Home/types/generated";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";
import { AnyAction, Dispatch } from "redux";
import { Viewer } from "../../Interactions/types/interactions.types";
import { FullScreenVideoState } from "@/redux/reducers/fullScreenVideoSlice";
import { ChannelsState } from "@/redux/reducers/channelsSlice";

export type ControlsProps = {
  videoSync: FullScreenVideoState;
  formatTime: (time: number) => string;
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
  like: (id: string, hasReacted: boolean, index: number,main?: boolean) => Promise<void>;
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
  videoSync: FullScreenVideoState;
  formatTime: (time: number) => string;
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
  like: (id: string, hasReacted: boolean, index: number,main?: boolean) => Promise<void>;
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
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  allVideos: ChannelsState;
};

export type PlayerProps = {
  streamRef: Ref<ReactPlayer>;
  allVideos: ChannelsState;
  volume: number;
  fullScreen: boolean;
  wrapperRef: Ref<HTMLDivElement>;
  muted: boolean;
  videoSync: FullScreenVideoState;
  viewer: Viewer;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  videoSync: FullScreenVideoState;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  allVideos: ChannelsState;
};
