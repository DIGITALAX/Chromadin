import { Collection, Drop } from "@/components/Home/types/home.types";
import { useEffect, useState } from "react";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { Profile } from "@/components/Home/types/generated";

const useAutograph = (autograph: string, lensProfile: Profile | undefined) => {
  const [autographLoading, setAutographLoading] = useState<boolean>(false);
  const [autographData, setAutographData] = useState<{
    drops: Drop[];
    collections: Collection[];
    profile: Profile | undefined;
  }>({
    drops: [],
    collections: [],
    profile: undefined,
  });

  const getAllCollections = async () => {
    setAutographLoading(true);

    try {
      const prof = await getOneProfile(
        {
          forHandle: "lens/" + (autograph as string),
        },
        lensProfile?.id
      );
      if (!prof) {
        setAutographLoading(false);
        return;
      }

      const collections = await getCollectionsProfile(
        prof?.data?.profile?.ownedBy?.address
      );

      setAutographData({
        drops: collections?.data?.collectionCreateds?.reduce(
          (
            accumulator: {
              seenDropIds: Set<string>;
              uniqueMetadata: {
                dropTitle: string;
                dropCover: string;
              }[];
            },
            item: Collection
          ) => {
            if (item?.dropId && !accumulator.seenDropIds.has(item.dropId)) {
              accumulator.seenDropIds.add(item.dropId);
              accumulator.uniqueMetadata.push(item.dropMetadata);
            }
            return accumulator;
          },
          { seenDropIds: new Set(), uniqueMetadata: [] }
        ).uniqueMetadata,
        collections: collections?.data?.collectionCreateds,
        profile: prof?.data?.profile as Profile,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setAutographLoading(false);
  };

  useEffect(() => {
    if (autograph && !autographData?.profile) {
      getAllCollections();
    }
  }, [autograph]);

  return {
    autographLoading,
    autographData,
  };
};

export default useAutograph;
