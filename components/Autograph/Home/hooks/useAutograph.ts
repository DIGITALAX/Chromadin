import { Collection, Drop } from "@/components/Home/types/home.types";
import { useEffect, useState } from "react";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";
import { getCollectionsProfile } from "@/graphql/subgraph/queries/getAllCollections";
import { Profile } from "@/components/Home/types/generated";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

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

      const collectionPromises = await Promise.all(
        collections?.data?.collectionCreateds?.map(
          async (item: {
            profileId: string;
            pubId: string;
            collectionMetadata: {};
            dropMetadata: {};
            dropURI: string;
            uri: string;
          }) => {
            const pub = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item?.profileId)
                )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
              },
              lensProfile?.id
            );

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

            return {
              ...item,
              publication: pub?.data?.publication,
            };
          }
        )
      );

      setAutographData({
        drops: collectionPromises?.reduce(
          (
            accumulator: {
              seenDropIds: Set<string>;
              uniqueMetadata: {
                dropDetails: {
                  dropTitle: string;
                  dropCover: string;
                };
              }[];
            },
            item: Collection
          ) => {
            if (item?.dropId && !accumulator.seenDropIds.has(item.dropId)) {
              accumulator.seenDropIds.add(item.dropId);
              accumulator.uniqueMetadata.push({
                dropDetails: item.dropMetadata,
              });
            }
            return accumulator;
          },
          { seenDropIds: new Set(), uniqueMetadata: [] }
        ).uniqueMetadata,
        collections: collectionPromises,
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
