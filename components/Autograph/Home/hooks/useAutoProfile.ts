import { getPublications } from "@/graphql/lens/queries/getVideos";
import { useEffect, useState } from "react";
import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
  TextOnlyMetadataV3,
} from "@/components/Home/types/generated";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";

const useAutoProfile = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  address: `0x${string}` | undefined,
  autoProfile: Profile | undefined,
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
  const [profileFeed, setProfileFeed] = useState<(Post | Quote | Mirror)[]>([]);
  const [openProfileMirrorChoice, setOpenProfileMirrorChoice] = useState<
    boolean[]
  >([]);
  const [profilePageData, setProfilePageData] = useState<any>();
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

  const getProfile = async () => {
    setProfileLoading(true);

    try {
      const data = await getPublications(
        {
          where: {
            from: autoProfile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
        },
        lensProfile?.id
      );

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
    try {
      if (!profilePageData?.next) {
        setHasMoreProfile(false);
        return;
      }

      const data = await getPublications(
        {
          where: {
            from: autoProfile?.id,
            publicationTypes: [
              PublicationType.Mirror,
              PublicationType.Quote,
              PublicationType.Post,
            ],
          },
          limit: LimitType.Ten,
          cursor: profilePageData?.next,
        },
        lensProfile?.id
      );

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


  useEffect(() => {
    if (
      router.asPath.includes("autograph") &&
      !router.asPath.includes("collection") &&
      !router.asPath.includes("drop") &&
      autoProfile?.id
    ) {
      getProfile();
    }
  }, [autoProfile?.id, router.asPath]);

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
    profileFeed,
    profileFeedCount,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  };
};

export default useAutoProfile;
