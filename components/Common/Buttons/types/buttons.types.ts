import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { FormEvent } from "react";
import { TFunction } from "i18next";
import { NextRouter } from "next/router";

export type FilterVendingProps = {
  handleOpenDropdown: (e?: any) => void;
  openDropdown: boolean;
  values: { en: string; es: string }[];
  selectorValue: string | undefined;
  filterUpdate: (selected: string) => void;
  router: NextRouter;
};

export type SearchVendingProps = {
  handleSearch: (e: FormEvent<Element>) => Promise<void>;
  searchOpen: boolean;
  searchResults: (Collection | Drop | Profile)[];
  handleSearchChoose: (chosen: Profile | Drop | Collection) => Promise<void>;
  mainPage?: boolean;
  t: TFunction<"common", undefined>;
};
