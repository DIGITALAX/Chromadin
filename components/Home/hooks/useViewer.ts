import { setOptions } from "@/redux/reducers/optionsSlice";
import { setView } from "@/redux/reducers/viewSlice";
import { FormEvent, useEffect, useState } from "react";
import { Collection, Drop } from "../types/home.types";
import { getCollectionsSearch } from "@/graphql/subgraph/queries/getAllCollections";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";
import toHexWithLeadingZero from "@/lib/helpers/leadingZero";
import { Profile } from "../types/generated";
import { getOneProfile } from "@/graphql/lens/queries/getProfile";

const useViewer = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  quickProfiles: Profile[],
  profile: Profile | undefined
) => {
  const [dropDownPriceSort, setDropDownPriceSort] = useState<boolean>(false);
  const [dropDownDateSort, setDropDownDateSort] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    (Collection | Profile | Drop)[]
  >([]);

  const handleSearch = async (e: FormEvent) => {
    if (
      (e.target as HTMLFormElement).value.trim() === "" ||
      !(e.target as HTMLFormElement).value
    ) {
      setSearchOpen(false);
      return;
    }
    setSearchOpen(true);

    try {
      const data = await getCollectionsSearch(
        (e.target as HTMLFormElement).value
      );

      const profilesMatch = quickProfiles.filter((profile: Profile) => {
        if (
          profile?.handle?.suggestedFormatted?.localName
            ?.toLowerCase()
            .includes((e.target as HTMLFormElement).value.toLowerCase())
        ) {
          return profile;
        }
      });

      const collections = await Promise.all(
        data?.data?.collectionCreateds?.map(
          async (collection: { profileId: string; pubId: string }) => {
            const publication = await getOneProfile(
              {
                forProfileId: `${toHexWithLeadingZero(
                  Number(collection?.profileId)
                )}`,
              },
              profile?.id
            );

            return {
              ...collection,
              profile: publication?.data?.profile,
            };
          }
        )
      );

      setSearchResults(
        [
          ...(collections || []),
          ...collections?.reduce(
            (
              accumulator: {
                seenDropIds: Set<string>;
                uniqueMetadata: {
                  dropDetails: { dropTitle: string; dropCover: string };
                  profile: Profile;
                }[];
              },
              item: Collection
            ) => {
              if (item?.dropId && !accumulator.seenDropIds.has(item.dropId)) {
                accumulator.seenDropIds.add(item.dropId);
                accumulator.uniqueMetadata.push({
                  dropDetails: item.dropMetadata,
                  profile: item.profile,
                });
              }
              return accumulator;
            },
            { seenDropIds: new Set(), uniqueMetadata: [] }
          ).uniqueMetadata,
          ...profilesMatch,
        ]?.sort(() => Math.random() - 0.5)
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (router.asPath.includes("#")) {
      dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
      if (router.asPath.includes("&profile=")) {
        dispatch(
          setOptions(
            router.asPath
              .split("#")[1]
              .split("?option=")[1]
              ?.split("&profile=")[0]
          )
        );
      } else if (router.asPath.includes("&post=")) {
        dispatch(
          setOptions(
            router.asPath.split("#")[1].split("?option=")[1]?.split("&post=")[0]
          )
        );
      } else {
        dispatch(setOptions(router.asPath.split("#")[1].split("?option=")[1]));
      }
    }
  }, [router.asPath]);

  const handleSearchChoose = async (
    chosen: Profile | Drop | Collection
  ): Promise<void> => {
    setSearchOpen(false);
    if ((chosen as Collection)?.acceptedTokens?.length > 0) {
      router.push(
        `/autograph/${
          (
            chosen as Collection
          )?.profile?.handle?.suggestedFormatted?.localName?.split("@")[1]
        }/collection/${(chosen as Collection)?.collectionMetadata?.title
          ?.replace(/\s/g, "_")
          .toLowerCase()}`
      );
    } else if ((chosen as Profile)?.handle) {
      router.push(
        `/autograph/${
          (chosen as Profile)?.handle?.suggestedFormatted?.localName?.split(
            "@"
          )[1]
        }`
      );
    } else {
      router.push(
        `/autograph/${
          (
            chosen as Collection
          )?.profile?.handle?.suggestedFormatted?.localName?.split("@")[1]
        }/drop/${(chosen as Drop)?.dropDetails?.dropTitle
          ?.replace(/\s/g, "_")
          .toLowerCase()}`
      );
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

export default useViewer;
