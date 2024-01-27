import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { NextRouter, Url } from "next/dist/shared/lib/router/router";

export type AllDropsProps = {
  collections: Collection[];
  autoProfile: Profile | undefined;
  router: NextRouter;
};

export type MoreDropsProps = {
  collections: Collection[];
  autoProfile: Profile | undefined;
  router: NextRouter;
};
