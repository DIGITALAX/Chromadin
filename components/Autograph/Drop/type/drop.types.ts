import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { NextRouter, Url } from "next/dist/shared/lib/router/router";

export type AllDropsProps = {
  autoDrop: Drop | undefined;
  autoCollections: Collection[] | undefined;
  autoProfile: Profile | undefined;
  router: NextRouter;
};

export type MoreDropsProps = {
  otherDrops: Collection[];
  autoProfile: Profile | undefined;
  router: NextRouter;
};
