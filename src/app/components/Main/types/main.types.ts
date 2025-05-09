import { Account } from "@lens-protocol/client";
import { FormEvent, KeyboardEvent, RefObject, SetStateAction } from "react";

export type UserCommentProps = {
  dict: any;
  commentLoading: boolean;
  mentionProfiles: Account[];
  handleCommentDescription: (e: SetStateAction<FormEvent<Element>>) => void;
  textElement: RefObject<HTMLTextAreaElement | null>;
  commentDetails: {
    description: string;
    html: string;
  };
  preElement: RefObject<HTMLPreElement | null>;
  secondaryComment: string;
  profilesOpen: boolean;
  caretCoord: { x: number; y: number };
  comment: (id: string) => Promise<void>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleMentionClick: (e: Account) => void;
};

export type NFTProps = {
  dict: any;
  commentsLoading: boolean;
  mentionProfiles: Account[];
  handleCommentDescription: (e: SetStateAction<FormEvent<Element>>) => void;
  textElement: RefObject<HTMLTextAreaElement | null>;
  commentDetails: {
    description: string;
    html: string;
  };
  preElement: RefObject<HTMLPreElement | null>;
  secondaryComment: string;
  profilesOpen: boolean;
  caretCoord: { x: number; y: number };
  comment: (id: string) => Promise<void>;
  handleKeyDownDelete: (e: KeyboardEvent<Element>) => void;
  handleMentionClick: (e: Account) => void;
};

export type ImageUploadsProps = { id: string; commentLoading: boolean };

export type OptionsPostProps = {
  id: string;
  commentLoading: boolean;
};
