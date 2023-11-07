import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile, ProfileQuery } from "@/components/Home/types/generated";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsDecrypt,
  getCollectionsDecryptUpdated,
  getCollectionsProfile,
  getCollectionsProfileUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { getCoinOpCollection } from "@/lib/helpers/getCoinOp";
import { setAutoCollection } from "@/redux/reducers/autoCollectionSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { setNftScreen } from "@/redux/reducers/nftScreenSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchResult } from "@apollo/client";

const useAutoCollection = () => {
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const viewNFTScreen = useSelector(
    (state: RootState) => state.app.nftScreenReducer.value
  );
  const actionCollection = useSelector(
    (state: RootState) => state.app.autoCollectionReducer.collection
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [otherCollectionsDrop, setOtherCollectionsDrop] = useState<
    Collection[]
  >([]);

  const getCollection = async (autograph: string, collection: string) => {
    setCollectionLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setCollectionLoading(false);
        return;
      }

      const colls = await getCollectionsDecrypt(
        collection?.replaceAll("_", " ") as string,
        prof?.ownedBy?.address
      );
      const collsUpdated = await getCollectionsDecryptUpdated(
        collection?.replaceAll("_", " ") as string,
        prof?.ownedBy?.address
      );

      const coll = await Promise.all(
        [
          ...(collsUpdated?.data?.updatedChromadinCollectionCollectionMinteds ||
            []),
          ...(colls?.data?.collectionMinteds || []),
        ].map(async (collection: Collection) => {
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

          const collectionDrops = allDrops
            ?.filter((drop: Drop) => {
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

          return {
            ...collection,
            uri: {
              ...json,
              type,
            },
            drop: {
              name: collectionDrops[0]?.uri?.name,
              image: collectionDrops[0]?.uri?.image,
              collectionIds: collectionDrops[0]?.collectionIds,
            },
            hasAudio,
          };
        })
      );

      const allColls = await getCollectionsProfile(prof?.ownedBy?.address);
      const allCollsUpdated = await getCollectionsProfileUpdated(
        prof?.ownedBy?.address
      );
      const filteredColls = [
        ...((
          allCollsUpdated?.data?.updatedChromadinCollectionCollectionMinteds ||
          []
        ).filter(
          (obj: Collection) =>
            obj.collectionId !== "5" && obj.collectionId !== "4"
        ) || []),
        ...((allColls?.data?.collectionMinteds || []).filter(
          (obj: Collection) =>
            obj.collectionId !== "104" && obj.collectionId !== "99"
        ) || []),
      ]?.filter((collectionValue: Collection) => {
        return (
          coll.some((obj) =>
            obj.drop?.collectionIds?.includes(collectionValue?.collectionId)
          ) &&
          collectionValue?.name?.toLowerCase() !==
            collection?.replace("_", " ")?.toLowerCase()
        );
      });

      const otherDrops = await Promise.all(
        filteredColls?.map(async (collection: Collection | null) => {
          const json = await fetchIPFSJSON(
            (collection?.uri as any)
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

          const currentBlockNumber = Number(collection?.blockNumber);
          const referenceBlockNumber = Number(filteredColls[0]?.blockNumber);

          if (
            (referenceBlockNumber < 45189643 &&
              currentBlockNumber < 45189643) ||
            (referenceBlockNumber >= 45189643 && currentBlockNumber >= 45189643)
          ) {
            return {
              ...collection!,
              uri: {
                ...json,
                type,
              },
            };
          }

          return null;
        })
      ).then((results) => results.filter((item) => item !== null));

      const coinOpCollections = await Promise.all(
        coll.map(async (collection: Collection) => {
          const coinOp = await getCoinOpCollection(collection);
          if (!coinOp) dispatch(setNftScreen(true));
          return {
            ...collection,
            coinOp,
          };
        })
      );

      setOtherCollectionsDrop(otherDrops as any);
      dispatch(
        setAutoCollection({
          actionCollection: coinOpCollections[0],
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
  };

  const getProfile = async (
    autograph: string
  ): Promise<Profile | undefined> => {
    try {
      let prof: FetchResult<ProfileQuery>;
      if (lensProfile) {
        prof = await getOneProfileAuth({
          forHandle: "lens/" + (autograph as string),
        });
      } else {
        prof = await getOneProfile({
          forHandle: "lens/" + (autograph as string),
        });
      }

      if (!prof?.data) {
        return;
      }

      return prof?.data?.profile as Profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleShareCollection = async () => {
    dispatch(setImageLoadingRedux(true));
    try {
      dispatch(
        setMakePost({
          actionValue: true,
          actionQuote: undefined,
        })
      );

      if (!actionCollection?.uri?.image) {
        dispatch(setImageLoadingRedux(false));
        return;
      }
      const response = await fetch(
        `${INFURA_GATEWAY}/ipfs/${
          viewNFTScreen
            ? actionCollection?.uri?.image?.split("ipfs://")[1]
            : actionCollection?.coinOp?.uri?.image?.[imageIndex]?.split(
                "ipfs://"
              )[1]
        }`
      );
      const blob = await response.blob();
      const file = new File([blob], actionCollection?.uri?.name, {
        type: viewNFTScreen ? actionCollection?.uri.type : "image/png",
        lastModified: Date.now(),
      });

      if (file) {
        await uploadImage([file], true);
        dispatch(setImageLoadingRedux(false));
      } else {
        dispatch(setImageLoadingRedux(false));
      }
    } catch (err: any) {
      dispatch(setImageLoadingRedux(false));
      console.error(err.message);
    }
  };

  return {
    collectionLoading,
    getCollection,
    otherCollectionsDrop,
    handleShareCollection,
    imageIndex,
    setImageIndex,
  };
};

export default useAutoCollection;
