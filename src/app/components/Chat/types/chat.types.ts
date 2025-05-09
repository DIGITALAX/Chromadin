import { Account, AccountStats, Post, Repost } from "@lens-protocol/client";
import { Collection } from "../../Common/types/common.types";
import { SetStateAction } from "react";

export type AllPostsProps = {
  dict: any;
};

export type AccountProps = {
  dict: any;
  profile: Account & {
    stats: AccountStats;
    collections: Collection[];
  };
};

export type MakeCommentProps = {
  dict: any;
  post: Post;
  setOpenComment?: (e: SetStateAction<number | undefined>) => void;
};

export type FeedPublicationProps = {
  dict: any;
  height: boolean;
  publication: Post | Repost;
  index: number;
  disabled?: boolean;
  setOpenComment?: (e: SetStateAction<number | undefined>) => void;
};

export type ProfileProps = {
  post: Post | Repost;
  disabled?: boolean;
  dict: any;
  index: number;
  setOpenComment?: (e: SetStateAction<number | undefined>) => void;
};

export type ReactionProps = {
  dict: any;
  publication: Post;
  index: number;
  disabled?: boolean;
  setOpenComment?: (e: SetStateAction<number | undefined>) => void;
};
