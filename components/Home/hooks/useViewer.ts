import { setOptions } from "@/redux/reducers/optionsSlice";
import { setView } from "@/redux/reducers/viewSlice";
import { FormEvent, useEffect, useState } from "react";
import { Collection, Drop } from "../types/home.types";
import {
  getCollectionsSearch,
  getCollectionsSearchUpdated,
} from "@/graphql/subgraph/queries/getAllCollections";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { QuickProfilesInterface } from "@/components/Common/Wavs/types/wavs.types";
import getDefaultProfile from "@/graphql/lens/queries/getDefaultProfile";
import { INFURA_GATEWAY } from "@/lib/constants";
import { NextRouter } from "next/router";
import { AnyAction, Dispatch } from "redux";

const useViewer = (
  router: NextRouter,
  dispatch: Dispatch<AnyAction>,
  quickProfiles: QuickProfilesInterface[],
  dropsDispatched: Drop[]
) => {
  const [dropDownPriceSort, setDropDownPriceSort] = useState<boolean>(false);
  const [dropDownDateSort, setDropDownDateSort] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<
    (Collection | QuickProfilesInterface | Drop)[]
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
      const updatedData = await getCollectionsSearchUpdated(
        (e.target as HTMLFormElement).value
      );

      const collectionsMatched = await Promise.all(
        [
          ...((
            updatedData?.data?.updatedChromadinCollectionCollectionMinteds || []
          ).filter(
            (obj: Collection) =>
              obj.collectionId !== "4" && obj.collectionId !== "5"
          ) || []),
          ...((data?.data?.collectionMinteds || []).filter(
            (obj: Collection) =>
              obj.collectionId !== "104" && obj.collectionId !== "99"
          ) || []),
        ].map(async (collection: any) => {
          const json = await fetchIPFSJSON((collection as any)?.uri);
          const type = await fetch(
            `${INFURA_GATEWAY}/ipfs/${json.image?.split("ipfs://")[1]}`,
            { method: "HEAD" }
          ).then((response) => {
            if (response.ok) {
              return response.headers.get("Content-Type");
            }
          });
          return {
            ...collection,
            uri: {
              ...json,
              type,
            },
          };
        })
      );

      const dropsMatch = dropsDispatched.filter((drop: Drop) => {
        if (
          drop.uri.name
            ?.toLowerCase()
            ?.includes((e.target as HTMLFormElement).value.toLowerCase())
        ) {
          return drop;
        }
      });
      const profilesMatch = quickProfiles.filter(
        (profile: QuickProfilesInterface) => {
          if (
            profile?.handle
              ?.toLowerCase()
              .includes((e.target as HTMLFormElement).value.toLowerCase()) ||
            profile?.name
              ?.toLowerCase()
              .includes((e.target as HTMLFormElement).value.toLowerCase())
          ) {
            return profile;
          }
        }
      );

      setSearchResults([
        ...collectionsMatched,
        ...dropsMatch,
        ...profilesMatch,
      ]);
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
    chosen: QuickProfilesInterface | Drop | Collection
  ): Promise<void> => {
    setSearchOpen(false);
    if ((chosen as Collection)?.acceptedTokens?.length > 0) {
      const defaultProfile = await getDefaultProfile({
        for: (chosen as Collection).owner,
      });
      router.push(
        `/autograph/${
          defaultProfile?.data?.defaultProfile?.handle?.suggestedFormatted?.localName?.split(
            "@"
          )[1]
        }/collection/${(chosen as Collection)?.uri?.name
          ?.replace(/\s/g, "_")
          .toLowerCase()}`
      );
    } else if ((chosen as QuickProfilesInterface)?.handle) {
      const defaultProfile = await getDefaultProfile({
        for: (chosen as QuickProfilesInterface).ownedBy,
      });
      router.push(
        `/autograph/${
          defaultProfile?.data?.defaultProfile?.handle?.suggestedFormatted?.localName?.split(
            "@"
          )[1]
        }`
      );
    } else {
      const defaultProfile = await getDefaultProfile({
        for: (chosen as Drop).creator,
      });
      router.push(
        `/autograph/${
          defaultProfile?.data?.defaultProfile?.handle?.suggestedFormatted?.localName?.split(
            "@"
          )[1]
        }/drop/${(chosen as Drop).uri.name?.replace(/\s/g, "_").toLowerCase()}`
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
