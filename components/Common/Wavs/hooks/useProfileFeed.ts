import {
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationType,
  Quote,
} from "@/components/Home/types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getPublications } from "@/graphql/lens/queries/getVideos";
import {
  ProfileFeedCountState,
  setProfileFeedCount,
} from "@/redux/reducers/profileFeedCountSlice";
import { setProfileFeedRedux } from "@/redux/reducers/profileFeedSlice";
import { setProfilePaginated } from "@/redux/reducers/profilePaginatedSlice";
import { setProfile } from "@/redux/reducers/profileSlice";
import { useEffect, useState } from "react";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import { Collection } from "@/components/Home/types/home.types";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";

const useProfileFeed = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  profileDispatch: (Post | Quote | Mirror)[],
  postSent: boolean,
  quickProfiles: Profile[],
  lensProfile: Profile | undefined,
  feedProfile: Profile | undefined,
  profilePageData: string | undefined,
  profileFeedCount: ProfileFeedCountState
) => {
  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [openProfileMirrorChoice, setOpenProfileMirrorChoice] = useState<
    boolean[]
  >([]);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
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
  const [profileCollections, setProfileCollections] = useState<Collection[]>(
    []
  );
  const [profileCollectionsLoading, setProfileCollectionsLoading] =
    useState<boolean>(false);

  const getProfile = async () => {
    setProfileLoading(true);

    try {
      const data = await getPublications(
        {
          where: {
            from: [feedProfile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
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

      const sortedArr: (Post | Mirror | Quote)[] = [
        ...data?.data?.publications?.items,
      ] as (Post | Mirror | Quote)[];

      if (!sortedArr || sortedArr?.length < 10) {
        setHasMoreProfile(false);
      } else {
        setHasMoreProfile(true);
      }
      setOpenProfileMirrorChoice(
        Array.from({ length: sortedArr.length }, () => false)
      );
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
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo?.next));
      dispatch(setProfileFeedRedux(sortedArr));
      dispatch(
        setProfileFeedCount({
          actionLike: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats?.reactions
              : (obj as Post | Quote).stats?.reactions
          ),
          actionMirror: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats?.mirrors
              : (obj as Post | Quote).stats?.mirrors
          ),
          actionCollect: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats?.countOpenActions
              : (obj as Post | Quote).stats?.countOpenActions
          ),
          actionComment: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.stats?.comments
              : (obj as Post | Quote).stats?.comments
          ),
          actionHasLiked: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasReacted
              : (obj as Post | Quote).operations?.hasReacted
          ),
          actionHasMirrored: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasMirrored
              : (obj as Post | Quote).operations?.hasMirrored
          ),
          actionHasCollected: sortedArr.map((obj: Post | Mirror | Quote) =>
            obj.__typename === "Mirror"
              ? obj.mirrorOn.operations?.hasActed?.isFinalisedOnchain
              : (obj as Post | Quote).operations?.hasActed?.isFinalisedOnchain
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const fetchMoreProfile = async () => {
    try {
      if (!profilePageData) {
        setHasMoreProfile(false);
        return;
      }

      const data = await getPublications(
        {
          where: {
            from: [feedProfile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: profilePageData,
        },
        lensProfile?.id
      );

      const sortedArr: (Post | Mirror | Quote)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Mirror | Quote)[];

      if (sortedArr?.length < 10) {
        setHasMoreProfile(false);
      }
      setOpenProfileMirrorChoice([
        ...openProfileMirrorChoice,
        ...Array.from({ length: sortedArr.length }, () => false),
      ]);
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
      dispatch(
        setProfileFeedCount({
          actionLike: [
            ...profileFeedCount.like,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats?.reactions
                : (obj as Post | Quote).stats?.reactions
            ),
          ],
          actionMirror: [
            ...profileFeedCount.mirror,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats?.mirrors
                : (obj as Post | Quote).stats?.mirrors
            ),
          ],
          actionCollect: [
            ...profileFeedCount.collect,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats?.countOpenActions
                : (obj as Post | Quote).stats?.countOpenActions
            ),
          ],
          actionComment: [
            ...profileFeedCount.comment,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.stats?.comments
                : (obj as Post | Quote).stats?.comments
            ),
          ],
          actionHasLiked: [
            ...profileFeedCount.hasLiked,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations?.hasReacted
                : (obj as Post | Quote).operations?.hasReacted
            ),
          ],
          actionHasMirrored: [
            ...profileFeedCount.hasMirrored,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations?.hasMirrored
                : (obj as Post | Quote).operations?.hasMirrored
            ),
          ],
          actionHasCollected: [
            ...profileFeedCount.hasCollected,
            ...sortedArr.map((obj: Post | Mirror | Quote) =>
              obj.__typename === "Mirror"
                ? obj.mirrorOn.operations?.hasActed?.isFinalisedOnchain
                : (obj as Post | Quote).operations?.hasActed?.isFinalisedOnchain
            ),
          ],
        })
      );
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo?.next));
      dispatch(setProfileFeedRedux([...profileDispatch, ...sortedArr]));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router.asPath.includes("#chat") &&
      router.asPath.includes("&profile=") &&
      feedProfile?.id
    ) {
      getProfile();
    } else if (
      router.asPath.includes("#chat") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setProfile(undefined));
    }
  }, [feedProfile?.id, router.asPath]);

  useEffect(() => {
    if (
      postSent &&
      !router.asPath.includes("&post=") &&
      router.asPath.includes("&profile=")
    ) {
      dispatch(setPostSent(false));
      getProfile();
    }
  }, [postSent]);

  const getSingleProfile = async () => {
    try {
      const prof = await getOneProfile(
        {
          forHandle: "lens/" + router.asPath.split("&profile=")[1],
        },
        lensProfile?.id
      );

      if (
        quickProfiles.some((profile) =>
          profile.handle?.suggestedFormatted?.localName?.includes(
            router?.asPath?.split("profile=")[1]
          )
        )
      ) {
        await getProfileCollections(prof?.data?.profile as Profile);
      } else {
        setProfileCollections([]);
      }

      dispatch(setProfile(prof?.data?.profile as Profile));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getProfileCollections = async (prof: Profile) => {
    setProfileCollectionsLoading(true);
    try {
      const colls = await getCollectionsProfile(prof.ownedBy?.address);

      if ((colls?.data?.collectionCreateds || [])?.length < 1 || !colls?.data) {
        setProfileCollectionsLoading(false);
        setProfileCollections([]);
        return;
      }
      setProfileCollections(colls?.data?.collectionCreateds);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileCollectionsLoading(true);
  };

  useEffect(() => {
    if (
      router.asPath.includes("&profile=") &&
      router.asPath.includes("#chat") &&
      quickProfiles?.length > 0
    ) {
      getSingleProfile();
    }
  }, [router.asPath, lensProfile?.id, quickProfiles]);

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
    profileCollectionsLoading,
    profileCollections,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  };
};

export default useProfileFeed;
