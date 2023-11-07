import { RefObject } from "react";

const syncScroll = (
  textElement: RefObject<HTMLTextAreaElement>,
  preRef: RefObject<HTMLPreElement> | null
) => {
  if (textElement?.current && preRef?.current) {
    preRef.current.scrollTop = textElement.current.scrollTop;
    preRef.current.scrollLeft = textElement.current.scrollLeft;
  }
};

export default syncScroll;
