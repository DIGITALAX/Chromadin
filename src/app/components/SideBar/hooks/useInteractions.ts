import pollResult from "@/app/lib/helpers/pollResult";
import { ModalContext } from "@/app/providers";
import { PageSize, Post, PostReferenceType } from "@lens-protocol/client";
import {
  fetchPostReferences,
  repost,
  addReaction,
  executePostAction,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { Indexar } from "../../Common/types/common.types";

const useInteractions = (dict: any, secondaryComment: string) => {
  const context = useContext(ModalContext);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);
  const [commentors, setCommentors] = useState<Post[]>([]);
  const [commentsInfo, setCommentsInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: true,
    paginated: undefined,
  });
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      collect: boolean;
      like: boolean;
    }[]
  >([]);

  const like = async (id: string, hasReacted: boolean): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        like: true,
      };

      return arr;
    });

    try {
      await addReaction(context?.lensConectado?.sessionClient, {
        post: id,
        reaction: hasReacted ? "DOWNVOTE" : "UPVOTE",
      });

      setCommentors((prev) => {
        let arr = [...prev];
        const index = prev?.findIndex((com) => com?.id == id)!;

        arr[index] = {
          ...arr[index],
          operations: {
            ...arr[index].operations!,
            hasUpvoted: hasReacted ? false : true,
          },
          stats: {
            ...arr[index].stats,
            upvotes: hasReacted
              ? Number(arr[index]?.stats?.upvotes) - 1
              : Number(arr[index]?.stats?.upvotes) + 1,
          },
        };

        return arr;
      });
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        like: false,
      };

      return arr;
    });
  };

  const mirror = async (id: string): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        mirror: true,
      };

      return arr;
    });
    try {
      const res = await repost(context?.lensConectado?.sessionClient, {
        post: id,
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

      setCommentors((prev) => {
        let arr = [...prev];
        const index = prev?.findIndex((com) => com?.id == id)!;

        arr[index] = {
          ...arr[index],
          stats: {
            ...arr[index].stats!,
            reposts: arr[index].stats.reposts + 1,
          },
          operations: {
            ...arr[index].operations!,
            hasReposted: {
              ...arr[index].operations!?.hasReposted,
              optimistic: true,
            },
          },
        };

        return arr;
      });
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        mirror: false,
      };

      return arr;
    });
  };

  const simpleCollect = async (id: string) => {
    if (!context?.lensConectado?.profile) return;

    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        collect: true,
      };

      return arr;
    });
    try {
      const data = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: id,
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

      setCommentors((prev) => {
        let arr = [...prev];

        const index = prev?.findIndex((com) => com?.id == id)!;

        arr[index] = {
          ...arr[index],
          operations: {
            ...arr[index].operations!,
            hasSimpleCollected: true,
          },
          stats: {
            ...arr[index].stats,
            collects: Number(arr[index]?.stats?.collects) + 1,
          },
        };

        return arr;
      });
    } catch (err: any) {
      context?.setModalOpen(dict?.wrong);
    }

    setInteractionsLoading((prev) => {
      let arr = [...prev];

      arr[commentors?.findIndex((com) => com?.id == id)] = {
        ...arr[commentors?.findIndex((com) => com?.id == id)],
        collect: false,
      };

      return arr;
    });
  };

  const getComments = async (): Promise<void> => {
    setCommentsLoading(true);
    try {
      const comments = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!!,
        {
          pageSize: PageSize.Ten,
          referencedPost:
            secondaryComment !== ""
              ? secondaryComment
              : context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
          referenceTypes: [PostReferenceType.CommentOn],
        }
      );

      if (comments.isErr()) {
        setCommentsLoading(false);
        return;
      }

      const sortedArr: Post[] = [...comments.value.items] as Post[];
      setCommentors(sortedArr);
      setCommentsInfo({
        hasMore: sortedArr?.length < 10 ? false : true,
        paginated: comments?.value?.pageInfo?.next!,
      });
      setInteractionsLoading(
        Array.from({ length: comments.value.items!?.length }, () => ({
          like: false,
          collect: false,
          mirror: false,
        }))
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentsLoading(false);
  };

  const getMorePostComments = async (): Promise<void> => {
    try {
      if (!commentsInfo?.hasMore) return;

      const comments = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!!,
        {
          cursor: commentsInfo?.paginated,
          pageSize: PageSize.Ten,
          referencedPost:
            secondaryComment !== ""
              ? secondaryComment
              : context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
          referenceTypes: [PostReferenceType.CommentOn],
        }
      );

      if (comments.isErr()) {
        setCommentsLoading(false);
        return;
      }

      const sortedArr: Post[] = [...(comments?.value?.items || [])] as Post[];
      setCommentors([...commentors, ...sortedArr]);
      setCommentsInfo({
        hasMore: sortedArr?.length < 10 ? false : true,
        paginated: comments?.value?.pageInfo?.next!,
      });
      setInteractionsLoading((prev) => [
        ...prev,
        ...Array.from({ length: comments.value.items!?.length }, () => ({
          like: false,
          collect: false,
          mirror: false,
        })),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      (context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id ||
        secondaryComment !== "" ||
        dict?.commentMade == context?.modalOpen) &&
      context?.clienteLens
    ) {
      getComments();
    }
  }, [
    context?.videoInfo?.channels?.[context?.videoInfo?.currentIndex]?.id,
    secondaryComment,
    context?.clienteLens,
    context?.modalOpen,
  ]);

  return {
    commentors,
    getMorePostComments,
    commentsLoading,
    commentsInfo,
    simpleCollect,
    mirror,
    like,
    interactionsLoading,
  };
};

export default useInteractions;
