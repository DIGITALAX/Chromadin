import { TFunction } from "i18next";
import { NextRouter } from "next/router";

export type LoadingProps = {
  size: string;
};

export type NotFoundProps = {
  router: NextRouter;
  t: TFunction<"common", undefined>;
};
