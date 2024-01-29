import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { NextRouter } from "next/dist/shared/lib/router/router";
import { AnyAction, Dispatch } from "redux";

export interface CollectOptions {
  chargeCollectDropDown: boolean;
  audienceDropDown: boolean;
  currencyDropDown: boolean;
  referral: number;
  limit: number;
  value: number;
  collectibleDropDown: boolean;
  collectible: string;
  chargeCollect: string;
  limitedDropDown: boolean;
  limitedEdition: string;
  timeLimit: string;
  timeLimitDropDown: boolean;

  audienceTypes: string[];
  audienceType: string;
  enabledCurrency: string | undefined;
  gifOpen: boolean;
}

export type CollectionsProps = {
  autoCollections: Collection[] | undefined;
  router: NextRouter;
  autoProfile: Profile | undefined;
  dispatch: Dispatch<AnyAction>;
  address: `0x${string}` | undefined;
  lensProfile: Profile | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
};

export type CollectionCaseProps = {
  collection: Collection | undefined;
  router: NextRouter;
  autoProfile: Profile | undefined;
  address: `0x${string}` | undefined;
  lensProfile: Profile | undefined;
  openConnectModal: (() => void) | undefined;
  handleLensSignIn: () => Promise<void>;
  dispatch: Dispatch<AnyAction>;
};

export type DropsProps = {
  router: NextRouter;
  allDrops: Drop[] | undefined;
  autoProfile: Profile | undefined;
};
