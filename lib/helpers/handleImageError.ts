import { SyntheticEvent } from "react";
import { INFURA_GATEWAY } from "../constants";

const handleImageError = (e: SyntheticEvent<HTMLImageElement>): void => {
  (
    e.target as HTMLImageElement
  ).src = `${INFURA_GATEWAY}/ipfs/QmettvhoKTmwDxLKCw2qNTNn1FnHXyGuiKgA8X5dtQKdbb`;
};

export default handleImageError;