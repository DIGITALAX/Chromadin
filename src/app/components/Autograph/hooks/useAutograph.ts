import { useContext, useEffect, useState } from "react";
import { Drop, Collection } from "../../Common/types/common.types";
import { fetchAccount, fetchPost } from "@lens-protocol/client/actions";
import { Account } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import { getCollectionsProfile } from "../../../../../graph/queries/getAllCollections";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";

const useAutograph = (name: string) => {
  const context = useContext(ModalContext);
  const [autographLoading, setAutographLoading] = useState<boolean>(false);
  const [autograph, setAutograph] = useState<{
    drops: Drop[];
    collections: Collection[];
    profile?: Account;
  }>({
    drops: [],
    collections: [],
  });

  const getAllCollections = async () => {
    setAutographLoading(true);
    
    try {
      const prof = await fetchAccount(context?.clienteLens!, {
        address: context?.designerProfiles?.find(
          (prof) =>
            prof?.username?.localName?.toLowerCase() === name?.toLowerCase()
        )?.address!,
      });

      if (prof.isErr()) {
        setAutographLoading(false);
        return;
      }

      const collections = await getCollectionsProfile(prof?.value?.owner);
      const collectionPromises = await Promise.all(
        collections?.data?.collectionCreateds?.map(
          async (item: {
            postId: string;
            metadata: {};
            drop: {
              uri: string;
              metadata: {
                title: string;
                cover: string;
              };
            };

            uri: string;
          }) => {
            let publication;

            const pub = await fetchPost(context?.clienteLens!, {
              post: item?.postId,
            });

            if (pub?.isOk()) {
              publication = pub.value;
            }

            if (!item?.metadata) {
              const res = await fetch(
                `${INFURA_GATEWAY_INTERNAL}${item?.uri?.split("ipfs://")?.[1]}`
              );
              const data = await res.json();
              item = {
                ...item,
                metadata: {
                  ...data,
                  mediaTypes: data?.mediaTypes?.[0],
                },
              };
            }

            if (!item?.drop?.metadata) {
              const res = await fetch(
                `${INFURA_GATEWAY_INTERNAL}${
                  item?.drop?.uri?.split("ipfs://")?.[1]
                }`
              );
              const data = await res.json();
              item = {
                ...item,
                drop: {
                  ...item?.drop,
                  metadata: data,
                },
              };
            }

            return {
              ...item,
              publication,
            };
          }
        )
      );

      setAutograph({
        drops: collectionPromises?.reduce(
          (
            accumulator: {
              seenDropIds: Set<string>;
              uniqueMetadata: {metadata: {
                title: string;
                cover: string;
              }}[];
            },
            item: Collection
          ) => {
            if (
              item?.drop?.dropId &&
              !accumulator.seenDropIds.has(item.drop?.dropId)
            ) {
              accumulator.seenDropIds.add(item.drop?.dropId);
              accumulator.uniqueMetadata.push({
                metadata: item.drop?.metadata
              });
            }
            return accumulator;
          },
          { seenDropIds: new Set(), uniqueMetadata: [] }
        ).uniqueMetadata,
        collections: collectionPromises,
        profile: prof?.value as Account,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setAutographLoading(false);
  };

  useEffect(() => {
    if (
      name &&
      !autograph?.profile &&
      context?.clienteLens &&
      context?.designerProfiles?.find(
        (prof) =>
          prof?.username?.localName?.toLowerCase() === name?.toLowerCase()
      )
    ) {
      getAllCollections();
    }
  }, [name, context?.clienteLens, context?.designerProfiles]);

  return {
    autograph,
    autographLoading,
  };
};

export default useAutograph;
