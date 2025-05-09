import { useContext, useEffect, useState } from "react";
import {
  getCollectionsDrop,
  getOneCollection,
} from "../../../../../graph/queries/getAllCollections";
import { fetchPost } from "@lens-protocol/client/actions";
import { ModalContext } from "@/app/providers";
import { Collection } from "../../Common/types/common.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const useCollection = (collectionName: string, autograph: string) => {
  const context = useContext(ModalContext);
  const [collectionLoading, setCollectionLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<Collection>();
  const [dropCollections, setDropCollections] = useState<Collection[]>([]);

  const getCollection = async () => {
    setCollectionLoading(true);

    try {
      const allColls = await getOneCollection(collectionName);
      const pub = await fetchPost(context?.clienteLens!, {
        post: allColls?.data?.collectionCreateds[0]?.postId,
      });

      const relatedCollections = await getCollectionsDrop(
        allColls?.data?.collectionCreateds[0]?.dropId
      );

      const colls = await Promise.all(
        relatedCollections?.data?.collectionCreateds
          ?.filter(
            (item: { collectionId: string }) =>
              item?.collectionId !==
              allColls?.data?.collectionCreateds[0]?.collectionId
          )
          ?.map(
            async (item: {
              uri: string;
              metadata: {};
              drop: {
                uri: string;
                metadata: {};
              };
            }) => {
              if (!item?.metadata) {
                const res = await fetch(
                  `${INFURA_GATEWAY}/ipfs/${item?.uri?.split("ipfs://")?.[1]}`
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
                  `${INFURA_GATEWAY}/ipfs/${
                    item?.drop?.uri?.split("ipfs://")?.[1]
                  }`
                );
                const data = await res.json();

                item = {
                  ...item,
                  metadata: {
                    ...data,
                  },
                };
              }

              return item;
            }
          )
      );
   

      setDropCollections(colls);

      let collection = allColls?.data?.collectionCreateds?.[0];

      if (!collection?.metadata) {
        const res = await fetch(
          `${INFURA_GATEWAY}/ipfs/${collection?.uri?.split("ipfs://")?.[1]}`
        );
        const data = await res.json();
        collection = {
          ...collection,
          metadata: {
            ...data,
            mediaTypes: data?.mediaTypes?.[0],
          },
        };
      }

      if (!collection?.metadata) {
        const res = await fetch(
          `${INFURA_GATEWAY}/ipfs/${collection?.drop?.uri?.split("ipfs://")?.[1]}`
        );
        const data = await res.json();
        collection = {
          ...collection,
          drop: {
            ...collection?.drop,
            metadata: data,
          },
        };
      }

      if (pub?.isOk()) {
        setCollection({
          ...collection,
          publication: pub?.value,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCollectionLoading(false);
  };

  useEffect(() => {
    if (autograph && collectionName && !collection && context?.clienteLens) {
      getCollection();
    }
  }, [autograph, collectionName, context?.clienteLens]);

  return {
    collectionLoading,
    dropCollections,
    collection,
  };
};

export default useCollection;
