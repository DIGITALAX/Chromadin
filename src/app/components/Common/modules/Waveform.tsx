import { INFURA_GATEWAY } from "@/app/lib/constants";
import { FunctionComponent, JSX, useEffect, useRef } from "react";
import { HiOutlinePlayPause } from "react-icons/hi2";
import WaveSurfer from "wavesurfer.js";

const WaveformComponent: FunctionComponent<{ video: string }> = ({
  video,
}): JSX.Element => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef<null | WaveSurfer>(null);

  useEffect(() => {
    if (waveformRef?.current) {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }

      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "violet",
        progressColor: "white",
        height: 16,
      });

      wavesurfer.current.on("seeking", function (seekProgress) {
        const videoElement = document.getElementById(video) as HTMLVideoElement;
        if (videoElement) {
          videoElement.currentTime = seekProgress;
        }
      });

      wavesurfer.current.on("play", function () {
        const videoElement = document.getElementById(video) as HTMLVideoElement;
        if (videoElement) {
          videoElement.play();
        }
      });

      wavesurfer.current.on("pause", function () {
        const videoElement = document.getElementById(video) as HTMLVideoElement;
        if (videoElement) {
          videoElement.pause();
        }
      });

      wavesurfer.current.load(
        `${INFURA_GATEWAY}/ipfs/${
          video?.includes("ipfs://") ? video?.split("ipfs://")[1] : video
        }`
      );
    }

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [wavesurfer, video]);

  const handlePlayPause = () => {
    const videoElement = document.getElementById(video) as HTMLVideoElement;

    if (videoElement && wavesurfer.current) {
      if (videoElement.paused) {
        videoElement.play();
        wavesurfer.current.play();
      } else {
        videoElement.pause();
        wavesurfer.current.pause();
      }
    }
  };

  return (
    <div className="absolute px-1.5 py-1 flex bottom-0 left-0 justify-center items-center w-full h-10 bg-offBlack border border-shame">
      <div className="relative w-full h-fit flex flex-row gap-1.5 items-center justify-center">
        <div
          className="relative flex w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95"
          onClick={() => handlePlayPause()}
        >
          <HiOutlinePlayPause color="white" size={15} />
        </div>
        <div
          className="relative w-full h-fit justify-center items-center cursor-pointer"
          ref={waveformRef}
        />
      </div>
    </div>
  );
};

export default WaveformComponent;
