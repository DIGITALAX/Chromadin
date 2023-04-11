import { Profile, Publication } from "@/components/Home/types/lens.types";
import { AnyAction, Dispatch } from "redux";

export type ChannelsProps = {
  videos: Publication[];
  dispatch: Dispatch<AnyAction>;
  liked: boolean[];
  mirrored: boolean[];
};

export type UseChannelsResults = {
  videos: Publication[];
  liked: boolean[];
  mirrored: boolean[];
  tab: number;
  setTab: (e: number) => void;
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
};
