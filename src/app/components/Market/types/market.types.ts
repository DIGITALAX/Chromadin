import { Account } from "@lens-protocol/client";
import { Collection, Drop } from "../../Common/types/common.types";
import { FormEvent } from "react";

export interface BuyerHistory {
  orderId: string;
  totalPrice: string;
  currency: string;
  buyer: string;
  blockTimestamp: string;
  transactionHash: string;
  subOrderCollectionIds: string[];
  profile: Account;
  collection: Collection;
}

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export type FilterVendingProps = {
  handleOpenDropdown: (e?: any) => void;
  openDropdown: boolean;
  values: { en: string; es: string }[];
  selectorValue: { en: string; es: string } | undefined;
  filterUpdate: (selected: { en: string; es: string }) => void;
};

export type SearchVendingProps = {
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Account)[];
  handleSearchChoose: (chosen: Account | Drop | Collection) => Promise<void>;
  mainPage?: boolean;
  dict: any;
};
