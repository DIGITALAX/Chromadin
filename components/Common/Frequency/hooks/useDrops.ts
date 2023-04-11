import { useState } from "react";
import { DropsResults } from "../types/collections.types";
import useDrop from "@/components/Home/hooks/useDrop";

const useDrops = (): DropsResults => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { collections } = useDrop();

  const moveForward = (): void => {
    setCurrentIndex((currentIndex + 1) % collections.length);
  };

  const moveBackward = (): void => {
    setCurrentIndex(
      (currentIndex - 1 + collections.length) % collections.length
    );
  };

  return { moveBackward, moveForward, currentIndex };
};

export default useDrops;
