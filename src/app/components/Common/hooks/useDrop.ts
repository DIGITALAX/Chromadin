import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { Collection, Filter } from "../types/common.types";
import { fetchAccountsBulk, fetchPost } from "@lens-protocol/client/actions";
import { INITIAL_FILTERS, LENS_CREATORS } from "@/app/lib/constants";
import { usePathname } from "next/navigation";
import { getAllCollectionsPaginated } from "../../../../../graph/queries/getAllCollections";

const useDrop = () => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const [filters, setFilters] = useState<Filter>(INITIAL_FILTERS);

  const handleAllCollections = async (): Promise<void> => {
    context?.setCollectionInfo((prev) => ({
      ...prev,
      collectionsLoading: true,
    }));
    try {
      const res = await getAllCollectionsPaginated(12, 0);

      const data = res?.data?.collectionCreateds || [];

      const collections = (await Promise.all(
        res?.data?.collectionCreateds?.map(async (collection: Collection) => {
          let pub;
          if (collection?.postId) {
            const publication = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: collection?.postId,
              }
            );

            if (publication?.isOk()) {
              pub = publication.value;
            }
          }

          return {
            ...collection,
            publication: pub,
          };
        })
      )) as Collection[];

      const sorted = collections?.sort(() => Math.random() - 0.5) || [];

      context?.setCollectionInfo((prev) => ({
        ...prev,
        skip: 12,
        hasMore: data?.length < 12 ? false : true,
        main: sorted?.[0],
        collections: sorted,
        collectionsLoading: false,
      }));
    } catch (err: any) {
      context?.setCollectionInfo((prev) => ({
        ...prev,
        collectionsLoading: false,
      }));
      console.error(err.message);
    }
  };

  const handleGetMoreCollections = async () => {
    if (
      context?.collectionInfo?.moreCollectionsLoading ||
      !context?.collectionInfo?.hasMore ||
      !context?.clienteLens
    ) {
      return;
    }
    context?.setCollectionInfo((prev) => ({
      ...prev,
      moreCollectionsLoading: true,
    }));
    try {
      const res = await getAllCollectionsPaginated(
        12,
        context?.collectionInfo?.skip
      );
      const data = res?.data?.collectionCreateds || [];

      const collections = (await Promise.all(
        res?.data?.collectionCreateds?.map(async (collection: Collection) => {
          let pub;
          if (collection?.postId) {
            const publication = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: collection?.postId,
              }
            );

            if (publication?.isOk()) {
              pub = publication.value;
            }
          }

          return {
            ...collection,
            publication: pub,
          };
        })
      )) as Collection[];

      context?.setCollectionInfo((prev) => ({
        ...prev,
        collections: [
          ...prev?.collections,
          ...(collections?.sort(() => Math.random() - 0.5) || []),
        ],
        skip: prev.skip + 12,
        hasMore: data?.length < 12 ? false : true,
        moreCollectionsLoading: false,
      }));
    } catch (err: any) {
      context?.setCollectionInfo((prev) => ({
        ...prev,
        moreCollectionsLoading: false,
      }));
      console.error(err.message);
    }
  };

  const getQuickProfiles = async () => {
    try {
      const profs = await fetchAccountsBulk(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          addresses: LENS_CREATORS,
        }
      );
      if (profs.isOk()) {
        context?.setDesignerProfiles(profs.value);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (Number(context?.designerProfiles?.length) < 1 && context?.clienteLens) {
      getQuickProfiles();
    }
  }, [path, context?.clienteLens]);

  useEffect(() => {
    if (
      Number(context?.collectionInfo?.collections?.length) < 1 &&
      context?.clienteLens
    ) {
      handleAllCollections();
    }
  }, [context?.clienteLens]);

  return {
    handleGetMoreCollections,
    filters,
    setFilters,
  };
};

export default useDrop;
