import { useEffect, useRef, useState } from "react";
import { Collection } from "@/components/Home/types/home.types";
import { MOSH_VIDEOS } from "@/lib/constants";

const useDrops = (collections: Collection[]) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const moshVideoRef = useRef<HTMLVideoElement>(null);

  const moveForward = (): void => {
    setCurrentIndex((currentIndex + 1) % collections?.length);
  };

  const moveBackward = (): void => {
    setCurrentIndex(
      (currentIndex - 1 + collections?.length) % collections?.length
    );
  };

  useEffect(() => {
    if (moshVideoRef.current) {
      const handleVideoEnd = () => {
        setCurrentVideoIndex((currentIndex) => {
          if (currentIndex === MOSH_VIDEOS.length - 1) {
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
  }, [MOSH_VIDEOS, currentVideoIndex]); 

  useEffect(() => {
    if (moshVideoRef.current) {
      moshVideoRef.current.pause();
      moshVideoRef.current.load();
      moshVideoRef.current.play().catch((error) => {
        console.error("Error reproduciendo el video:", error);
      });
    }
  }, [currentVideoIndex]);

  return {
    moveBackward,
    moveForward,
    currentIndex,
    moshVideoRef,
    currentVideoIndex,
  };
};

export default useDrops;
