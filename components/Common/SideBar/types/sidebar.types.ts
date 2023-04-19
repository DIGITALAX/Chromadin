import { Profile, Publication } from "@/components/Home/types/lens.types";
import { AnyAction, Dispatch } from "redux";

export type ChannelsProps = {
  videos: Publication[];
  dispatch: Dispatch<AnyAction>;
  liked: boolean[];
  mirrored: boolean[];
  videosLoading: boolean;
  dispatchVideos: Publication[];
  collected: boolean[];
};

export type UseChannelsResults = {
  videos: Publication[];
  liked: boolean[];
  mirrored: boolean[];
  collected: boolean[];
  tab: number;
  setTab: (e: number) => void;
  videosLoading: boolean;
  likeAmount: number[];
  collectAmount: number[];
  mirrorAmount: number[];
};

export type UseConnectResults = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  handleRefreshProfile: () => Promise<void>;
  connected: boolean;
};

export type ConnectProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
};

export type AuthProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
};

export type WalletProps = {
  handleTransaction: () => void;
  isConnected: boolean;
  buttonText: string;
};

export type ProfileProps = {
  profile: Profile | undefined;
};

export type TabProps = {
  tab: number;
  setTab: (e: number) => void;
  viewer: string;
};

export type SideBarProps = {
  handleConnect: () => void;
  handleLensSignIn: () => Promise<void>;
  connected: boolean;
  authStatus: boolean;
  profile: Profile | undefined;
  tab: number;
  setTab: (e: number) => void;
  dispatch: Dispatch<AnyAction>;
  videos: Publication[];
  liked: boolean[];
  mirrored: boolean[];
  viewer: string;
  videosLoading: boolean;
  dispatchVideos: Publication[];
  collected: boolean[];
};
