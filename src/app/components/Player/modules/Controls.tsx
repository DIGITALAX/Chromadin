import Image from "next/image";
import { FormEvent, FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import { ModalContext } from "@/app/providers";
import { Viewer } from "../../Common/types/common.types";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import formatTime from "@/app/lib/helpers/formatTime";
import { ControlsProps } from "../types/player.types";

const Controls: FunctionComponent<ControlsProps> = ({
  volume,
  setVolumeOpen,
  volumeOpen,
  fetchMoreVideos,
  handleSeek,
  progressRef,
  mirror,
  like,
  simpleCollect,
  interactionsLoading,
  handleHeart,
  handleVolumeChange,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const search = useSearchParams();

  return (
    <div
      className={`relative h-fit flex w-full gap-3 items-center galaxy:px-2 justify-center ${
        context?.viewer === Viewer.Autograph
          ? "flex-col stuck3:flex-row"
          : "flex-col md:flex-row"
      }`}
    >
      <div
        className={`relative w-fit h-full flex justify-center items-center gap-3 ${
          context?.viewer === Viewer.Autograph ? "stuck3:w-56" : "md:w-56"
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
              src={`${INFURA_GATEWAY_INTERNAL}QmVpncAteeF7voaGu1ZV5qP63UpZW2xmiCWVftL1QnL5ja`}
              alt="expand"
              fill
              className="flex items-center"
              draggable={false}
            />
          </div>
        </div> */}
        <div className="relative w-fit h-full flex items-center font-digi text-base text-white">
          <span className="text-rosa">
            {formatTime(context?.videoControlsInfo?.currentTime || 0)}
          </span>
          /
          <span className="text-light">
            {formatTime(context?.videoControlsInfo?.duration || 0)}
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
                ((context?.videoControlsInfo?.currentTime || 0) /
                  (context?.videoControlsInfo?.duration || 0)) *
                100
              }%`,
            }}
          />
        </div>
      </div>
      <div
        className={`relative w-fit flex flex-row gap-3 items-center justify-center sm:flex-nowrap flex-wrap ${
          context?.viewer === Viewer.Autograph
            ? "stuck3:justify-end"
            : "md:justify-end"
        }`}
      >
        <div
          className={`cursor-pointer relative w-fit items-center justify-center h-fit flex`}
          title="Quests"
          onClick={() =>
            context?.setQuest(
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
            )
          }
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmamuRQd93o5RLxs8v94MB17QLs3cwY8UuZEhQxMiiA4uM`}
              width={20}
              height={20}
              alt="heart"
              draggable={false}
            />
          </div>
        </div>
        <div
          className={`cursor-pointer relative w-fit items-center justify-center h-fit flex`}
          onClick={() => context?.setMetrics(true)}
          title="Metrics"
        >
          <div className="relative w-3 h-4 flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}Qma1kaB25wsb9MMpGRrfTiWVERsrK3bPLLd5vW7r9M8AvR`}
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
              context?.lensConectado?.profile
                ? () => {
                    handleHeart();
                    like();
                  }
                : () => handleHeart()
            }
          >
            {interactionsLoading?.like ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY_INTERNAL}${
                    context?.videoInfo?.channels?.[
                      context?.videoInfo?.currentIndex
                    ]?.operations?.hasUpvoted
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
            {numeral(
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                ?.stats?.upvotes
            ).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${
              context?.lensConectado?.profile && "cursor-pointer"
            } relative w-full ${
              interactionsLoading?.collect && "animate-spin"
            }`}
            onClick={() => context?.lensConectado?.profile && simpleCollect()}
          >
            {interactionsLoading?.collect ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY_INTERNAL}${
                    context?.videoInfo?.channels?.[
                      context?.videoInfo?.currentIndex
                    ]?.operations?.hasSimpleCollected
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
            {numeral(
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                ?.stats?.collects
            ).format("0a")}
          </div>
        </div>
        <div className="relative flex flex-row w-fit h-fit gap-2 items-center justify-center">
          <div
            className={`${
              context?.lensConectado?.profile && "cursor-pointer"
            } relative w-fit ${interactionsLoading?.mirror && "animate-spin"}`}
            onClick={() => context?.lensConectado?.profile && mirror()}
          >
            {interactionsLoading?.mirror ? (
              <AiOutlineLoading size={12} color="white" />
            ) : (
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  src={`${INFURA_GATEWAY_INTERNAL}${
                    context?.videoInfo?.channels?.[
                      context?.videoInfo?.currentIndex
                    ]?.operations?.hasReposted?.optimistic
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
            {numeral(
              context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
                ?.stats?.reposts
            ).format("0a")}
          </div>
        </div>
        <div
          className="relative cursor-pointer rotate-180 w-3 h-3 flex items-center justify-center"
          onClick={() => {
            context?.setVideoInfo((prev) => ({
              ...prev,
              currentIndex:
                context?.videoInfo?.currentIndex ===
                Number(context?.videoInfo?.channels?.length) - 1
                  ? 0
                  : context?.videoInfo?.currentIndex === 0
                  ? context?.videoInfo?.channels?.length - 1
                  : Number(context?.videoInfo?.currentIndex) - 1,
            }));

            const params = new URLSearchParams(search.toString());
            if (params.has("video")) {
              params.set(
                "video",
                context?.videoInfo?.channels[
                  context?.videoInfo?.currentIndex ===
                  context?.videoInfo?.channels?.length - 1
                    ? 0
                    : context?.videoInfo?.currentIndex === 0
                    ? context?.videoInfo?.channels?.length - 1
                    : context?.videoInfo?.currentIndex - 1
                ]?.id!
              );
            } else {
              params.append(
                "video",
                context?.videoInfo?.channels[
                  context?.videoInfo?.currentIndex ===
                  context?.videoInfo?.channels?.length - 1
                    ? 0
                    : context?.videoInfo?.currentIndex === 0
                    ? context?.videoInfo?.channels?.length - 1
                    : context?.videoInfo?.currentIndex - 1
                ]?.id!
              );
            }

            router.replace(`${path}?${params.toString()}`);
          }}
        >
          <Image
            src={`${INFURA_GATEWAY_INTERNAL}QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
            width={12}
            height={12}
            alt="backward"
            draggable={false}
          />
        </div>
        <div
          className="relative cursor-pointer w-3 h-3 flex items-center justify-center"
          onClick={() =>
            context?.setVideoControlsInfo((prev) => ({
              ...prev,
              isPlaying: !prev?.isPlaying,
            }))
          }
        >
          <Image
            src={`${INFURA_GATEWAY_INTERNAL}${
              context?.videoControlsInfo.isPlaying
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
            context?.videoControlsInfo?.videosLoading && "animate-spin"
          }`}
          onClick={
            context?.videoInfo?.hasMore &&
            (Number(context?.videoInfo?.currentIndex) + 1) %
              context?.videoInfo?.channels?.length ===
              0 &&
            !context?.videoControlsInfo?.videosLoading
              ? async () => {
                  context?.setVideoControlsInfo((prev) => ({
                    ...prev,
                    videosLoading: true,
                  }));
                  const more = await fetchMoreVideos();
                  if (more) {
                    context?.setVideoInfo((prev) => ({
                      ...prev,
                      channels: more,
                      currentIndex:
                        Number(context?.videoInfo?.currentIndex) + 1,
                    }));
                  }

                  const params = new URLSearchParams(search?.toString());

                  if (search?.get("video")) {
                    params.set(
                      "video",
                      more?.[Number(context?.videoInfo?.currentIndex) + 1]?.id!
                    );
                  } else {
                    params.append(
                      "video",
                      more?.[Number(context?.videoInfo?.currentIndex) + 1]?.id!
                    );
                  }

                  router.replace(`${path}?${params?.toString()}`);

                  context?.setVideoControlsInfo((prev) => ({
                    ...prev,

                    videosLoading: false,
                  }));
                }
              : () => {
                  if (!context?.videoControlsInfo?.videosLoading) {
                    const nextIndex =
                      (Number(context?.videoInfo?.currentIndex) + 1) %
                      Number(context?.videoInfo?.channels?.length);
                    const nextVideoId =
                      context?.videoInfo?.channels?.[nextIndex]?.id;

                    context?.setVideoInfo((prev) => ({
                      ...prev,
                      currentIndex: nextIndex,
                    }));

                    const params = new URLSearchParams(search?.toString());

                    if (search?.get("video")) {
                      params.set("video", nextVideoId!);
                    } else {
                      params.append("video", nextVideoId!);
                    }

                    router.replace(`${path}?${params?.toString()}`);
                  }
                }
          }
        >
          {context?.videoControlsInfo?.videosLoading ? (
            <AiOutlineLoading color="white" size={12} />
          ) : (
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmcYHKZJWJjgibox8iLqNozENnkgD4CZQqYsmmVJpoYUyo`}
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
            src={`${INFURA_GATEWAY_INTERNAL}${
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
