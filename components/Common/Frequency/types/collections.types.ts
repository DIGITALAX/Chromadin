import { Collection } from "@/components/Home/types/home.types";
import { CollectionInfoState } from "@/redux/reducers/collectionInfoSlice";
import { NextRouter } from "next/router";
import { Ref } from "react";
import { AnyAction, Dispatch } from "redux";

export type DropsProps = {
  collectionInfo: CollectionInfoState;
  dispatch: Dispatch<AnyAction>;
  collectionsLoading: boolean;
  router: NextRouter;
  moreCollectionsLoading: boolean;
  currentIndex: number;
};
