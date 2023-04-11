import { Publication } from "@/components/Home/types/lens.types";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { FormEvent, Ref } from "react";

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
  handlePlay: () => void;
  handlePause: () => void;
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
};

export type UseControlsResults = {
  streamRef: Ref<HTMLVideoElement>;
  setFullScreen: (fullScreen: boolean) => void;
  fullScreen: boolean;
  formatTime: (time: number) => string;
  currentTime: number;
  duration: number;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handlePlay: () => void;
  handlePause: () => void;
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
};

export type VideoProps = {
  viewer: string;
};

export type PlayerProps = {
  viewer: string;
  heart: boolean;
  streamRef: Ref<HTMLVideoElement>;
  mainVideo: MainVideoState;
  videoLoading: boolean;
  setVideoLoading: (e: boolean) => void;
};
