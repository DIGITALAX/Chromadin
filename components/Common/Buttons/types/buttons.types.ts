import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { FormEvent } from "react";

export type FilterVendingProps = {
  handleOpenDropdown: (e?: any) => void;
  openDropdown: boolean;
  values: string[];
  selectorValue: string | undefined;
  filterUpdate: (selected: string) => void;
};

export type SearchVendingProps = {
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  mainPage?: boolean;
};
