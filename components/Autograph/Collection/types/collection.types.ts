import { Collection, Drop } from "@/components/Home/types/home.types";
import { Post, Profile } from "@/components/Home/types/generated";
import { NextRouter } from "next/dist/shared/lib/router/router";
import { FormEvent, MouseEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import ReactPlayer from "react-player";
import { FullScreenVideoState } from "@/redux/reducers/fullScreenVideoSlice";
import { ChannelsState } from "@/redux/reducers/channelsSlice";

export type InDropProps = {
  autoCollection: Collection | undefined;
  otherCollectionsDrop: Collection[];
  router: NextRouter;
  autoProfile: Profile | undefined;
};

export type BarProps = {
  router: NextRouter;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  lensProfile: Profile | undefined;
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  isLargeScreen: boolean;
  videoSync: FullScreenVideoState;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
  setVolumeOpen: (volumeOpen: boolean) => void;
  handleVolumeChange: (e: FormEvent) => void;
  handleHeart: () => void;
  like: (id: string, hasReacted: boolean, index: number, main?: boolean) => Promise<void>;
  collect: (
    id: string,
    type: string,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirror: (id: string, index: number, main?: boolean) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    collect: boolean;
    like: boolean;
    comment: boolean;
  };
  progressRef: Ref<HTMLDivElement>;
  handleSeek: (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => void;
  dispatch: Dispatch<AnyAction>;
  hasMore: boolean;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
  videosLoading: boolean;
  setVideosLoading: (e: boolean) => void;
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  handleLogout: () => Promise<void>;
  allVideos: ChannelsState;
};

export type CheckoutProps = {
  router: NextRouter;
  collection: Collection;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  buyNFT: () => Promise<void>;
  approveSpend: () => Promise<void>;
  purchaseLoading: boolean;
};
