import {
  LimitType,
  Mirror,
  Post,
  Profile,
  ProfileQuery,
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
import { MouseEvent, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import { setDecryptProfilePaginated } from "@/redux/reducers/decryptProfilePaginatedSlice";
import { setDecryptProfileFeedRedux } from "@/redux/reducers/decryptProfileFeedSlice";
import {
  DecryptProfileFeedCountState,
  setDecryptProfileFeedCount,
} from "@/redux/reducers/decryptProfileCountSlice";
import { Collection } from "@/components/Home/types/home.types";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { decryptPostArray } from "@/lib/helpers/decryptPost";
import { FetchResult } from "@apollo/client";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";

const useProfileFeed = (
  router: NextRouter,
  address: `0x${string}` | undefined,
  dispatch: Dispatch<AnyAction>,
  profileDispatch: (Post | Quote | Mirror)[],
  filterDecrypt: boolean,
  postSent: boolean,
  quickProfiles: Profile[],
  lensProfile: Profile | undefined,
  feedProfile: Profile | undefined,
  profilePageData: string | undefined,
  profileFeedCount: ProfileFeedCountState,
  decryptProfilePageData: string | undefined,
  decryptProfileFeedCount: DecryptProfileFeedCountState,
  decryptProfileFeed: Post[]
) => {
  const [hasMoreProfile, setHasMoreProfile] = useState<boolean>(true);
  const [openProfileMirrorChoice, setOpenProfileMirrorChoice] = useState<
    boolean[]
  >([]);
  const [followerOnlyProfile, setFollowerOnlyProfile] = useState<boolean[]>(
    Array.from({ length: 10 }, () => false)
  );
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

      const arr: (Post | Mirror | Quote)[] = [
        ...data?.data?.publications?.items,
      ] as (Post | Mirror | Quote)[];
      let sortedArr = arr.sort(
        (a: Post | Mirror | Quote, b: Post | Mirror | Quote) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      sortedArr = await decryptPostArray(address, sortedArr, clientWallet);

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

      const arr: (Post | Mirror | Quote)[] = [
        ...(data?.data?.publications?.items || []),
      ] as (Post | Mirror | Quote)[];
      let sortedArr = arr.sort(
        (a: Post | Mirror | Quote, b: Post | Mirror | Quote) =>
          Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      sortedArr = await decryptPostArray(address, sortedArr, clientWallet);

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

  const getProfileDecrypt = async () => {
    setDecryptProfileLoading(true);

    try {
      const data = await getPublications(
        {
          where: {
            from: [feedProfile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
        },
        lensProfile?.id
      );

      if (!data || !data?.data || !data?.data?.publications) {
        setDecryptProfileLoading(false);
        return;
      }

      const arr: Post[] = [...data?.data?.publications?.items] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      sortedArr = (await decryptPostArray(
        address,
        sortedArr,
        clientWallet
      )) as Post[];

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
      dispatch(
        setDecryptProfilePaginated(data?.data?.publications?.pageInfo?.next)
      );
      dispatch(setDecryptProfileFeedRedux(sortedArr));
      dispatch(
        setDecryptProfileFeedCount({
          actionLike: sortedArr.map((obj: Post) => obj.stats?.reactions),
          actionMirror: sortedArr.map((obj: Post) => obj.stats?.mirrors),
          actionCollect: sortedArr.map(
            (obj: Post) => obj.stats?.countOpenActions
          ),
          actionComment: sortedArr.map((obj: Post) => obj.stats?.comments),
          actionHasLiked: sortedArr.map(
            (obj: Post) => obj.operations?.hasReacted
          ),
          actionHasMirrored: sortedArr.map(
            (obj: Post) => obj.operations?.hasMirrored
          ),
          actionHasCollected: sortedArr.map(
            (obj: Post) => obj.operations?.hasActed?.isFinalisedOnchain
          ),
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDecryptProfileLoading(false);
  };

  const fetchMoreProfileDecrypt = async () => {
    try {
      if (!decryptProfilePageData) {
        setHasMoreDecryptProfile(false);
        return;
      }

      const data = await getPublications(
        {
          where: {
            from: [feedProfile?.id],
            publicationTypes: [PublicationType.Post],
            metadata: {
              tags: {
                all: ["encrypted", "chromadin", "labyrinth"],
              },
            },
          },
          limit: LimitType.Ten,
          cursor: decryptProfilePageData,
        },
        lensProfile?.id
      );

      const arr: Post[] = [
        ...(data?.data?.publications?.items || []),
      ] as Post[];
      let sortedArr = arr.sort(
        (a: Post, b: Post) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      sortedArr = (await decryptPostArray(
        address,
        sortedArr,
        clientWallet
      )) as Post[];

      if (sortedArr?.length < 10) {
        setHasMoreDecryptProfile(false);
      }

      dispatch(
        setDecryptProfileFeedCount({
          actionLike: [
            ...decryptProfileFeedCount.like,
            ...sortedArr.map((obj: Post) => obj.stats.reactions),
          ],
          actionMirror: [
            ...decryptProfileFeedCount.mirror,
            ...sortedArr.map((obj: Post) => obj.stats.mirrors),
          ],
          actionCollect: [
            ...decryptProfileFeedCount.collect,
            ...sortedArr.map((obj: Post) => obj.stats.countOpenActions),
          ],
          actionComment: [
            ...decryptProfileFeedCount.comment,
            ...sortedArr.map((obj: Post) => obj.stats.comments),
          ],
          actionHasLiked: [
            ...decryptProfileFeedCount.hasLiked,
            ...sortedArr.map((obj: Post) => obj.operations.hasReacted),
          ],
          actionHasMirrored: [
            ...decryptProfileFeedCount.hasMirrored,
            ...sortedArr.map((obj: Post) => obj.operations.hasMirrored),
          ],
          actionHasCollected: [
            ...decryptProfileFeedCount.hasCollected,
            ...sortedArr.map(
              (obj: Post) => obj.operations.hasActed?.isFinalisedOnchain
            ),
          ],
        })
      );
      setFollowerOnlyProfileDecrypt([
        ...followerOnlyProfileDecrypt,
        ...sortedArr.map((obj: Post) =>
          obj.referenceModule?.type === "FollowerOnlyReferenceModule"
            ? true
            : false
        ),
      ]);
      dispatch(
        setDecryptProfilePaginated(data?.data?.publications?.pageInfo?.next)
      );
      dispatch(
        setDecryptProfileFeedRedux([...decryptProfileFeed, ...sortedArr])
      );
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
      if (filterDecrypt) {
        getProfileDecrypt();
      } else {
        getProfile();
      }
    } else if (
      router.asPath.includes("#chat") &&
      !router.asPath.includes("&profile=")
    ) {
      dispatch(setProfile(undefined));
    }
  }, [feedProfile?.id, router.asPath, filterDecrypt]);

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
        quickProfiles
          .map((profile) => profile.handle?.suggestedFormatted?.localName)
          .includes(router?.asPath?.split("profile=")[1])
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
    hasMoreDecryptProfile,
    followerOnlyProfileDecrypt,
    fetchMoreProfileDecrypt,
    decryptProfileLoading,
    profileCollectionsLoading,
    profileCollections,
    openProfileMirrorChoice,
    setOpenProfileMirrorChoice,
  };
};

export default useProfileFeed;
