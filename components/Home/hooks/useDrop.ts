import { getAllCollectionsPaginated } from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { Collection } from "../types/home.types";
import { LENS_CREATORS } from "@/lib/constants";
import getProfiles from "@/graphql/lens/queries/getProfiles";
import { setQuickProfilesRedux } from "@/redux/reducers/quickProfilesSlice";
import { Post, Profile } from "../types/generated";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";
import {
  CollectionInfoState,
  setCollectionInfo,
} from "@/redux/reducers/collectionInfoSlice";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";

const useDrop = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  collectionInfo: CollectionInfoState,
  lensConnected: Profile | undefined
) => {
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [moreCollectionsLoading, setMoreCollectionsLoading] =
    useState<boolean>(false);

  const handleAllCollections = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const res = await getAllCollectionsPaginated(12, 0);
      const data = res?.data?.collectionCreateds || [];

      const collections = await handleCollectionData(
        res?.data?.collectionCreateds
      );

      const sorted = collections?.sort(() => Math.random() - 0.5) || [];

      dispatch(
        setCollectionInfo({
          actionSkip: 12,
          actionCollections: sorted,
          actionHasMore: data?.length < 12 ? false : true,
          actionMain: sorted?.[0],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleGetMoreCollections = async () => {
    if (moreCollectionsLoading || !collectionInfo?.hasMore) {
      return;
    }
    setMoreCollectionsLoading(true);
    try {
      const res = await getAllCollectionsPaginated(12, collectionInfo?.skip);
      const data = res?.data?.collectionCreateds || [];

      const collections = await handleCollectionData(
        res?.data?.collectionCreateds
      );

      dispatch(
        setCollectionInfo({
          actionSkip: collectionInfo?.skip + 12,
          actionCollections: [
            ...collectionInfo?.collections,
            ...(collections?.sort(() => Math.random() - 0.5) || []),
          ],
          actionHasMore: data?.length < 12 ? false : true,
          actionMain: collectionInfo?.main,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreCollectionsLoading(false);
  };

  const handleCollectionData = async (
    validCollections: Collection[]
  ): Promise<Collection[] | undefined> => {
    try {
      return await Promise.all(
        validCollections?.map(async (collection: Collection) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(collection?.profileId)
              )}-${toHexWithLeadingZero(Number(collection?.pubId))}`,
            },
            lensConnected?.id
          );

          if (!collection?.collectionMetadata) {
            const data = await fetchIPFSJSON(collection?.uri);
            collection = {
              ...collection,
              collectionMetadata: {
                ...data,
                mediaTypes: data?.mediaTypes?.[0],
              },
            };
          }

          if (!collection?.dropMetadata) {
            const data = await fetchIPFSJSON(collection?.dropURI);
            collection = {
              ...collection,
              dropMetadata: {
                ...data,
              },
            };
          }

          return {
            ...collection,
            publication: publication?.data?.publication as Post,
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
      dispatch(
        setQuickProfilesRedux(profs?.data?.profiles?.items as Profile[])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      router?.asPath?.includes("#chat") ||
      router?.asPath?.includes("#collect") ||
      router?.asPath?.includes("autograph")
    ) {
      getQuickProfiles();
    }
  }, [router?.asPath, lensConnected?.id]);

  useEffect(() => {
    if (collectionInfo?.collections?.length < 1) {
      handleAllCollections();
    }
  }, []);

  return {
    collectionsLoading,
    handleGetMoreCollections,
    moreCollectionsLoading,
  };
};

export default useDrop;
