import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Post, Profile } from "@/components/Home/types/generated";
import { NextRouter } from "next/dist/shared/lib/router/router";
import { FormEvent, MouseEvent, Ref } from "react";
import { AnyAction, Dispatch } from "redux";
import { AutoCollectionState } from "@/redux/reducers/autoCollectionSlice";
import { Details } from "@/redux/reducers/fulfillmentDetailsSlice";
import { VideoCountState } from "@/redux/reducers/videoCountSlice";
import ReactPlayer from "react-player";
import { MainVideoState } from "@/redux/reducers/mainVideoSlice";
import { VideoSyncState } from "@/redux/reducers/videoSyncSlice";

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
  searchResults: (Collection | Drop | QuickProfilesInterface)[];
  handleSearchChoose: (
    chosen: QuickProfilesInterface | Drop | Collection
  ) => Promise<void>;
  isLargeScreen: boolean;
  videoSync: VideoSyncState;
  formatTime: (time: number) => string;
  volume: number;
  volumeOpen: boolean;
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
  streamRef: Ref<ReactPlayer>;
  wrapperRef: Ref<HTMLDivElement>;
  mainVideo: MainVideoState;
};

export type CheckoutProps = {
  dispatch: Dispatch<AnyAction>;
  address: `0x${string}` | undefined;
  router: NextRouter;
  openChainModal: (() => void) | undefined;
  openConnectModal: (() => void) | undefined;
  viewScreenNFT: boolean;
  autoDispatch: AutoCollectionState;
  encryptedInformation: string[] | undefined;
  fulfillmentDetails: Details;
  chain: any;
  currency: string;
  setCurrency: (e: string) => void;
  totalAmount: number;
  approved: boolean;
  buyNFT: () => Promise<void>;
  approveSpend: () => Promise<void>;
  purchaseLoading: boolean;
  oracleValue: number;
  cryptoCheckoutLoading: boolean;
  handleCheckoutCrypto: () => Promise<void>;
};
