import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getCollectionsDrop } from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { getDropByName } from "@/graphql/subgraph/queries/getAllDrops";

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

      setDropData({
        collections: colls?.data?.collectionCreateds,
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
