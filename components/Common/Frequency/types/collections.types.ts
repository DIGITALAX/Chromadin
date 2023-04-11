import { Collection } from "@/components/Home/types/home.types";
import { AnyAction, Dispatch } from "redux";

export type DropsProps = {
  collections: Collection[];
  dispatch: Dispatch<AnyAction>;
  dispatchCollections: Collection[];
};

export type DropsResults = {
  moveBackward: () => void;
  moveForward: () => void;
  currentIndex: number;
};
