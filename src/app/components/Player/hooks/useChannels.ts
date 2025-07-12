import { useContext, useEffect, useState } from "react";
import {
  MainContentFocus,
  PageSize,
  Post,
  VideoMetadata,
} from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { useSearchParams } from "next/navigation";
import { fetchPosts } from "@lens-protocol/client/actions";
import { CHROMADIN, VIDEO_COVERS } from "@/app/lib/constants";

const useChannels = () => {
  const context = useContext(ModalContext);
  const path = useSearchParams();
  const [secondaryComment, setSecondaryComment] = useState<string>("");
  const [commentLoading, setCommentsLoading] = useState<boolean>(false);

  const getVideos = async (): Promise<void> => {
    context?.setVideoInfo((prev) => ({
      ...prev,
      videosLoading: true,
    }));

    let sortedArr: Post[] = [],
      main: Post,
      next: string | undefined;

    try {
      const firstData = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
            authors: [CHROMADIN],
          },
        }
      );

      if (firstData?.isOk()) {
        next = firstData?.value?.pageInfo?.next!;
        sortedArr = (firstData?.value?.items || [])?.map((item) =>
          VIDEO_COVERS?.some((cov) => cov.id == (item as Post)?.id)
            ? {
                ...item,
                metadata: {
                  ...(item as Post).metadata,
                  video: {
                    ...((item as Post)?.metadata as VideoMetadata)?.video,
                    cover:
                      "ipfs://" +
                      VIDEO_COVERS?.find((cov) => cov.id == (item as Post)?.id)
                        ?.poster,
                  },
                },
              }
            : item
        ) as Post[];

        const elemento = sortedArr?.find((item) =>
          path?.get("video")?.includes(item?.id)
        );

        main = sortedArr[0];
        if (path?.get("video")) {
          if (elemento) {
            main = elemento as Post;
          } else {
            while (next) {
              const data = await fetchPosts(
                context?.lensConectado?.sessionClient ?? context?.clienteLens!,
                {
                  pageSize: PageSize.Ten,
                  cursor: next,
                  filter: {
                    metadata: {
                      mainContentFocus: [MainContentFocus.Video],
                    },
                    authors: [CHROMADIN],
                  },
                }
              );

              if (data.isOk()) {
                const elemento = data?.value?.items?.find((item) =>
                  path?.get("video")?.includes(item?.id)
                );

                const arr = (data?.value?.items || [])?.map((item) =>
                  VIDEO_COVERS?.some((cov) => cov.id == (item as Post)?.id)
                    ? {
                        ...item,
                        metadata: {
                          ...(item as Post).metadata,
                          video: {
                            ...((item as Post)?.metadata as VideoMetadata)
                              ?.video,
                            cover:
                              "ipfs://" +
                              VIDEO_COVERS?.find(
                                (cov) => cov.id == (item as Post)?.id
                              )?.poster,
                          },
                        },
                      }
                    : item
                ) as Post[];

                sortedArr = [...sortedArr, ...arr];
                next = data?.value?.pageInfo?.next!;
                if (elemento) {
                  main = sortedArr?.find((item) =>
                    path?.get("video")?.includes(item?.id)
                  ) as Post;
                  break;
                }
              }
            }
          }
        }

        context?.setVideoInfo((prev) => ({
          ...prev,
          paginated: next,
          hasMore: sortedArr?.length < 10 ? false : true,
          channels: sortedArr,
          currentIndex: sortedArr.findIndex((el) => el.id == main?.id),
          videosLoading: false,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
      context?.setVideoInfo((prev) => ({
        ...prev,
        videosLoading: false,
      }));
    }
  };

  const fetchMoreVideos = async (): Promise<Post[] | undefined> => {
    if (!context?.videoInfo?.hasMore) return;
    try {
      const data = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          cursor: context?.videoInfo?.paginated,
          filter: {
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
            },
            authors: [CHROMADIN],
          },
        }
      );

      if (data.isOk()) {
        const sortedArr: Post[] = (data?.value?.items || [])?.map((item) =>
          VIDEO_COVERS?.some((cov) => cov.id == (item as Post)?.id)
            ? {
                ...item,
                metadata: {
                  ...(item as Post).metadata,
                  video: {
                    ...((item as Post)?.metadata as VideoMetadata)?.video,
                    cover:
                      "ipfs://" +
                      VIDEO_COVERS?.find((cov) => cov.id == (item as Post)?.id)
                        ?.poster,
                  },
                },
              }
            : item
        ) as Post[];

        context?.setVideoInfo((prev) => ({
          ...prev,
          paginated: data?.value?.pageInfo?.next!,
          hasMore: sortedArr?.length < 10 ? false : true,
          channels: [...prev?.channels, ...sortedArr],
          videosLoading: false,
        }));

        return [...context?.videoInfo?.channels, ...sortedArr];
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      Number(context?.videoInfo?.channels?.length) < 1 &&
      context?.clienteLens
    ) {
      getVideos();
    }
  }, [context?.clienteLens]);


  return {
    fetchMoreVideos,
    secondaryComment,
    setSecondaryComment,
    commentLoading,
    setCommentsLoading,
  };
};

export default useChannels;
