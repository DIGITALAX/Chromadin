import { FormEvent, useContext, useState } from "react";
import { ModalContext } from "@/app/providers";
import { Collection, Drop } from "../../Common/types/common.types";
import { Account } from "@lens-protocol/client";
import { useRouter } from "next/navigation";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { getCollectionsSearch } from "../../../../../graph/queries/getAllCollections";
import { fetchPost } from "@lens-protocol/client/actions";

const useSearch = () => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const [dropDownPriceSort, setDropDownPriceSort] = useState<boolean>(false);
  const [dropDownDateSort, setDropDownDateSort] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    (Collection | Account | Drop)[]
  >([]);

  const handleSearch = async (e: FormEvent) => {
    const searchValue = (e.target as HTMLFormElement).value;

    if (!searchValue || searchValue.trim() === "") {
      setSearchOpen(false);
      setSearchResults([]);
      return;
    }
    setSearchOpen(true);

    const trimmedSearch = searchValue.trim();

    try {
      const data = await getCollectionsSearch(trimmedSearch);

      const profilesMatch = context?.collectionInfo?.collections
        ?.map((col) => col?.publication?.author)
        ?.filter((profile: Account) => {
          if (
            profile?.username?.localName
              ?.toLowerCase()
              .includes(trimmedSearch.toLowerCase())
          ) {
            return profile;
          }
        });

      const collections = await Promise.all(
        data?.data?.collectionCreateds?.map(
          async (collection: {
            postId: string;
            uri: string;
            drop: {
              uri: string;
              metadata: {};
            };
            metadata: {};
          }) => {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: collection?.postId,
              }
            );

            let publication;

            if (data?.isOk()) {
              publication = data?.value;
            }

            if (!collection?.metadata) {
              const json = await fetch(
                `${INFURA_GATEWAY}/ipfs/${
                  collection?.uri?.split("ipfs://")?.[1]
                }`
              );
              const metadataData = await json.json();

              collection = {
                ...collection,
                metadata: {
                  ...metadataData,
                  mediaTypes: metadataData?.mediaTypes?.[0],
                },
              };
            }

            if (!collection?.drop?.metadata) {
              const json = await fetch(
                `${INFURA_GATEWAY}/ipfs/${
                  collection?.drop?.uri?.split("ipfs://")?.[1]
                }`
              );
              const dropData = await json.json();
              collection = {
                ...collection,
                drop: {
                  ...collection?.drop,
                  metadata: dropData,
                },
              };
            }

            return {
              ...collection,
              publication,
            };
          }
        )
      );

      const uniqueDrops = collections?.reduce(
        (
          accumulator: {
            seenDropIds: Set<string>;
            uniqueMetadata: {
              metadata: { title: string; cover: string };
              profile: Account;
            }[];
          },
          item: Collection
        ) => {
          if (
            item?.drop?.dropId &&
            !accumulator.seenDropIds.has(item?.drop?.dropId)
          ) {
            accumulator.seenDropIds.add(item?.drop?.dropId);
            accumulator.uniqueMetadata.push({
              metadata: item.drop?.metadata,
              profile: item.publication?.author,
            });
          }
          return accumulator;
        },
        { seenDropIds: new Set(), uniqueMetadata: [] }
      ).uniqueMetadata;

      const finalResults = [
        ...(collections || []),
        ...uniqueDrops,
        ...((profilesMatch || []) as Account[]),
      ]?.sort(() => Math.random() - 0.5);

      setSearchResults(finalResults);
    } catch (err: any) {
      console.error(err.message);
      setSearchOpen(false);
    }
  };

  const handleSearchChoose = async (
    chosen: Account | Drop | Collection
  ): Promise<void> => {
    setSearchOpen(false);

    if ((chosen as Collection)?.acceptedTokens?.length > 0) {
      const collectionUrl = `/autograph/${
        (chosen as Collection)?.publication?.author?.username?.localName
      }/collection/${(chosen as Collection)?.metadata?.title
        ?.replace(/\s/g, "_")
        .toLowerCase()}`;
      router.push(collectionUrl);
    } else if ((chosen as Account)?.username) {
      const profileUrl = `/autograph/${(chosen as Account)?.username?.localName}`;
      router.push(profileUrl);
    } else {
      const authorUsername = (chosen as any)?.profile?.username?.localName ||
                            (chosen as Collection)?.publication?.author?.username?.localName;

      const dropUrl = `/autograph/${authorUsername}/drop/${(chosen as Drop)?.metadata?.title
        ?.replace(/\s/g, "_")
        .toLowerCase()}`;
      router.push(dropUrl);
    }
  };

  return {
    dropDownPriceSort,
    setDropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  };
};

export default useSearch;
