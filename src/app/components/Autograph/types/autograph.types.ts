import { Account } from "@lens-protocol/client";
import { Collection, Drop } from "../../Common/types/common.types";

export type DropsProps = {
  dict: any;
  drops: Drop[];
  profile: Account;
};

export type CollectionsProps = {
  dict: any;
  collections: Collection[];
  profile: Account;
};

export type CollectionCaseProps = {
  dict: any;
  collection: Collection;
  profile: Account;
};

export type AllDropsProps = {
  dict: any;
  collections: Collection[];
  profile: Account;
};

export type InDropProps = {
  dict: any;
  dropCollections: Collection[];
  collection: Collection;
};
