import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FormEvent, FunctionComponent } from "react";
import { ControlsProps } from "../types/controls.types";
import { AiOutlineLoading } from "react-icons/ai";
import lodash from "lodash";
import { Viewer } from "../../Interactions/types/interactions.types";
import numeral from "numeral";
import { setChannelsRedux } from "@/redux/reducers/channelsSlice";
import formatTime from "@/lib/helpers/formatTime";
import { setQuestRedux } from "@/redux/reducers/questSlice";
import { setMetrics } from "@/redux/reducers/metricsSlice";

const Controls: FunctionComponent<ControlsProps> = ({
  volume,
  handleVolumeChange,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  like,
  collect,
  mirror,
  allVideos,
  progressRef,
  handleSeek,
  videoSync,
  dispatch,
  hasMore,
  fetchMoreVideos,
  videosLoading,
  setVideosLoading,
  viewer,
  lensProfile,
  interactionsLoading,
  setVideoControlsInfo,
  router,
}): JSX.Element => {
  return (
    <div
      className={`relative h-fit flex w-full gap-3 items-center galaxy:px-2 justify-center ${
        viewer === Viewer.Autograph
          ? "flex-col stuck3:flex-row"
          : "flex-col md:flex-row"
      }`}
    >
      <div
        className={`relative w-fit h-full flex justify-center items-center gap-3 ${
          viewer === Viewer.Autograph ? "stuck3:w-56" : "md:w-56"
        }`}
      >
        {/* <div className="relative flex flex-row w-full h-full items-center">
          <div
            className="relative w-4 h-4 cursor-pointer flex"
            onClick={() =>
              dispatch(
                setFullScreenVideo({
                  ...videoSync,
                  open: true,
                })
              )
            }
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
              alt="expand"
              fill
              className="flex items-center"
              draggable={false}
            />
          </div>
        </div> */}
        <div className="relative w-fit h-full flex items-center font-digi text-base text-white">
          <span className="text-rosa">
            {formatTime(videoSync.currentTime || 0)}
          </span>
          /
          <span className="text-light">
            {formatTime(videoSync.duration || 0)}
          </span>
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <div
          className="relative w-full h-2 bg-white/40 rounded-sm cursor-pointer"
          ref={progressRef}
          onClick={(e: any) => handleSeek(e)}
        >
          <div
            className="absolute h-full bg-white/80 rounded-sm"
            style={{
              width: `${
                ((videoSync.currentTime || 0) / (videoSync.duration || 0)) * 100
              }%`,
            }}
          />
        </div>
      </div>
      <div
        className={`relative w-fit flex flex-row gap-3 items-center justify-center sm:flex-nowrap flex-wrap ${
          viewer === Viewer.Autograph ? "stuck3:justify-end" : "md:justify-end"
        }`}
      >
        <div
          className={`cursor-pointer relative w-fit items-center justify-center h-fit flex`}
          title="Quests"
          onClick={() =>
            dispatch(
              setQuestRedux({
                actionOpen: true,
                actionVideo: allVideos?.main,
              })
            )
          }
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmamuRQd93o5RLxs8v94MB17QLs3cwY8UuZEhQxMiiA4uM`}
              width={20}
              height={20}
              alt="heart"
              draggable={false}
            />
          </div>
        </div>
        <div
          className={`cursor-pointer relative w-fit items-center justify-center h-fit flex`}
          onClick={() => dispatch(setMetrics(true))}
          title="Metrics"
        >
          <div className="relative w-3 h-4 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/Qma1kaB25wsb9MMpGRrfTiWVERsrK3bPLLd5vW7r9M8AvR`}
              width={20}
              height={20}
              alt="heart"
              draggable={false}
            />
          </div>
        </div>

        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`cursor-pointer relative w-full h-fit ${
              interactionsLoading?.like && "animate-spin"
            }`}
            onClick={
              lensProfile?.id
                ? () => {
                    handleHeart();
                    like(
                      allVideos?.main?.id,
                      allVideos?.main?.operations?.hasReacted!,
                      0,
                      true
                    );
                  }
                : () => handleHeart()
            }
          >
            {interactionsLoading?.like ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    allVideos?.main?.operations?.hasReacted
                      ? "Qmc3KCKWRgN8iKwwAPM5pYkAYNeVwWu3moa5RDMDTBV6ZS"
                      : "QmSX1Y5cKp8p53jv2CnfQBuhu3dgLANjZMTyAMKtgFtvV6"
                  }`}
                  width={12}
                  height={12}
                  alt="heart"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {numeral(allVideos?.main?.stats?.reactions).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${
              lensProfile?.id && "cursor-pointer"
            } relative w-full ${
              interactionsLoading?.collect && "animate-spin"
            }`}
            onClick={() =>
              lensProfile?.id &&
              collect(
                allVideos?.main?.id,
                allVideos?.main?.openActionModules?.[0]?.type!,
                0,
                true
              )
            }
          >
            {interactionsLoading?.collect ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    allVideos?.main?.operations?.hasActed?.value
                      ? "QmXG1mnHdBDXMzMZ9t1wE1Tqo8DRXQ1oNLUxpETdUw17HU"
                      : "QmRGf1cz8h9bdw9VKp9zYXZoDfy15nRA1fKc7ARhxnRPwr"
                  }`}
                  width={12}
                  height={12}
                  alt="collect"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {numeral(allVideos?.main?.stats?.countOpenActions).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${lensProfile?.id && "cursor-pointer"} relative w-fit ${
              interactionsLoading?.mirror && "animate-spin"
            }`}
            onClick={() =>
              lensProfile?.id && mirror(allVideos?.main?.id, 0, true)
            }
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/${
                    allVideos?.main?.operations?.hasMirrored
                      ? "QmcMNSnbKvUfx3B3iHBd9deZCDf7E4J8W6UtyNer3xoMsB"
                      : "QmXZi8e6UQaXm3BMMdsAUTnxoQSEr97nvuc19v7kBAgFsY"
                  }`}
                  width={12}
                  height={12}
                  alt="mirror"
                  draggable={false}
                />
              </div>
            )}
          </div>
          <div className="relative w-fit h-fit font-earl text-white text-xs">
            {numeral(allVideos?.main?.stats?.mirrors).format("0a")}
          </div>
        </div>
        <div
          className="relative cursor-pointer rotate-180 w-3 h-3 flex items-center justify-center"
          onClick={() => {
            dispatch(
              setChannelsRedux({
                actionChannels: allVideos?.channels,
                actionMain:
                  allVideos?.channels[
                    videoSync?.currentIndex === allVideos?.channels?.length - 1
                      ? 0
                      : videoSync?.currentIndex === 0
                      ? allVideos?.channels?.length - 1
                      : videoSync?.currentIndex - 1
                  ],
              })
            );
            if (router?.asPath?.includes("&video=")) {
              const videoId = router?.asPath
                .split("&video=")?.[1]
                ?.split("&")?.[0];

              if (videoId) {
                const updatedPath = router.asPath.replace(
                  `&video=${videoId}`,
                  `&video=${
                    allVideos?.channels[
                      videoSync?.currentIndex ===
                      allVideos?.channels?.length - 1
                        ? 0
                        : videoSync?.currentIndex === 0
                        ? allVideos?.channels?.length - 1
                        : videoSync?.currentIndex - 1
                    ]?.id
                  }`
                );
                router.replace(updatedPath);
              }
            } else {
              const optionRegex =
                /(sampler|chat|stream|collect)\?option=(history|account|fulfillment)/;
              if (!optionRegex.test(router?.asPath)) {
                if (
                  router?.asPath === "/es" ||
                  router?.asPath === "/en" ||
                  router?.asPath === "/"
                ) {
                  const updatedPath = `${
                    router?.asPath
                  }/#stream?option=history&video=${
                    allVideos?.channels[
                      videoSync?.currentIndex ===
                      allVideos?.channels?.length - 1
                        ? 0
                        : videoSync?.currentIndex === 0
                        ? allVideos?.channels?.length - 1
                        : videoSync?.currentIndex - 1
                    ]?.id
                  }`;

                  router.replace(updatedPath);
                }
              } else {
                const updatedPath = router?.asPath.replace(
                  optionRegex,
                  `$&${`&video=${
                    allVideos?.channels[
                      videoSync?.currentIndex ===
                      allVideos?.channels?.length - 1
                        ? 0
                        : videoSync?.currentIndex === 0
                        ? allVideos?.channels?.length - 1
                        : videoSync?.currentIndex - 1
                    ]?.id
                  }`}`
                );
                router.replace(updatedPath);
              }
            }
            setVideoControlsInfo((prev) => ({
              ...prev,
              currentIndex:
                videoSync?.currentIndex === allVideos?.channels?.length - 1
                  ? 0
                  : videoSync?.currentIndex === 0
                  ? allVideos?.channels?.length - 1
                  : videoSync?.currentIndex - 1,
            }));
          }}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="backward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            setVideoControlsInfo((prev) => ({
              ...prev,
              isPlaying: !prev?.isPlaying,
            }))
          }
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              videoSync.isPlaying
                ? "Qmbg8t4xoNywhtCexD5Ln5YWvcKMXGahfwyK6UHpR3nBip"
                : "QmXw52mJFnzYXmoK8eExoHKv7YW9RBVEwSFtfvxXgy7sfp"
            }`}
            draggable={false}
            width={12}
            height={12}
            alt="play"
          />
        </div>
        <div
          className={`relative cursor-pointer w-3 h-3 flex items-center justify-center ${
            videosLoading && "animate-spin"
          }`}
          onClick={
            hasMore &&
            (videoSync?.currentIndex + 1) % allVideos?.channels?.length === 0 &&
            !videosLoading
              ? async () => {
                  setVideosLoading(true);
                  const more = await fetchMoreVideos();
                  dispatch(
                    setChannelsRedux({
                      actionChannels: more,
                      actionMain: more?.[videoSync?.currentIndex + 1],
                    })
                  );

                  if (router?.asPath?.includes("&video=")) {
                    const videoId = router?.asPath
                      .split("&video=")?.[1]
                      ?.split("&")?.[0];

                    if (videoId) {
                      const updatedPath = router.asPath.replace(
                        `&video=${videoId}`,
                        `&video=${more?.[videoSync?.currentIndex + 1]?.id}`
                      );
                      router.replace(updatedPath);
                    }
                  } else {
                    const optionRegex =
                      /(sampler|chat|stream|collect)\?option=(history|account|fulfillment)/;

                    if (!optionRegex.test(router?.asPath)) {
                      if (
                        router?.asPath === "/es" ||
                        router?.asPath === "/en" ||
                        router?.asPath === "/"
                      ) {
                        const updatedPath = `${
                          router?.asPath
                        }/#stream?option=history&video=${
                          more?.[videoSync?.currentIndex + 1]?.id
                        }`;

                        router.replace(updatedPath);
                      }
                    } else {
                      const updatedPath = router?.asPath.replace(
                        optionRegex,
                        `$&${`&video=${
                          more?.[videoSync?.currentIndex + 1]?.id
                        }`}`
                      );
                      router.replace(updatedPath);
                    }
                  }

                  setVideoControlsInfo((prev) => ({
                    ...prev,
                    currentIndex: videoSync?.currentIndex + 1,
                  }));

                  setVideosLoading(false);
                }
              : () => {
                  if (!videosLoading) {
                    dispatch(
                      setChannelsRedux({
                        actionChannels: allVideos?.channels,
                        actionMain:
                          allVideos?.channels?.[
                            (videoSync?.currentIndex + 1) %
                              allVideos?.channels?.length
                          ],
                      })
                    );
                    setVideoControlsInfo((prev) => ({
                      ...prev,
                      currentIndex:
                        (videoSync?.currentIndex + 1) %
                        allVideos?.channels?.length,
                    }));

                    if (router?.asPath?.includes("&video=")) {
                      const videoId = router?.asPath
                        .split("&video=")?.[1]
                        ?.split("&")?.[0];

                      if (videoId) {
                        const updatedPath = router.asPath.replace(
                          `&video=${videoId}`,
                          `&video=${
                            allVideos?.channels?.[
                              (videoSync?.currentIndex + 1) %
                                allVideos?.channels?.length
                            ]?.id
                          }`
                        );
                        router.replace(updatedPath);
                      }
                    } else {
                      const optionRegex =
                        /(sampler|chat|stream|collect)\?option=(history|account|fulfillment)/;
                      if (!optionRegex.test(router?.asPath)) {
                        if (
                          router?.asPath === "/es" ||
                          router?.asPath === "/en" ||
                          router?.asPath === "/"
                        ) {
                          const updatedPath = `${
                            router?.asPath
                          }/#stream?option=history&video=${
                            allVideos?.channels?.[
                              (videoSync?.currentIndex + 1) %
                                allVideos?.channels?.length
                            ]?.id
                          }`;

                          router.replace(updatedPath);
                        }
                      } else {
                        const updatedPath = router?.asPath.replace(
                          optionRegex,
                          `$&${`&video=${
                            allVideos?.channels?.[
                              (videoSync?.currentIndex + 1) %
                                allVideos?.channels?.length
                            ]?.id
                          }`}`
                        );
                        router.replace(updatedPath);
                      }
                    }
                  }
                }
          }
        >
          {videosLoading ? (
            <AiOutlineLoading color="white" size={12} />
          ) : (
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
              width={12}
              height={12}
              alt="forward"
              draggable={false}
            />
          )}
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() => setVolumeOpen(!volumeOpen)}
        >
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              volume === 0
                ? "QmVVzvq68RwGZFi46yKEthuG6PXQf74BaMW4yCrZCkgtzK"
                : "Qme1i88Yd1x4SJfgrSCFyXp7GELCZRnnPQeFUt6jbfPbqL"
            }`}
            width={12}
            height={12}
            alt="volume"
            draggable={false}
          />
        </div>
        {volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
            type="range"
            value={volume}
            max={1}
            min={0}
            step={0.1}
            onChange={(e: FormEvent) => handleVolumeChange(e)}
          />
        )}
      </div>
    </div>
  );
};

export default Controls;
