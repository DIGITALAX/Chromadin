import {
  getAllCollectionsPaginated,
  getAllCollectionsPaginatedUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { Collection, Drop } from "../types/home.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { useDispatch, useSelector } from "react-redux";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { RootState } from "@/redux/store";
import { setCollectionsRedux } from "@/redux/reducers/collectionsSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setDropsRedux } from "@/redux/reducers/dropsSlice";
import { setHasMoreCollectionsRedux } from "@/redux/reducers/hasMoreCollectionSlice";
import { setCollectionPaginated } from "@/redux/reducers/collectionPaginatedSlice";
import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import { INFURA_GATEWAY, LENS_CREATORS } from "@/lib/constants";
import getProfiles from "@/graphql/lens/queries/getProfiles";
import { setQuickProfilesRedux } from "@/redux/reducers/quickProfilesSlice";
import { useRouter } from "next/router";
import { Profile } from "../types/generated";
import getAllDrops, {
  getAllDropsUpdated,
} from "@/graphql/subgraph/queries/getAllDrops";
import { getCoinOpCollection } from "@/lib/helpers/getCoinOp";

const useDrop = () => {
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [moreCollectionsLoading, setMoreCollectionsLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();
  const collectionsDispatched = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const paginated = useSelector(
    (state: RootState) => state.app.collectionPaginatedReducer
  );
  const dropsDispatched = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const hasMoreCollections = useSelector(
    (state: RootState) => state.app.hasMoreCollectionReducer.value
  );
  const feedDispatch = useSelector(
    (state: RootState) => state.app.feedReducer.value
  );
  const decryptFeed = useSelector(
    (state: RootState) => state.app.decryptFeedReducer.value
  );
  const router = useRouter();

  const handleAllCollections = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const res = await getAllCollectionsPaginatedUpdated(12, 0);
      let data =
        res?.data?.updatedChromadinCollectionCollectionMinteds.filter(
          (obj: Collection) =>
            obj.collectionId !== "4" && obj.collectionId !== "5"
        ) || [];
      if (!data || data?.length < 12) {
        dispatch(
          setHasMoreCollectionsRedux({
            old: true,
            new: false,
          })
        );
        const res = await getAllCollectionsPaginated(12, 0);
        data = [
          ...data,
          ...((res?.data?.collectionMinteds || []).filter(
            (obj: Collection) =>
              obj.collectionId !== "104" && obj.collectionId !== "99"
          ) || []),
        ];

        if (data?.length < 12) {
          dispatch(
            setHasMoreCollectionsRedux({
              old: false,
              new: false,
            })
          );
        }
      }

      if (!data) {
        setError(true);
        setCollectionsLoading(false);
        return;
      }

      if (data?.length < 1) {
        setCollectionsLoading(false);
        return;
      }

      const drops = await handleAllDrops();
      const fullDrops = await Promise.all(
        drops?.map(async (drop: Drop) => {
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
      dispatch(setDropsRedux(fullDrops));

      const validCollections = [...data].filter((collection: Collection) => {
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
      });

      const collections = await validateDrop(validCollections, fullDrops);

      if (!collections) {
        setError(true);
        setCollectionsLoading(false);
        return;
      }

      const collectionDrops = fullDrops
        ?.filter((drop: any) =>
          drop.collectionIds.includes(
            collections![collections!?.length - 1]?.collectionId
          )
        )
        .sort((a: any, b: any) => b.dropId - a.dropId);
      const coinOpCollections = await Promise.all(
        collections.map(async (collection: Collection) => {
          const coinOp = await getCoinOpCollection(collection);
          return {
            ...collection,
            coinOp,
          };
        })
      );

      dispatch(
        setMainNFT({
          name: coinOpCollections![coinOpCollections!?.length - 1].name,
          media:
            coinOpCollections![coinOpCollections!?.length - 1].uri.image.split(
              "ipfs://"
            )[1],
          audio:
            coinOpCollections![
              coinOpCollections!?.length - 1
            ].uri?.audio?.split("ipfs://")[1] || undefined,
          description:
            coinOpCollections![coinOpCollections!?.length - 1].uri.description,
          type: coinOpCollections![coinOpCollections!?.length - 1].uri.type,
          drop: {
            name: collectionDrops[0]?.uri?.name,
            image: collectionDrops[0]?.uri?.image,
          },
          creator: {
            media:
              coinOpCollections![coinOpCollections!?.length - 1].profile
                ?.metadata?.picture! &&
              createProfilePicture(
                coinOpCollections![coinOpCollections!?.length - 1].profile
                  ?.metadata?.picture
              )!,
            name: coinOpCollections![coinOpCollections!?.length - 1].profile
              ?.handle?.localName!,
          },
          price: coinOpCollections![coinOpCollections!?.length - 1].basePrices,
          acceptedTokens:
            coinOpCollections![coinOpCollections!?.length - 1].acceptedTokens,
          amount: coinOpCollections![coinOpCollections!?.length - 1]?.amount,
          tokenIds: coinOpCollections![coinOpCollections!?.length - 1].tokenIds,
          tokensSold:
            coinOpCollections![coinOpCollections!?.length - 1].soldTokens,
          blockNumber:
            coinOpCollections![coinOpCollections!?.length - 1].blockNumber,
          hasAudio: coinOpCollections![coinOpCollections!?.length - 1].hasAudio,
          coinOp: coinOpCollections![coinOpCollections!?.length - 1]?.coinOp,
        })
      );

      dispatch(setCollectionsRedux(coinOpCollections!));
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleGetMoreCollections = async () => {
    if (
      moreCollectionsLoading ||
      (!hasMoreCollections.old && !hasMoreCollections.new)
    ) {
      return;
    }
    setMoreCollectionsLoading(true);
    try {
      let data;
      if (hasMoreCollections.new) {
        const res = await getAllCollectionsPaginatedUpdated(
          paginated.firstUpdated,
          paginated.skipUpdated
        );
        data =
          res?.data?.updatedChromadinCollectionCollectionMinteds.filter(
            (obj: Collection) =>
              obj.collectionId !== "4" && obj.collectionId !== "5"
          ) || [];
        if (data?.length < 12) {
          const res = await getAllCollectionsPaginated(12, 0);
          data = [
            ...data,
            ...((res?.data?.collectionMinteds || []).filter(
              (obj: Collection) =>
                obj.collectionId !== "104" && obj.collectionId !== "99"
            ) || []),
          ];
          dispatch(
            setHasMoreCollectionsRedux({
              old: true,
              new: false,
            })
          );
          dispatch(
            setCollectionPaginated({
              actionSkip: paginated.skip + 12,
              actionFirst: paginated.first,
              actionSkipUpdated: paginated.skipUpdated,
              actionFirstUpdated: paginated.firstUpdated,
            })
          );
        } else {
          dispatch(
            setHasMoreCollectionsRedux({
              old: true,
              new: true,
            })
          );
          dispatch(
            setCollectionPaginated({
              actionSkip: paginated.skip,
              actionFirst: paginated.first,
              actionSkipUpdated: paginated.skipUpdated + 12,
              actionFirstUpdated: paginated.firstUpdated,
            })
          );
        }
      } else {
        const res = await getAllCollectionsPaginated(
          paginated.first,
          paginated.skip
        );
        data = (res?.data?.collectionMinteds || []).filter(
          (obj: Collection) =>
            obj.collectionId !== "104" && obj.collectionId !== "99"
        );
        if (data?.length < 12) {
          dispatch(
            setHasMoreCollectionsRedux({
              old: false,
              new: false,
            })
          );
          dispatch(
            setCollectionPaginated({
              actionSkip: paginated.skip,
              actionFirst: paginated.first,
              actionSkipUpdated: paginated.skipUpdated,
              actionFirstUpdated: paginated.firstUpdated,
            })
          );
        } else {
          dispatch(
            setHasMoreCollectionsRedux({
              old: true,
              new: false,
            })
          );
          dispatch(
            setCollectionPaginated({
              actionSkip: paginated.skip + 12,
              actionFirst: paginated.first,
              actionSkipUpdated: paginated.skipUpdated,
              actionFirstUpdated: paginated.firstUpdated,
            })
          );
        }
      }

      if (!data) {
        setError(true);
        setMoreCollectionsLoading(false);
        return;
      }

      if (data < 1) {
        setMoreCollectionsLoading(false);
        return;
      }

      const validCollections = data?.filter((collection: Collection) => {
        const collectionDrops = [...dropsDispatched]?.filter((drop: any) =>
          drop?.collectionIds?.includes(collection.collectionId)
        );
        return collectionDrops.length > 0;
      });

      const collections = await validateDrop(validCollections, dropsDispatched);

      if (!collections) {
        setError(true);
        setMoreCollectionsLoading(false);
        return;
      }

      const coinOpCollections = await Promise.all(
        collections.map(async (collection: Collection) => {
          const coinOp = await getCoinOpCollection(collection);
          return {
            ...collection,
            coinOp,
          };
        })
      );

      dispatch(
        setCollectionsRedux([...collectionsDispatched, ...coinOpCollections!])
      );
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setMoreCollectionsLoading(false);
  };

  const handleAllDrops = async (): Promise<any> => {
    try {
      const data = await getAllDrops();
      const dataUpdated = await getAllDropsUpdated();

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

      let dataDrops = (data?.data?.dropCreateds || [])
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

      return allDrops;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const validateDrop = async (
    validCollections: Collection[],
    drops: Drop[]
  ): Promise<Collection[] | undefined> => {
    try {
      return await Promise.all(
        validCollections.map(async (collection: Collection) => {
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

          let collectionDrops;

          collectionDrops = drops
            ?.filter((drop: any) => {
              if (Number(collection?.blockNumber) < 45189643) {
                return (
                  drop.collectionIds?.includes(collection.collectionId) &&
                  Number(drop.blockNumber) < 45189643
                );
              } else {
                return (
                  drop.collectionIds?.includes(collection.collectionId) &&
                  Number(drop.blockNumber) >= 45189643
                );
              }
            })
            ?.sort((a: any, b: any) => b.dropId - a.dropId);

          const defaultProfile = await getDefaultProfile({
            for: collection.owner,
          });

          let hasAudio: boolean = false;

          if (type?.includes("video")) {
            const video = document.createElement("video");
            video.muted = true;
            video.crossOrigin = "anonymous";
            video.preload = "auto";

            const value = new Promise((resolve, reject) => {
              video.addEventListener("error", reject);

              video.addEventListener(
                "canplay",
                () => {
                  video.currentTime = 0.99;
                },
                { once: true }
              );

              video.addEventListener(
                "seeked",
                () =>
                  resolve(
                    (video as any).mozHasAudio ||
                      Boolean((video as any).webkitAudioDecodedByteCount) ||
                      Boolean((video as any).audioTracks?.length)
                  ),
                {
                  once: true,
                }
              );

              video.src = `${INFURA_GATEWAY}/ipfs/${
                json.image?.includes("ipfs://")
                  ? json.image?.split("ipfs://")[1]
                  : json.image
              }`;
            });

            hasAudio = (await value) as boolean;
          }

          return {
            ...collection,
            uri: {
              ...json,
              type,
            },
            profile: defaultProfile?.data?.defaultProfile as Profile,
            drop: {
              name: collectionDrops[0]?.uri?.name,
              image: collectionDrops[0]?.uri?.image,
            },
            hasAudio,
          };
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getQuickProfiles = async () => {
    try {
      const profs = await getProfiles({
        where: {
          profileIds: LENS_CREATORS,
        },
      });
      const quickProfiles = (profs?.data?.profiles?.items as Profile[])?.map(
        (prof: Profile) => {
          return {
            id: prof.id,
            handle: prof.handle?.suggestedFormatted?.localName?.split("@")[1],
            image: createProfilePicture(prof?.metadata?.picture),
            followModule: prof?.followModule,
            name: prof?.handle?.localName,
            ownedBy: prof?.ownedBy?.address,
          };
        }
      );
      dispatch(
        setQuickProfilesRedux(quickProfiles as QuickProfilesInterface[])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router.asPath.includes("#chat") ||
      router.asPath.includes("#collect") ||
      router.asPath.includes("autograph")
    ) {
      if (
        (!feedDispatch || feedDispatch.length < 1) &&
        (decryptFeed.length < 1 || !decryptFeed)
      ) {
        getQuickProfiles();
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      handleAllCollections();
    }
  }, []);

  return {
    collectionsLoading,
    error,
    handleGetMoreCollections,
    moreCollectionsLoading,
  };
};

export default useDrop;
