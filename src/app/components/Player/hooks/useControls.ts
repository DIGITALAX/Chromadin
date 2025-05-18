import {
  FormEvent,
  MouseEvent,
  RefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ModalContext } from "@/app/providers";
import { Indexar } from "../../Common/types/common.types";
import pollResult from "@/app/lib/helpers/pollResult";
import {
  addReaction,
  executePostAction,
  repost,
} from "@lens-protocol/client/actions";
import { Post } from "@lens-protocol/client";
import { useSearchParams } from "next/navigation";

const useControls = (
  dict: any,
  wrapperRef: RefObject<HTMLVideoElement | null>
) => {
  const context = useContext(ModalContext);
  const search = useSearchParams();
  const progressRef = useRef<HTMLDivElement>(null);
  const [volume, setVolume] = useState<number>(1);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<{
    mirror: boolean;
    collect: boolean;
    like: boolean;
  }>({
    mirror: false,
    collect: false,
    like: false,
  });

  const handleSeek = (
    e: MouseEvent<HTMLDivElement, MouseEvent<Element, MouseEvent>>
  ) => {
    const progressRect = e.currentTarget.getBoundingClientRect();
    const seekPosition = (e.clientX - progressRect.left) / progressRect.width;

    if (wrapperRef.current) {
      wrapperRef.current.currentTime =
        seekPosition * Number(context?.videoControlsInfo?.duration);
    }

    context?.setVideoControlsInfo((prev) => ({
      ...prev,
      currentTime: seekPosition * prev.duration,
    }));
  };

  const handleHeart = () => {
    context?.setVideoControlsInfo((prev) => ({
      ...prev,
      heart: true,
    }));

    setTimeout(() => {
      context?.setVideoControlsInfo((prev) => ({
        ...prev,
        heart: false,
      }));
    }, 3000);
  };

  const handleVolumeChange = (e: FormEvent) => {
    setVolume(parseFloat((e.target as HTMLFormElement).value));

    if (wrapperRef.current) {
      wrapperRef.current.volume = parseFloat(
        (e.target as HTMLFormElement).value
      );
    }
  };

  const like = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      like: true,
    }));

    try {
      await addReaction(context?.lensConectado?.sessionClient, {
        post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
          ?.id,
        reaction: context?.videoInfo?.channels?.[
          context?.videoInfo?.currentIndex
        ]?.operations?.hasUpvoted
          ? "DOWNVOTE"
          : "UPVOTE",
      });

      context?.setVideoInfo((prev) => {
        let arr = [...prev.channels];
        const index = arr?.findIndex(
          (com) => com?.id == prev?.channels?.[prev?.currentIndex]?.id
        )!;

        const updated = {
          operations: {
            ...prev?.channels?.[prev?.currentIndex]?.operations!,
            hasUpvoted: prev?.channels?.[prev?.currentIndex]?.operations
              ?.hasUpvoted
              ? false
              : true,
          },
          stats: {
            ...prev?.channels?.[prev?.currentIndex]?.stats,
            upvotes: prev?.channels?.[prev?.currentIndex]?.operations
              ?.hasUpvoted
              ? Number(prev?.channels?.[prev?.currentIndex]?.stats?.upvotes) - 1
              : Number(prev?.channels?.[prev?.currentIndex]?.stats?.upvotes) +
                1,
          },
        };

        let main = {
          ...prev?.channels?.[prev?.currentIndex]!,
          ...updated,
        } as Post;
        arr[index] = main as Post;
        return {
          ...prev,
          channels: arr,
          main,
        };
      });
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      like: false,
    }));
  };

  const mirror = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: true,
    }));

    try {
      const res = await repost(context?.lensConectado?.sessionClient, {
        post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
          ?.id,
      });

      if (res.isOk()) {
        if ((res.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((res.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (res.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Exito);
          } else {
            context?.setModalOpen(dict?.Common?.wrong);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactivo);
          }, 3000);
        }

        context?.setVideoInfo((prev) => {
          let arr = [...prev.channels];
          const index = arr?.findIndex(
            (com) => com?.id == prev?.channels?.[prev?.currentIndex]?.id
          )!;

          const updated = {
            stats: {
              ...prev?.channels?.[prev?.currentIndex]?.stats!,
              reposts:
                Number(prev?.channels?.[prev?.currentIndex]?.stats.reposts) + 1,
            },
            operations: {
              ...prev?.channels?.[prev?.currentIndex]?.operations!,
              hasReposted: {
                ...prev?.channels?.[prev?.currentIndex]?.operations!
                  ?.hasReposted,
                optimistic: true,
              },
            },
          };

          let main = {
            ...prev?.channels?.[prev?.currentIndex]!,
            ...updated,
          } as Post;
          arr[index] = main as Post;
          return {
            ...prev,
            channels: arr,
            main,
          };
        });
      } else {
        context?.setModalOpen?.(dict.Common.wrong);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: false,
    }));
  };

  const simpleCollect = async () => {
    if (!context?.lensConectado?.profile) return;

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: true,
    }));

    try {
      const data = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]
            ?.id,
          action: {
            simpleCollect: {
              selected: true,
            },
          },
        }
      );

      if (data.isOk()) {
        if ((data.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((data.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (data.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Exito);
          } else {
            context?.setModalOpen(dict?.Common?.wrong);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactivo);
          }, 3000);
        }

        context?.setVideoInfo((prev) => {
          let arr = [...prev.channels];
          const index = arr?.findIndex(
            (com) => com?.id == prev?.channels?.[prev?.currentIndex]?.id
          )!;

          const updated = {
            operations: {
              ...prev?.channels?.[prev?.currentIndex]?.operations!,
              hasSimpleCollected: true,
            },
            stats: {
              ...prev?.channels?.[prev?.currentIndex]?.stats,
              collects:
                Number(prev?.channels?.[prev?.currentIndex]?.stats?.collects) +
                1,
            },
          };

          let main = {
            ...prev?.channels?.[prev?.currentIndex]!,
            ...updated,
          } as Post;
          arr[index] = main as Post;
          return {
            ...prev,
            channels: arr,
            main,
          };
        });
      } else {
        context?.setModalOpen?.(dict.Common.wrong);
      }
    } catch (err: any) {
      context?.setModalOpen(dict?.Common?.wrong);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: false,
    }));
  };

  useEffect(() => {
    if (!wrapperRef.current) return;

    if (context?.videoControlsInfo?.isPlaying) {
      wrapperRef.current.play().catch((err) => {
        console.warn("Autoplay failed:", err);
      });
    } else {
      wrapperRef.current.pause();
    }
  }, [context?.videoControlsInfo?.isPlaying, wrapperRef.current]);

  return {
    handleSeek,
    handleHeart,
    handleVolumeChange,
    volume,
    setVolumeOpen,
    volumeOpen,
    interactionsLoading,
    like,
    simpleCollect,
    mirror,
    progressRef,
  };
};

export default useControls;
