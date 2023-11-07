import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { Url } from "next/dist/shared/lib/router/router";

export type AllDropsProps = {
  autoDrop: Drop | undefined;
  autoCollections: Collection[] | undefined;
  autoProfile: Profile | undefined;
  push: (
    url: Url,
    as?: Url | undefined,
    options?: any | undefined
  ) => Promise<boolean>;
};

export type MoreDropsProps = {
  otherDrops: Collection[];
  autoProfile: Profile | undefined;
  push: (
    url: Url,
    as?: Url | undefined,
    options?: any | undefined
  ) => Promise<boolean>;
};
