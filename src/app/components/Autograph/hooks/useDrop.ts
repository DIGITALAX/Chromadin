import { useContext, useEffect, useState } from "react";
import { Account } from "@lens-protocol/client";
import { Collection } from "../../Common/types/common.types";
import { ModalContext } from "@/app/providers";
import { fetchAccount } from "@lens-protocol/client/actions";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { getCollectionsDrop } from "../../../../../graph/queries/getAllCollections";
import { getDropByName } from "../../../../../graph/queries/getAllDrops";

const useDrop = (drop: string, autograph: string) => {
  const context = useContext(ModalContext);
  const [dropLoading, setDropLoading] = useState<boolean>(false);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [profile, setProfile] = useState<Account>();

  const getDrop = async () => {
    setDropLoading(true);

    try {
      const prof = await fetchAccount(context?.clienteLens!, {
        username: {
          localName: autograph,
        },
      });
      if (prof.isErr()) {
        setDropLoading(false);
        return;
      }

      const res = await getDropByName(drop, prof?.value?.owner);

      const colls = await getCollectionsDrop(
        res?.data?.dropCreateds?.[0]?.dropId
      );

      const collections = await Promise.all(
        colls?.data?.collectionCreateds?.map(
          async (item: {
            uri: string;
            drop: { uri: string; metadata: {} };
            metadata: {};
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

      setCollections(collections);
      setProfile(prof?.value as Account);
    } catch (err: any) {
      console.error(err.message);
    }
    setDropLoading(false);
  };

  useEffect(() => {
    if (autograph && drop && context?.clienteLens && collections?.length < 1) {
      getDrop();
    }
  }, [drop, autograph, context?.clienteLens]);

  return {
    dropLoading,
    collections,
    profile,
  };
};

export default useDrop;
