import { useEffect, useRef, useState } from "react";
import { DropsResults } from "../types/collections.types";
import useDrop from "@/components/Home/hooks/useDrop";
import shuffle from "shuffle-array";

const useDrops = (): DropsResults => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const { collections } = useDrop();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const moshVideoRef = useRef<HTMLVideoElement>(null);
  const moshArray: string[] = [
    "/videos/moshOne.mp4",
    "/videos/moshTwo.mp4",
    "/videos/moshThree.mp4",
    "/videos/moshFour.mp4",
    "/videos/moshFive.mp4",
    "/videos/moshSix.mp4",
  ];

  const moveForward = (): void => {
    setCurrentIndex((currentIndex + 1) % collections?.length);
  };

  const moveBackward = (): void => {
    setCurrentIndex(
      (currentIndex - 1 + collections?.length) % collections?.length
    );
  };

  useEffect(() => {
    shuffle(moshArray);
  }, []);

  useEffect(() => {
    if (moshVideoRef.current) {
      const handleVideoEnd = () => {
        setCurrentVideoIndex((currentIndex) => {
          if (currentIndex === moshArray.length - 1) {
            return 0;
          }
          return currentIndex + 1;
        });
      };
      moshVideoRef.current.addEventListener("ended", handleVideoEnd);
      return () => {
        moshVideoRef.current?.removeEventListener("ended", handleVideoEnd);
      };
    }
  }, [moshArray]);

  useEffect(() => {
    if (moshVideoRef.current) {
      moshVideoRef.current.addEventListener("canplay", () => {
        moshVideoRef.current?.play();
      });
      moshVideoRef.current.load();
    }
  }, [currentVideoIndex]);

  return {
    moveBackward,
    moveForward,
    currentIndex,
    moshArray,
    moshVideoRef,
    currentVideoIndex,
  };
};

export default useDrops;
