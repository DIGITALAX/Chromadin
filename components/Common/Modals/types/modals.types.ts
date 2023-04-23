import { Profile } from "@/components/Home/types/lens.types";
import { PostCollectValuesState } from "@/redux/reducers/postCollectSlice";

export type IndexingModalProps = {
  message: string | undefined;
};

export type CollectModalProps = {
  message: string;
};

export type CollectInfoProps = {
  buttonText: string;
  symbol?: string;
  value?: string;
  limit?: string;
  time?: string;
  totalCollected?: number;
  canClick?: boolean;
  isApproved?: boolean;
  approveCurrency?: () => Promise<void>;
  handleCollect?: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approvalLoading?: boolean;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type PurchaseProps = {
  collectInfoLoading: boolean;
  approvalLoading: boolean;
  address: `0x${string}` | undefined;
  collectModuleValues: PostCollectValuesState;
  lensProfile: string;
  collectComment: (id?: string) => Promise<void>;
  collectLoading: boolean;
  approveCurrency: () => Promise<void>;
  handleLensSignIn: () => Promise<void>;
  commentId: string;
};

export type FollowerOnlyProps = {
  profile: Profile | undefined;
  followProfile: () => Promise<void>;
  followLoading: boolean;
  approved: boolean;
  approveCurrency: () => Promise<void>;
};

export type ImageLargeProps = {
  mainImage: string;
};

export type SuccessProps = {
  media: string;
};
