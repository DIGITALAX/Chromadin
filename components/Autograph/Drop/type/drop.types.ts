import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { NextRouter, Url } from "next/dist/shared/lib/router/router";
import { TFunction } from "i18next";

export type AllDropsProps = {
  collections: Collection[];
  autoProfile: Profile | undefined;
  router: NextRouter;
  t: TFunction<"common", undefined>;
};

export type MoreDropsProps = {
  collections: Collection[];
  autoProfile: Profile | undefined;
  router: NextRouter;
};
