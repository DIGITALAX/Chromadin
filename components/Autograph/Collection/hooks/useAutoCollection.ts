import { Collection } from "@/components/Home/types/home.types";
import { Profile } from "@/components/Home/types/generated";
import {
  getCollectionsDrop,
  getOneCollection,
} from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";

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
      const allColls = await getOneCollection(collectionName);
      const pub = await getPublication(
        {
          forId: `${toHexWithLeadingZero(
            Number(allColls?.data?.collectionCreateds[0]?.profileId)
          )}-${toHexWithLeadingZero(
            Number(allColls?.data?.collectionCreateds[0]?.pubId)
          )}`,
        },
        profile?.id
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
        ...allColls?.data?.collectionCreateds?.[0],
        publication: pub?.data?.publication,
        profile: pub?.data?.publication?.by,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
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
