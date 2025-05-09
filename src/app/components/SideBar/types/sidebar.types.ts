import { Post } from "@lens-protocol/client";
import { SetStateAction } from "react";

export type CommentsProps = {
  dict: any;
  secondaryComment: string;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  commentLoading: boolean;
};

export type InteractionsProps = {
  dict: any;
  secondaryComment: string;
  setSecondaryComment: (e: SetStateAction<string>) => void;
  commentLoading: boolean;
};

export type SidebarProps = {
  dict: any;
  fetchMoreVideos: () => Promise<Post[] | undefined>;
};
