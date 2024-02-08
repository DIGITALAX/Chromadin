import { FormEvent, MouseEvent, useState } from "react";
import { VideoControls } from "../types/controls.types";

const usePlayer = () => {
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);

  const handleHeart = () => {
    setVideoControlsInfo((prev) => ({
      ...prev,
      heart: true,
    }));

    setTimeout(() => {
      setVideoControlsInfo((prev) => ({
        ...prev,
        heart: false,
      }));
    }, 3000);
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));
  };

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;

    setVideoControlsInfo((prev) => ({
      ...prev,
      currentTime: seekPosition * prev.duration,
    }));
  };

  const [videoControlsInfo, setVideoControlsInfo] = useState<VideoControls>({
    duration: 0,
    currentTime: 0,
    heart: false,
    isPlaying: false,
    videosLoading: false,
    currentIndex: 0,
  });
  const [volume, setVolume] = useState<number>(1);

  return {
    videoControlsInfo,
    setVideoControlsInfo,
    volume,
    setVolume,
    volumeOpen,
    setVolumeOpen,
    handleHeart,
    handleSeek,
    handleVolumeChange,
  };
};

export default usePlayer;
