import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { FormEvent, MouseEvent, Ref } from "react";
import ReactPlayer from "react-player";

export type ControlsProps = {
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen: boolean;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  isPlaying: boolean;
  handleHeart: () => void;
  collected: boolean;
  mirrored: boolean;
  liked: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  setIsPlaying: (e: boolean) => void;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type UseControlsResults = {
  streamRef: Ref<ReactPlayer>;
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen: boolean;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  isPlaying: boolean;
  handleHeart: () => void;
  heart: boolean;
  mirrorVideo: () => Promise<void>;
  likeVideo: () => Promise<void>;
  collectVideo: () => Promise<void>;
  mirrorLoading: boolean;
  collectLoading: boolean;
  likeLoading: boolean;
  authStatus: boolean;
  profileId: string;
  mainVideo: MainVideoState;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
  mirrorCommentLoading: boolean[];
  likeCommentLoading: boolean[];
  collectCommentLoading: boolean[];
  approvalLoading: boolean;
  collectInfoLoading: boolean;
  approveCurrency: () => Promise<void>;
  setIsPlaying: (e: boolean) => void;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
  wrapperRef: Ref<HTMLDivElement>;
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
};

export type VideoProps = {
  viewer: string;
};

export type PlayerProps = {
  viewer: string;
  heart: boolean;
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
  isPlaying: boolean;
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  volume: number;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
  wrapperRef: Ref<HTMLDivElement>;
};

export type ComponentProps = {
  streamRef: Ref<ReactPlayer>;
  mainVideo: MainVideoState;
  isPlaying: boolean;
  likedArray: boolean[];
  mirroredArray: boolean[];
  videos: Publication[];
  volume: number;
  setCurrentTime: (e: number) => void;
  setDuration: (e: number) => void;
};
