import { Collection, Drop } from "@/components/Home/types/home.types";
import { Erc20, Post, Profile } from "@/components/Home/types/generated";
import { FormEvent } from "react";
import { AnyAction, Dispatch } from "redux";

export type CollectButtonProps = {
  values?: string[] | Erc20[];
  col: string;
  row: string;
  openDropdown: boolean;
  handleOpenDropdown: (e: boolean) => void;
  selectValue: string | undefined;
  selectFunction: (e: string) => void;
  label: string;
  mixtape?: boolean;
};

export type CollectInputProps = {
  id: string;
  name: string;
  step?: string;
  min?: string;
  placeholder?: string;
  defaultValue?: string;
  col?: string;
  row?: string;
  label?: string;
  handleValueChange: (e: number) => void;
};

export type FilterVendingProps = {
  handleOpenDropdown: (e?: any) => void;
  openDropdown: boolean;
  values: string[];
  setDispatchFilter: any;
  selectorValue: string | undefined;
  dispatch: Dispatch<AnyAction>;
};

export type SearchVendingProps = {
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  mainPage?: boolean;
};
