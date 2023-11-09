import {
  LimitType,
  Mirror,
  Post,
  Profile,
  ProfileQuery,
  PublicationType,
  Quote,
} from "@/components/Home/types/generated";
import {
  getOneProfileAuth,
  getOneProfile,
} from "@/graphql/lens/queries/getProfile";
import {
  getPublications,
  getPublicationsAuth,
} from "@/graphql/lens/queries/getVideos";
import { setProfileFeedCount } from "@/redux/reducers/profileFeedCountSlice";
import { setProfileFeedRedux } from "@/redux/reducers/profileFeedSlice";
import { setProfilePaginated } from "@/redux/reducers/profilePaginatedSlice";
import { setProfileScrollPosRedux } from "@/redux/reducers/profileScrollPosSlice";
import { setProfile } from "@/redux/reducers/profileSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { useAccount } from "wagmi";
import { setPostSent } from "@/redux/reducers/postSentSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDecryptProfileScrollPosRedux } from "@/redux/reducers/decryptProfileScrollPosSlice";
import { setDecryptProfilePaginated } from "@/redux/reducers/decryptProfilePaginatedSlice";
import { setDecryptProfileFeedRedux } from "@/redux/reducers/decryptProfileFeedSlice";
import { setDecryptProfileFeedCount } from "@/redux/reducers/decryptProfileCountSlice";
import { Collection, Drop } from "@/components/Home/types/home.types";
import {
  getCollectionsProfile,
  getCollectionsProfileUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import getAllDrops, {
  getAllDropsUpdated,
} from "@/graphql/subgraph/queries/getAllDrops";
import { decryptPostArray } from "@/lib/helpers/decryptPost";
import { FetchResult } from "@apollo/client";

const useProfileFeed = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { address } = useAccount();
  const profileRef = useRef<InfiniteScroll>(null);
  const scrollRefDecryptProfile = useRef<InfiniteScroll>(null);
  const profileDispatch = useSelector(
    (state: RootState) => state.app.profileFeedReducer.value
  );
  const filterDecrypt = useSelector(
    (state: RootState) => state.app.filterDecryptReducer.value
  );
  const postSent = useSelector(
    (state: RootState) => state.app.postSentReducer.value
  );
  const quickProfiles = useSelector(
    (state: RootState) => state.app.quickProfilesReducer.value
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const profileId = useSelector((state: RootState) => state.app.profileReducer);
  const profilePageData = useSelector(
    (state: RootState) => state.app.profilePaginatedReducer.value
  );
  const profileFeedCount = useSelector(
    (state: RootState) => state.app.profileFeedCountReducer
  );
  const decryptProfilePageData = useSelector(
    (state: RootState) => state.app.decryptProfilePaginatedReducer.value
  );
  const decryptProfileFeedCount = useSelector(
    (state: RootState) => state.app.decryptProfileFeedCountReducer
  );
  const decryptProfileFeed = useSelector(
    (state: RootState) => state.app.decryptProfileFeedReducer.value
  );

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
    let data;
    try {
      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: [profileId?.profile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: [profileId?.profile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
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

      sortedArr = await decryptPostArray(address, sortedArr);

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
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo));
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
    let data;
    try {
      if (!profilePageData?.next) {
        setHasMoreProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: [profileId?.profile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
            ],
          },
          limit: LimitType.Ten,
          cursor: profilePageData?.next,
        });
      } else {
        data = await getPublicationsAuth({
          where: {
            from: [profileId?.profile?.id],
            publicationTypes: [
              PublicationType.Post,
              PublicationType.Mirror,
              PublicationType.Quote,
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

      sortedArr = await decryptPostArray(address, sortedArr);

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
      dispatch(setProfilePaginated(data?.data?.publications?.pageInfo));
      dispatch(setProfileFeedRedux([...profileDispatch, ...sortedArr]));
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
            from: [profileId?.profile?.id],
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
            from: [profileId?.profile?.id],
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

      sortedArr = (await decryptPostArray(address, sortedArr)) as Post[];

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
      dispatch(setDecryptProfilePaginated(data?.data?.publications?.pageInfo));
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
    let data;
    try {
      if (!decryptProfilePageData?.next) {
        setHasMoreDecryptProfile(false);
        return;
      }

      if (!lensProfile) {
        data = await getPublications({
          where: {
            from: [profileId?.profile?.id],
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
            from: [profileId?.profile?.id],
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

      sortedArr = (await decryptPostArray(address, sortedArr)) as Post[];

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
      dispatch(setDecryptProfilePaginated(data?.data?.publications?.pageInfo));
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
      profileId?.profile
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
  }, [profileId.profile, router.asPath, filterDecrypt]);

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
    let prof: FetchResult<ProfileQuery>;
    try {
      if (lensProfile) {
        prof = await getOneProfileAuth({
          forHandle: "lens/" + router.asPath.split("&profile=")[1],
        });
      } else {
        prof = await getOneProfile({
          forHandle: "lens/" + router.asPath.split("&profile=")[1],
        });
      }

      if (
        quickProfiles
          .map((profile) => profile.handle)
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

  const setProfileScroll = (e: MouseEvent) => {
    dispatch(setProfileScrollPosRedux((e.target as HTMLDivElement)?.scrollTop));
  };

  const setScrollPosDecryptProfile = (e: MouseEvent) => {
    dispatch(
      setDecryptProfileScrollPosRedux((e.target as HTMLDivElement)?.scrollTop)
    );
  };

  const getProfileCollections = async (prof: Profile) => {
    setProfileCollectionsLoading(true);
    try {
      const colls = await getCollectionsProfile(prof.ownedBy?.address);
      const collsUpdated = await getCollectionsProfileUpdated(
        prof.ownedBy?.address
      );

      if (
        [
          ...(colls?.data?.collectionMinteds || []),
          ...(collsUpdated?.data?.updatedChromadinCollectionCollectionMinteds ||
            []),
        ]?.length < 1 ||
        !colls?.data
      ) {
        setProfileCollectionsLoading(false);
        setProfileCollections([]);
        return;
      }

      const collections = await Promise.all(
        [
          ...((colls?.data?.collectionMinteds || []).filter(
            (obj: Collection) =>
              obj.collectionId !== "104" && obj.collectionId !== "99"
          ) || []),
          ...((
            collsUpdated?.data?.updatedChromadinCollectionCollectionMinteds ||
            []
          ).filter(
            (obj: Collection) =>
              obj.collectionId !== "4" && obj.collectionId !== "5"
          ) || []),
        ]?.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(
            (collection.uri as any)
              ?.split("ipfs://")[1]
              ?.replace(/"/g, "")
              ?.trim()
          );
          const type = await fetch(
            `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
            { method: "HEAD" }
          ).then((response) => {
            if (response.ok) {
              return response.headers.get("Content-Type");
            }
          });
          return {
            ...collection,
            uri: { ...json, type },
          };
        })
      );

      const drops = await getAllDrops();
      const dataUpdated = await getAllDropsUpdated();

      if (
        [
          ...(drops?.data?.dropCreateds || []),
          ...(dataUpdated?.data?.updatedChromadinDropDropCreateds || []),
        ]?.length > 0
      ) {
        let dataUpdatedDrops = (
          dataUpdated?.data?.updatedChromadinDropDropCreateds || []
        )
          .map((drop: Drop) => {
            return {
              ...drop,
              collectionIds: drop.collectionIds.filter(
                (id: string) => !["4", "5"].includes(id)
              ),
            };
          })
          .filter((drop: Drop) => drop.collectionIds.length > 0);

        let dataDrops = (drops?.data?.dropCreateds || [])
          .map((drop: Drop) => {
            return {
              ...drop,
              collectionIds: drop.collectionIds.filter(
                (id: string) => !["104", "99"].includes(id)
              ),
            };
          })
          .filter((drop: Drop) => drop.collectionIds.length > 0);

        let allDrops = [...dataDrops, ...dataUpdatedDrops];

        const fullDrops = await Promise.all(
          allDrops.map(async (drop: Drop) => {
            const dropjson = await fetchIPFSJSON(
              (drop as any)?.dropURI
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            );

            return {
              ...drop,
              uri: {
                name: dropjson.name,
                image: dropjson.image,
              },
            };
          })
        );

        const validCollections = collections?.filter(
          (collection: Collection) => {
            const collectionDrops = [...fullDrops]?.filter((drop: any) => {
              if (Number(collection?.blockNumber) < 45189643) {
                return (
                  drop.collectionIds?.includes(collection?.collectionId) &&
                  Number(drop.blockNumber) < 45189643
                );
              } else {
                return (
                  drop.collectionIds?.includes(collection?.collectionId) &&
                  Number(drop.blockNumber) >= 45189643
                );
              }
            });

            return collectionDrops.length > 0;
          }
        );

        setProfileCollections(validCollections);
      } else {
        setProfileCollections([]);
      }
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
  }, [router.asPath, lensProfile, quickProfiles]);

  return {
    hasMoreProfile,
    fetchMoreProfile,
    profileRef,
    followerOnlyProfile,
    setCollectProfileLoading,
    setMirrorProfileLoading,
    profileLoading,
    mirrorProfileLoading,
    collectProfileLoading,
    reactProfileLoading,
    setReactProfileLoading,
    setProfileScroll,
    hasMoreDecryptProfile,
    setScrollPosDecryptProfile,
    scrollRefDecryptProfile,
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
