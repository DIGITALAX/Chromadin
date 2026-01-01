import pollResult from "@/app/lib/helpers/pollResult";
import { ModalContext } from "@/app/providers";
import { Post } from "@lens-protocol/client";
import {
  repost,
  addReaction,
  executePostAction,
  deletePost,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { Indexar } from "../../Common/types/common.types";

const useReactions = (publication: Post, dict: any) => {
  const context = useContext(ModalContext);
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<{
    mirror: boolean;
    collect: boolean;
    like: boolean;
  }>({
    mirror: false,
    collect: false,
    like: false,
  });
  const [interactions, setInteractions] = useState<{
    upvotes: number;
    hasUpvoted: boolean;
    reposts: number;
    hasReposted: boolean;
    collects: number;
    hasSimpleCollected: boolean;
    comments: number;
  }>({
    upvotes: 0,
    hasUpvoted: false,
    reposts: 0,
    hasReposted: false,
    collects: 0,
    hasSimpleCollected: false,
    comments: 0,
  });

  const like = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      like: true,
    }));

    try {
      await addReaction(context?.lensConectado?.sessionClient, {
        post: publication?.id,
        reaction: publication?.operations?.hasUpvoted ? "DOWNVOTE" : "UPVOTE",
      });

      setInteractions((prev) => ({
        ...prev,
        hasUpvoted: publication?.operations?.hasUpvoted ? false : true,
        upvotes: publication?.operations?.hasUpvoted
          ? Number(prev?.upvotes) - 1
          : Number(prev?.upvotes) + 1,
      }));
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
        post: publication?.id,
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
            context?.setModalOpen(dict?.wrong);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactivo);
          }, 3000);
        }
      }

      setInteractions((prev) => ({
        ...prev,
        hasReposted: true,
        reposts: prev.reposts + 1,
      }));
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
          post: publication?.id,
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
            context?.setModalOpen(dict?.wrong);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactivo);
          }, 3000);
        }
      }

      setInteractions((prev) => ({
        ...prev,
        hasSimpleCollected: true,
        collects: prev.collects + 1,
      }));
    } catch (err: any) {
      context?.setModalOpen(dict?.wrong);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: false,
    }));
  };

  const handleHidePost = async () => {
    try {
      const data = await deletePost(context?.lensConectado?.sessionClient!, {
        post: publication?.id,
      });

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

            context?.setModalOpen(dict?.hideT);
          } else {
            context?.setModalOpen(dict?.wrong);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactivo);
          }, 3000);
        }
      }
    } catch (err: any) {
      context?.setModalOpen(dict?.hide);
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (publication) {
      setInteractions({
        upvotes: publication?.stats?.upvotes,
        hasUpvoted: publication?.operations?.hasUpvoted!,
        collects: publication?.stats?.collects,
        hasSimpleCollected: publication?.operations?.hasSimpleCollected!,
        reposts: publication?.stats?.reposts,
        hasReposted: publication?.operations?.hasReposted?.optimistic!,
        comments: publication?.stats?.comments,
      });
    }
  }, [publication]);

  return {
    handleHidePost,
    interactionsLoading,
    simpleCollect,
    like,
    mirror,
    openMirrorChoice,
    setOpenMirrorChoice,
    interactions,
  };
};

export default useReactions;
