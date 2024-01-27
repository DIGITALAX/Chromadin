import { getAllCollectionsPaginated } from "@/graphql/subgraph/queries/getAllCollections";
import { useEffect, useState } from "react";
import { Collection } from "../types/home.types";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { setCollectionsRedux } from "@/redux/reducers/collectionsSlice";
import { setHasMoreCollectionsRedux } from "@/redux/reducers/hasMoreCollectionSlice";
import { setCollectionPaginated } from "@/redux/reducers/collectionPaginatedSlice";
import { LENS_CREATORS } from "@/lib/constants";
import getProfiles from "@/graphql/lens/queries/getProfiles";
import { setQuickProfilesRedux } from "@/redux/reducers/quickProfilesSlice";
import { Post, Profile } from "../types/generated";
import { AnyAction, Dispatch } from "redux";
import { NextRouter } from "next/router";
import { getPublication } from "@/graphql/lens/queries/getPublication";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";

const useDrop = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  collectionsDispatched: Collection[],
  paginated: {
    skip: number;
    first: number;
  },
  hasMoreCollections: boolean,
  quickProfiles: Profile[],
  lensConnected: Profile | undefined
) => {
  const [collectionsLoading, setCollectionsLoading] = useState<boolean>(false);
  const [moreCollectionsLoading, setMoreCollectionsLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleAllCollections = async (): Promise<void> => {
    setCollectionsLoading(true);
    try {
      const res = await getAllCollectionsPaginated(12, 0);
      const data = res?.data?.collectionCreateds || [];

      if (data?.length < 12) {
        dispatch(setHasMoreCollectionsRedux(false));
      }

      const collections = await handleCollectionData(
        res?.data?.collectionCreateds
      );

      dispatch(
        setMainNFT({
          title:
            collections![collections!?.length - 1].collectionMetadata?.title,
          image:
            collections![
              collections!?.length - 1
            ].collectionMetadata?.images?.[0]?.split("ipfs://")[1],
          mediaCover:
            collections![
              collections!?.length - 1
            ].collectionMetadata?.mediaCover?.split("ipfs://")[1],
          video:
            collections![
              collections!?.length - 1
            ].collectionMetadata?.video?.split("ipfs://")[1],
          audio:
            collections![
              collections!?.length - 1
            ].collectionMetadata?.video?.split("ipfs://")[1],
          description:
            collections![collections!?.length - 1].collectionMetadata
              ?.description,
          type: collections![collections!?.length - 1].collectionMetadata
            .mediaTypes?.[0],
          drop: {
            dropTitle:
              collections![collections!?.length - 1].dropMetadata?.dropTitle,
            dropCover:
              collections![collections!?.length - 1].dropMetadata?.dropCover,
          },
          publication: collections![collections!?.length - 1].publication,
          prices: collections![collections!?.length - 1].prices,
          acceptedTokens: collections![collections!?.length - 1].acceptedTokens,
          amount: collections![collections!?.length - 1]?.amount,
          soldTokens: collections![collections!?.length - 1].soldTokens,
        })
      );

      dispatch(
        setCollectionsRedux(
          collections?.sort(() => Math.random() - 0.5) as Collection[]
        )
      );
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setCollectionsLoading(false);
  };

  const handleGetMoreCollections = async () => {
    if (moreCollectionsLoading || !hasMoreCollections) {
      return;
    }
    setMoreCollectionsLoading(true);
    try {
      const res = await getAllCollectionsPaginated(
        paginated.first,
        paginated.skip
      );
      const data = res?.data?.collectionCreateds || [];
      if (data?.length < 12) {
        dispatch(setHasMoreCollectionsRedux(false));
      } else {
        dispatch(setHasMoreCollectionsRedux(true));
        dispatch(
          setCollectionPaginated({
            actionSkip: paginated.skip + 12,
            actionFirst: paginated.first,
          })
        );
      }

      const collections = await handleCollectionData(
        res?.data?.collectionCreateds
      );

      dispatch(
        setCollectionsRedux([
          ...collectionsDispatched,
          ...(collections?.sort(() => Math.random() - 0.5) || []),
        ])
      );
    } catch (err: any) {
      setError(true);
      console.error(err.message);
    }
    setMoreCollectionsLoading(false);
  };

  const handleCollectionData = async (
    validCollections: Collection[]
  ): Promise<Collection[] | undefined> => {
    try {
      return await Promise.all(
        validCollections.map(async (collection: Collection) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(collection?.profileId)
              )}-${toHexWithLeadingZero(Number(collection?.pubId))}`,
            },
            lensConnected?.id
          );

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
      router.asPath.includes("#chat") ||
      router.asPath.includes("#collect") ||
      router.asPath.includes("autograph")
    ) {
      if (quickProfiles?.length < 1) {
        getQuickProfiles();
      }
    }
  }, [router.asPath]);

  useEffect(() => {
    if (!collectionsDispatched || collectionsDispatched?.length < 1) {
      handleAllCollections();
    }
  }, []);

  return {
    collectionsLoading,
    error,
    handleGetMoreCollections,
    moreCollectionsLoading,
  };
};

export default useDrop;
