import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getCollectionsDrop } from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { getDropByName } from "@/graphql/subgraph/queries/getAllDrops";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useAutoDrop = (
  autograph: string,
  dropTitle: string,
  lensProfile: Profile | undefined
) => {
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [dropData, setDropData] = useState<{
    collections: Collection[];
    profile: Profile | undefined;
  }>({
    collections: [],
    profile: undefined,
  });

  const getDrop = async () => {
    setDropLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setDropLoading(false);
        return;
      }

      const drop = await getDropByName(dropTitle, prof?.ownedBy?.address);

      const colls = await getCollectionsDrop(
        drop?.data?.dropCreateds?.[0]?.dropId
      );

      const collections = await Promise.all(
        colls?.data?.collectionCreateds?.map(
          async (item: {
            uri: string;
            dropURI: string;
            collectionMetadata: {};
            dropMetadata: {};
          }) => {
            if (!item?.collectionMetadata) {
              const data = await fetchIPFSJSON(item?.uri);
              item = {
                ...item,
                collectionMetadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!item?.dropMetadata) {
              const data = await fetchIPFSJSON(item?.dropURI);
              item = {
                ...item,
                dropMetadata: {
                  ...data,
                },
              };
            }

            return item;
          }
        )
      );

      setDropData({
        collections,
        profile: prof,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  const getProfile = async (
    autograph: string
  ): Promise<Profile | undefined> => {
    try {
      const prof = await getOneProfile(
        {
          forHandle: "lens/" + (autograph as string),
        },
        lensProfile?.id
      );

      if (!prof?.data) {
        return;
      }

      return prof?.data?.profile as Profile;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (autograph && dropTitle && dropData?.collections?.length < 1) {
      getDrop();
    }
  }, [autograph, dropTitle]);

  return {
    dropLoading,
    dropData,
  };
};

export default useAutoDrop;
