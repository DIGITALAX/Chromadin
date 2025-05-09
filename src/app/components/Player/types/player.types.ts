import { Post } from "@lens-protocol/client";
import {  RefObject } from "react";

export type PlayerProps = {
  wrapperRef: RefObject<HTMLVideoElement | null>;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};

export type ControlsProps = {
  dict: any;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  wrapperRef: RefObject<HTMLVideoElement | null>;
};

export type VideoProps = {
  dict: any;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};


export type ChannelsProps = {
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};