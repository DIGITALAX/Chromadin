import { Post } from "@lens-protocol/client";
import { FormEvent, MouseEvent, RefObject, SetStateAction } from "react";

export type PlayerProps = {
  wrapperRef: RefObject<HTMLVideoElement | null>;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  volume: number;
};

export type ControlsProps = {
  volume: number;
  setVolumeOpen: (e: SetStateAction<boolean>) => void;
  volumeOpen: boolean;
  progressRef: RefObject<HTMLDivElement | null>;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  handleHeart: () => void;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    like: boolean;
  };
  handleVolumeChange: (e: FormEvent) => void;
  simpleCollect: () => Promise<void>;
  mirror: () => Promise<void>;
  like: () => Promise<void>;
};

export type VideoProps = {
  dict: any;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};

export type ChannelsProps = {
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};
