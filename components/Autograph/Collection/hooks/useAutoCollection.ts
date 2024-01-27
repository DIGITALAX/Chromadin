import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import {
  getCollectionsDrop,
  getOneCollection,
} from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";

const useAutoCollection = (
  profile: Profile | undefined,
  autograph: string,
  collectionName: string
) => {
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<Collection>();
  const [otherCollectionsDrop, setOtherCollectionsDrop] = useState<
    Collection[]
  >([]);

  const getCollection = async () => {
    setCollectionLoading(true);

    try {
      const prof = await getProfile(autograph);
      if (!prof) {
        setCollectionLoading(false);
        return;
      }
      const allColls = await getOneCollection(
        collectionName,
        prof?.ownedBy?.address
      );
      const relatedCollections = await getCollectionsDrop(
        allColls?.data?.collectionCreateds[0]?.dropId
      );

      setOtherCollectionsDrop(
        relatedCollections?.data?.collectionCreateds?.filter(
          (item: { collectionId: string }) =>
            item?.collectionId !==
            allColls?.data?.collectionCreateds[0]?.collectionId
        )
      );

      setCollection({
        ...allColls?.data?.collectionCreateds[0],
        profile: prof,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
  };

  const getProfile = async (
    autograph: string
  ): Promise<Profile | undefined> => {
    try {
      const prof = await getOneProfile(
        {
          forHandle: "lens/" + (autograph as string),
        },
        profile?.id
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
    if (autograph && collectionName && !collection) {
      getCollection();
    }
  }, [autograph, collectionName]);

  return {
    collectionLoading,
    otherCollectionsDrop,
    collection,
  };
};

export default useAutoCollection;
