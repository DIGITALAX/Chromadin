import { MOSH_VIDEOS } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useRef, useState } from "react";

const useFrequency = () => {
  const context = useContext(ModalContext);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);
  const moshVideoRef = useRef<HTMLVideoElement>(null);

  const moveForward = (): void => {
    setCurrentIndex(
      (currentIndex + 1) % Number(context?.collectionInfo?.collections?.length)
    );
  };

  const moveBackward = (): void => {
    setCurrentIndex(
      (currentIndex -
        1 +
        Number(context?.collectionInfo?.collections?.length)) %
        Number(context?.collectionInfo?.collections?.length)
    );
  };

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % MOSH_VIDEOS.length);
  };

  useEffect(() => {
    moshVideoRef.current?.addEventListener("ended", handleVideoEnd);
    return () => {
      moshVideoRef.current?.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    const videoEl = moshVideoRef.current;
    if (!videoEl) return;

    videoEl.load();
    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.error("Autoplay failed:", err);
        handleVideoEnd();
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

export default useFrequency;
