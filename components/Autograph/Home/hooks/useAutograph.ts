import useImageUpload from "@/components/Common/NFT/hooks/useImageUpload";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile, ProfileQuery } from "@/components/Home/types/generated";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsProfile,
  getCollectionsProfileUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { getCoinOpCollection } from "@/lib/helpers/getCoinOp";
import { setAutograph } from "@/redux/reducers/autographSlice";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchResult } from "@apollo/client";

const useAutograph = () => {
  const dispatch = useDispatch();
  const { uploadImage } = useImageUpload();
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const allDrops = useSelector(
    (state: RootState) => state.app.dropsReducer.value
  );
  const [autographLoading, setAutographLoading] = useState<boolean>(false);

  const getAllCollections = async (autograph: string) => {
    setAutographLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setAutographLoading(false);
        return;
      }

      const drops = allDrops.filter((dropValue: Drop) => {
        if (
          dropValue?.creator?.toLowerCase() ===
          prof?.ownedBy?.address?.toLowerCase()
        ) {
          return dropValue;
        }
      });

      const allColls = await getCollectionsProfile(prof?.ownedBy?.address);
      const updatedAllColls = await getCollectionsProfileUpdated(
        prof?.ownedBy?.address
      );

      const collections = await Promise.all(
        [
          ...(updatedAllColls?.data
            ?.updatedChromadinCollectionCollectionMinteds || []),
          ...(allColls?.data?.collectionMinteds || []),
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
            },
          };
        })
      );

      const validCollections = collections?.filter((collection: Collection) => {
        const collectionDrops = [...drops]?.filter((drop: any) => {
          if (Number(collection?.blockNumber) < 45189643) {
            return (
              drop.collectionIds?.includes(collection?.collectionId) &&
              Number(drop.blockNumber) < 45189643 &&
              collection?.collectionId !== "104" &&
              collection?.collectionId !== "99"
            );
          } else {
            return (
              drop.collectionIds?.includes(collection?.collectionId) &&
              Number(drop.blockNumber) >= 45189643 &&
              collection.collectionId !== "4" &&
              collection.collectionId !== "5"
            );
          }
        });

        return collectionDrops.length > 0;
      });

      const coinOpCollections = await Promise.all(
        validCollections.map(async (collection: Collection) => {
          const coinOp = await getCoinOpCollection(collection);
          return {
            ...collection,
            coinOp,
          };
        })
      );

      dispatch(
        setAutograph({
          actionDrops: drops,
          actionCollections: coinOpCollections,
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setAutographLoading(false);
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

  const handleShareCollection = async (collection: Collection) => {
    dispatch(setImageLoadingRedux(true));
    try {
      dispatch(
        setMakePost({
          actionValue: true,
          actionQuote: undefined,
        })
      );

      if (!collection?.uri?.image) {
        dispatch(setImageLoadingRedux(false));
        return;
      }
      const response = await fetch(
        `${INFURA_GATEWAY}/ipfs/${collection?.uri?.image?.split("ipfs://")[1]}`
      );
      const blob = await response.blob();
      const file = new File([blob], collection?.uri?.name, {
        type: "image/png",
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
    autographLoading,
    getAllCollections,
    handleShareCollection,
  };
};

export default useAutograph;
