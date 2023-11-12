import {
  getPublications,
  getPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { useEffect, useState } from "react";
import { setDecrypt } from "@/redux/reducers/decryptSlice";
import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
  TextOnlyMetadataV3,
} from "@/components/Home/types/generated";
import { decryptPostIndividual } from "@/lib/helpers/decryptPost";
import { AnyAction, Dispatch } from "redux";
import { AutographState } from "@/redux/reducers/autographSlice";
import { NextRouter } from "next/router";

const useAutoProfile = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  autoDispatch: AutographState,
  lensProfile: Profile | undefined
) => {
  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [profileFeedCount, setProfileFeedCount] = useState<{
    like: number[];
    mirror: number[];
    collect: number[];
    comment: number[];
    hasLiked: boolean[];
    hasMirrored: boolean[];
    hasCollected: boolean[];
  }>({
    like: [],
    mirror: [],
    collect: [],
    comment: [],
    hasLiked: [],
    hasMirrored: [],
    hasCollected: [],
  });
  const [decryptLoading, setDecryptLoading] = useState<boolean>(false);
  const [profileFeed, setProfileFeed] = useState<(Post | Quote | Mirror)[]>([]);
  const [openProfileMirrorChoice, setOpenProfileMirrorChoice] = useState<
    boolean[]
  >([]);
  const [profilePageData, setProfilePageData] = useState<any>();
  const [decryptProfileFeedCount, setDecryptProfileFeedCount] = useState<{
    like: number[];
    mirror: number[];
    collect: number[];
    comment: number[];
    hasLiked: boolean[];
    hasMirrored: boolean[];
    hasCollected: boolean[];
  }>({
    like: [],
    mirror: [],
    collect: [],
    comment: [],
    hasLiked: [],
    hasMirrored: [],
    hasCollected: [],
  });
  const [decryptProfileFeed, setDecryptProfileFeed] = useState<
    (Post | Mirror | Quote)[]
  >([]);
  const [decryptProfilePageData, setDecryptProfilePageData] = useState<any>();
  const [hasMoreDecryptProfile, setHasMoreDecryptProfile] =
    useState<boolean>(true);
  const [followerOnlyProfileDecrypt, setFollowerOnlyProfileDecrypt] = useState<
    boolean[]
  >(Array.from({ length: 10 }, () => false));
  const [collectProfileLoading, setCollectProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [mirrorProfileLoading, setMirrorProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [reactProfileLoading, setReactProfileLoading] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [decryptProfileLoading, setDecryptProfileLoading] =
    useState<boolean>(false);

  const getProfile = async () => {
    setProfileLoading(true);
    let data;
    try {
      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: autoDispatch?.profile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: autoDispatch?.profile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setProfileLoading(false);
        return;
      }

      const arr: (Post | Mirror | Quote)[] = [
        ...data?.data?.publications?.items,
      ] as (Post | Mirror | Quote)[];
      let sortedArr = arr.sort(
        (a: Post | Mirror | Quote, b: Post | Mirror | Quote) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = sortedArr.map((post) => {
        if (
          (post.__typename === "Mirror"
            ? post.mirrorOn
            : (post as Post)
          )?.metadata?.content?.includes("This publication is gated")
        ) {
          return {
            ...post,
            gated: true,
          };
        } else {
          return post;
        }
      });

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreProfile(false);
      } else {
        setHasMoreProfile(true);
      }

      setFollowerOnlyProfile(
        sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : (obj as Post | Quote).referenceModule?.type ===
              "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      setProfilePageData(data?.data?.publications?.pageInfo);
      setProfileFeed(sortedArr);
      setOpenProfileMirrorChoice(
        Array.from({ length: sortedArr.length }, () => false)
      );
      setProfileFeedCount({
        like: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.stats?.reactions
            : (obj as Post | Quote).stats?.reactions
        ),
        mirror: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.stats?.mirrors
            : (obj as Post | Quote).stats?.mirrors
        ),
        collect: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.stats?.countOpenActions
            : (obj as Post | Quote).stats?.countOpenActions
        ),
        comment: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.stats?.comments
            : (obj as Post | Quote).stats?.comments
        ),
        hasLiked: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.operations.hasReacted
            : (obj as Post | Quote).operations.hasReacted
        ),
        hasMirrored: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.operations.hasMirrored
            : (obj as Post | Quote).operations.hasMirrored
        ),
        hasCollected: sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.operations.hasActed?.isFinalisedOnchain
            : (obj as Post | Quote).operations.hasActed?.isFinalisedOnchain
        ),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const fetchMoreProfile = async () => {
    let data;
    try {
      if (!profilePageData?.next) {
        setHasMoreProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: autoDispatch?.profile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
          cursor: profilePageData?.next,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: autoDispatch?.profile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
          cursor: profilePageData?.next,
        });
      }
      const arr: (Post | Mirror | Quote)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Mirror | Quote)[];
      let sortedArr = arr.sort(
        (a: Post | Mirror | Quote, b: Post | Mirror | Quote) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = sortedArr.map((post) => {
        if (
          (post.__typename === "Mirror"
            ? post.mirrorOn
            : (post as Post)
          )?.metadata?.content?.includes("This publication is gated")
        ) {
          return {
            ...post,
            gated: true,
          };
        } else {
          return post;
        }
      });

      if (sortedArr?.length < 10) {
        setHasMoreProfile(false);
      }

      setFollowerOnlyProfile([
        ...followerOnlyProfile,
        ...sortedArr.map((obj: Post | Mirror | Quote) =>
          obj.__typename === "Mirror"
            ? obj.mirrorOn.referenceModule?.type ===
              "FollowerOnlyReferenceModule"
              ? true
              : false
            : (obj as Post | Quote).referenceModule?.type ===
              "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      setOpenProfileMirrorChoice([
        ...openProfileMirrorChoice,
        ...Array.from({ length: sortedArr.length }, () => false),
      ]);
      setProfileFeedCount({
        like: [
          ...profileFeedCount?.like,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.reactions
              : (obj as Post | Quote).stats.reactions
          ),
        ],
        mirror: [
          ...profileFeedCount?.mirror,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.mirrors
              : (obj as Post | Quote).stats.mirrors
          ),
        ],
        collect: [
          ...profileFeedCount?.collect,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.countOpenActions
              : (obj as Post | Quote).stats.countOpenActions
          ),
        ],
        comment: [
          ...profileFeedCount?.comment,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats.comments
              : (obj as Post | Quote).stats.comments
          ),
        ],
        hasLiked: [
          ...profileFeedCount?.hasLiked,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasReacted
              : (obj as Post | Quote).operations?.hasReacted
          ),
        ],
        hasMirrored: [
          ...profileFeedCount?.hasMirrored,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasMirrored
              : (obj as Post | Quote).operations?.hasMirrored
          ),
        ],
        hasCollected: [
          ...profileFeedCount?.hasCollected,
          ...sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasActed?.isFinalisedOnchain
              : (obj as Post | Quote).operations?.hasActed?.isFinalisedOnchain
          ),
        ],
      });
      setProfilePageData(data?.data?.publications?.pageInfo);
      setProfileFeed([...profileFeed, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getProfileDecrypt = async () => {
    setDecryptProfileLoading(true);
    let data;
    try {
      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: [autoDispatch?.profile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: [autoDispatch?.profile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
        });
      }

      if (!data || !data?.data || !data?.data?.publications) {
        setDecryptProfileLoading(false);
        return;
      }

      const arr: Post[] = [...data?.data?.publications?.items] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = sortedArr.map((post) => {
        if (post?.metadata?.content?.includes("This publication is gated")) {
          return {
            ...post,
            gated: true,
          };
        } else {
          return post;
        }
      });

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      } else {
        setHasMoreDecryptProfile(true);
      }

      setFollowerOnlyProfileDecrypt(
        sortedArr.map((obj: Post) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        )
      );
      setDecryptProfilePageData(data?.data?.publications?.pageInfo);
      setDecryptProfileFeed(sortedArr);
      setDecryptProfileFeedCount({
        like: sortedArr.map((obj: Post) => obj.stats?.reactions),
        mirror: sortedArr.map((obj: Post) => obj.stats?.mirrors),
        collect: sortedArr.map((obj: Post) => obj.stats?.countOpenActions),
        comment: sortedArr.map((obj: Post) => obj.stats?.comments),
        hasLiked: sortedArr.map((obj: Post) => obj.operations?.hasReacted),
        hasMirrored: sortedArr.map((obj: Post) => obj.operations?.hasMirrored),
        hasCollected: sortedArr.map(
          (obj: Post) => obj.operations?.hasActed?.isFinalisedOnchain
        ),
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptProfileLoading(false);
  };

  const decryptPost = async (post: Post | Mirror) => {
    setDecryptLoading(true);
    try {
      if (
        address &&
        (post.__typename === "Mirror" ? post.mirrorOn : (post as Post))
          .operations.canDecrypt.result
      ) {
        const newPost = (await decryptPostIndividual(address, post)) as
          | Post
          | Quote
          | Mirror;

        const newProfileFeed = [...profileFeed]?.map((item) =>
          item?.id === post?.id ? newPost : item
        );
        const newDecryptFeed = [...decryptProfileFeed]?.map((item) =>
          item?.id === post?.id ? newPost : item
        );

        setProfileFeed(newProfileFeed);
        setDecryptProfileFeed(newDecryptFeed);
      } else {
        dispatch(
          setDecrypt({
            actionOpen: true,
            actionCollections: (post?.__typename === "Mirror"
              ? (post?.mirrorOn?.metadata as TextOnlyMetadataV3)?.content
              : ((post as Post)?.metadata as TextOnlyMetadataV3)?.content
            )
              ?.split("gate.")[1]
              ?.split("are ready to collect")[0]
              .split(",")
              .map((word: string) => word.trim()),
            actionName: post?.by?.ownedBy?.address,
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptLoading(false);
  };

  const fetchMoreProfileDecrypt = async () => {
    let data;
    try {
      if (!decryptProfilePageData?.next) {
        setHasMoreDecryptProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: [autoDispatch?.profile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
          cursor: decryptProfilePageData?.next,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: [autoDispatch?.profile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
          cursor: decryptProfilePageData?.next,
        });
      }
      const arr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      sortedArr = sortedArr.map((post) => {
        if (post?.metadata?.content?.includes("This publication is gated")) {
          return {
            ...post,
            gated: true,
          };
        } else {
          return post;
        }
      });

      if (sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      }

      setDecryptProfileFeedCount({
        like: [
          ...decryptProfileFeedCount?.like,
          ...sortedArr.map((obj: Post) => obj.stats.reactions),
        ],
        mirror: [
          ...decryptProfileFeedCount?.mirror,
          ...sortedArr.map((obj: Post) => obj.stats.mirrors),
        ],
        collect: [
          ...decryptProfileFeedCount?.collect,
          ...sortedArr.map((obj: Post) => obj.stats.countOpenActions),
        ],
        comment: [
          ...decryptProfileFeedCount?.comment,
          ...sortedArr.map((obj: Post) => obj.stats.comments),
        ],
        hasLiked: [
          ...decryptProfileFeedCount?.hasLiked,
          ...sortedArr.map((obj: Post) => obj.operations?.hasReacted),
        ],
        hasMirrored: [
          ...decryptProfileFeedCount?.hasMirrored,
          ...sortedArr.map((obj: Post) => obj.operations?.hasMirrored),
        ],
        hasCollected: [
          ...decryptProfileFeedCount?.hasCollected,
          ...sortedArr.map(
            (obj: Post) => obj.operations?.hasActed?.isFinalisedOnchain
          ),
        ],
      });

      setFollowerOnlyProfileDecrypt([
        ...followerOnlyProfileDecrypt,
        ...sortedArr.map((obj: Post) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      setDecryptProfilePageData(data?.data?.publications?.pageInfo);
      setDecryptProfileFeed([...decryptProfileFeed, ...sortedArr]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router.asPath.includes("autograph") &&
      !router.asPath.includes("collection") &&
      !router.asPath.includes("drop") &&
      autoDispatch?.profile?.id
    ) {
      getProfile();
      getProfileDecrypt();
    }
  }, [autoDispatch?.profile?.id, router.asPath]);

  return {
    hasMoreProfile,
    fetchMoreProfile,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    hasMoreDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileFeed,
    profileFeedCount,
    decryptProfileFeed,
    decryptProfileFeedCount,
    decryptPost,
    decryptLoading,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  };
};

export default useAutoProfile;
