import { Collection, Drop } from "@/components/Home/types/home.types";
import { Profile, ProfileQuery } from "@/components/Home/types/generated";
import {
  getOneProfile,
  getOneProfileAuth,
} from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsDrop,
  getCollectionsDropUpdated,
  getCollectionsProfile,
  getCollectionsProfileUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import { INFURA_GATEWAY } from "@/lib/constants";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setAutoDrop } from "@/redux/reducers/autoDropSlice";
import { Dispatch, useState } from "react";
import { FetchResult } from "@apollo/client";
import { AnyAction } from "redux";

const useAutoDrop = (
  dispatch: Dispatch<AnyAction>,
  profile: Profile | undefined,
  allDrops: Drop[]
) => {
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [otherDrops, setOtherDrops] = useState<Collection[]>([]);

  const getDrop = async (autograph: string, drop: string) => {
    setDropLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setDropLoading(false);
        return;
      }

      const dropPromises = allDrops.filter((dropValue: Drop) => {
        if (
          dropValue?.uri?.name?.toLowerCase() ===
            (drop?.replaceAll("_", " ")?.toLowerCase() as string) &&
          dropValue?.creator?.toLowerCase() ===
            prof?.ownedBy?.address?.toLowerCase()
        ) {
          return dropValue;
        }
      });

      const filteredDrops = (await Promise.all(dropPromises)).filter(Boolean);

      let colls: Collection[] = [];

      for (let i = 0; i < filteredDrops[0]?.collectionIds?.length; i++) {
        if (Number(filteredDrops[0]?.blockNumber) >= 45189643) {
          const col = await getCollectionsDropUpdated(
            filteredDrops[0]?.collectionIds[i]
          );
          colls.push(col?.data?.updatedChromadinCollectionCollectionMinteds[0]);
        } else {
          const col = await getCollectionsDrop(
            filteredDrops[0]?.collectionIds[i]
          );
          colls.push(col?.data?.collectionMinteds[0]);
        }
      }

      const coll = await Promise.all(
        colls.map(async (collection: Collection) => {
          const json = await fetchIPFSJSON(collection.uri as any);

          const type = await fetch(
            `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
            { method: "HEAD" }
          ).then((response) => {
            if (response.ok) {
              return response.headers.get("Content-Type");
            }
          });

          const collectionDrops = allDrops
            ?.filter((drop: Drop) =>
              drop.collectionIds?.includes(collection.collectionId)
            )
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
          };
        })
      );

      const allColls = await getCollectionsProfile(prof?.ownedBy?.address);
      const allCollsUpdated = await getCollectionsProfileUpdated(
        prof?.ownedBy?.address
      );
      const filteredCollsPromises = [
        ...((
          allCollsUpdated?.data?.updatedChromadinCollectionCollectionMinteds ||
          []
        ).filter(
          (obj: Collection) =>
            obj.collectionId !== "4" && obj.collectionId !== "5"
        ) || []),
        ...((allColls?.data?.collectionMinteds || []).filter(
          (obj: Collection) =>
            obj.collectionId !== "104" && obj.collectionId !== "99"
        ) || []),
      ]?.map(async (collection: Collection) => {
        if (!coll[0]?.drop?.collectionIds?.includes(collection?.collectionId)) {
          return collection;
        }
        return null;
      });

      const filteredColls = (await Promise.all(filteredCollsPromises)).filter(
        Boolean
      );

      const otherDrops = await Promise.all(
        filteredColls?.map(async (collection: Collection | null) => {
          const json = await fetchIPFSJSON(collection?.uri as any);

          const type = await fetch(
            `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
            { method: "HEAD" }
          ).then((response) => {
            if (response.ok) {
              return response.headers.get("Content-Type");
            }
          });

          return {
            ...collection!,
            uri: {
              ...json,
              type,
            },
          };
        })
      );

      setOtherDrops(otherDrops);

      dispatch(
        setAutoDrop({
          actionDrop: filteredDrops[0],
          actionCollection: coll,
          actionProfile: prof,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  const getProfile = async (
    autograph: string
  ): Promise<Profile | undefined> => {
    try {
      let prof: FetchResult<ProfileQuery>;
      if (profile?.id) {
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

  return {
    dropLoading,
    getDrop,
    otherDrops,
  };
};

export default useAutoDrop;
