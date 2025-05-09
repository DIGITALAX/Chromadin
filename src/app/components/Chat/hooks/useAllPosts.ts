import { ModalContext } from "@/app/providers";
import {
  Account,
  AccountStats,
  PageSize,
  Post,
  PostReferenceType,
  PostType,
  Repost,
} from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { Collection, Viewer } from "../../Common/types/common.types";
import {
  fetchAccount,
  fetchAccountStats,
  fetchPost,
  fetchPostReferences,
  fetchPosts,
} from "@lens-protocol/client/actions";
import { INFURA_GATEWAY, LENS_CREATORS } from "@/app/lib/constants";
import { getCollectionsProfile } from "../../../../../graph/queries/getAllCollections";
import { usePathname, useSearchParams } from "next/navigation";

const useAllPosts = (accountAddress?: string) => {
  const context = useContext(ModalContext);
  const [profile, setProfile] = useState<
    Account & {
      stats: AccountStats;
      collections: Collection[];
    }
  >();
  const search = useSearchParams();
  const path = usePathname();
  const [openComment, setOpenComment] = useState<number | undefined>(undefined);
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [feed, setFeed] = useState<(Post | Repost)[]>([]);
  const [mainPost, setMainPost] = useState<
    | {
        post: Post | Repost;
        comments: Post[];
      }
    | undefined
  >();
  const [info, setInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: false,
    paginated: undefined,
  });
  const [commentsInfo, setCommentsInfo] = useState<{
    hasMore: boolean;
    paginated: string | undefined;
  }>({
    hasMore: false,
    paginated: undefined,
  });

  const getTimeline = async () => {
    setFeedLoading(true);
    try {
      setMainPost(undefined);

      let profile: Account | undefined;
      if (search?.get("profile")) {
        const res = await fetchAccount(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            username: {
              localName: search?.get("profile")!,
            },
          }
        );

        if (res.isOk()) {
          profile = res?.value as Account;

          const stats = await fetchAccountStats(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              account: profile?.address,
            }
          );

          if (stats.isOk()) {
            let collections: Collection[] = [];

            if (
              LENS_CREATORS?.map((add) => add?.toLowerCase())?.includes(
                profile?.address?.toLowerCase()
              )
            ) {
              const data = await getCollectionsProfile(profile?.owner);

              collections = await Promise.all(
                data?.data?.collectionCreateds?.map(
                  async (item: {
                    metadata: {};
                    drop: {
                      uri: string;
                      metadata: {};
                    };
                    uri: string;
                  }) => {
                    if (!item?.metadata) {
                      const res = await fetch(
                        `${INFURA_GATEWAY}/ipfs/${
                          item?.uri?.split("ipfs://")?.[1]
                        }`
                      );
                      const data = await res.json();
                      item = {
                        ...item,
                        metadata: {
                          ...data,
                          mediaTypes: data?.mediaTypes?.[0],
                        },
                      };
                    }

                    if (!item?.metadata) {
                      const res = await fetch(
                        `${INFURA_GATEWAY}/ipfs/${
                          item?.drop?.uri?.split("ipfs://")?.[1]
                        }`
                      );
                      const data = await res.json();
                      item = {
                        ...item,
                        metadata: {
                          ...data,
                        },
                      };
                    }

                    return item;
                  }
                )
              );
            }

            setProfile({
              ...profile,
              stats: stats.value as AccountStats,
              collections,
            });
          }
        }
      }

      const data = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            authors:
              !search?.get("profile") && !path.includes("/autograph/")
                ? LENS_CREATORS
                : path?.includes("/autograph/")
                ? [accountAddress]
                : [profile?.address],
            postTypes: [PostType.Quote, PostType.Repost, PostType.Root],
          },
        }
      );

      if (data.isOk()) {
        const sortedArr = data?.value?.items as Post[];

        setInfo({
          hasMore: sortedArr?.length < 10 ? false : true,
          paginated: data?.value?.pageInfo?.next!,
        });
        setFeed(sortedArr);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreTimeline = async () => {
    if (!info?.hasMore || !profile) return;
    try {
      setMainPost(undefined);

      const data = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          cursor: info?.paginated,
          filter: {
            authors:
              !search?.get("profile") && !path?.includes("/autograph/")
                ? LENS_CREATORS
                : path?.includes("/autograph/")
                ? [accountAddress]
                : [profile?.address],
            postTypes: [PostType.Quote, PostType.Repost, PostType.Root],
          },
        }
      );

      if (data.isOk()) {
        const sortedArr = data?.value?.items as Post[];

        setInfo({
          hasMore: sortedArr?.length < 10 ? false : true,
          paginated: data?.value?.pageInfo?.next!,
        });
        setFeed([...feed, ...sortedArr]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMainPost = async (): Promise<void> => {
    setFeed([]);
    setFeedLoading(true);

    try {
      const mainData = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: search?.get("post"),
        }
      );

      const commentsData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referenceTypes: [PostReferenceType.CommentOn],
          referencedPost: search?.get("post"),
        }
      );

      if (mainData.isOk() && commentsData.isOk()) {
        setMainPost({
          post: mainData?.value as Post,
          comments: commentsData?.value?.items as Post[],
        });
        setCommentsInfo({
          hasMore: commentsData?.value?.items?.length < 10 ? false : true,
          paginated: commentsData?.value?.pageInfo?.next!,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreComments = async (): Promise<void> => {
    if (!commentsInfo.hasMore || mainPost) return;

    try {
      const commentsData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          cursor: commentsInfo.paginated,
          referenceTypes: [PostReferenceType.CommentOn],
          referencedPost: search?.get("post"),
        }
      );

      if (commentsData.isOk()) {
        setMainPost((prev) => ({
          ...(prev as any),
          comments: [
            ...(prev?.comments || []),
            ...(commentsData?.value?.items as Post[]),
          ],
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (!context?.clienteLens) return;

    if (
      context?.viewer == Viewer.Chat ||
      (path?.includes("/autograph/") && accountAddress)
    ) {
      if (
        (path?.includes("/autograph/") && feed?.length < 1) ||
        (!path?.includes("/autograph/") &&
          (!profile ||
            (search?.get("profile")
              ? profile?.address !== feed?.[0]?.author?.address
              : search?.get("post")
              ? profile?.address !== mainPost?.post?.author?.address
              : true)))
      ) {
        setProfile(undefined);
        setFeed([]);
        setMainPost(undefined);

        if (
          !search?.get("post") ||
          (path?.includes("/autograph/") && accountAddress)
        ) {
          getTimeline();
        } else if (search?.get("post")) {
          getMainPost();
        }
      }
    }
  }, [
    context?.viewer,
    accountAddress,
    search.get("profile"),
    search?.get("post"),
    path,
    context?.lensConectado,
    context?.clienteLens,
  ]);

  return {
    profile,
    mainPost,
    feed,
    feedLoading,
    info,
    getMoreTimeline,
    commentsInfo,
    getMoreComments,
    openComment,
    setOpenComment,
  };
};

export default useAllPosts;
