import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { Collection, VendingProps } from "../types/home.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import SearchVending from "@/components/Common/Buttons/SearchVending";
import FilterVending from "@/components/Common/Buttons/FilterVending";
import lodash from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import WaveformComponent from "./Waveform";
import { setCollectionInfo } from "@/redux/reducers/collectionInfoSlice";
import { setFilter } from "@/redux/reducers/filterSlice";
import handleImageError from "@/lib/helpers/handleImageError";

const Vending: FunctionComponent<VendingProps> = ({
  dispatch,
  router,
  setDropDownPriceSort,
  dropDownPriceSort,
  dropDownDateSort,
  setDropDownDateSort,
  handleSearch,
  searchOpen,
  searchResults,
  handleSearchChoose,
  collectionsLoading,
  moreCollectionsLoading,
  handleGetMoreCollections,
  filters,
  collectionInfo,
  t,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full overflow-y-scroll gap-3 h-[28.6rem] p-4 flex flex-col mt-0`}
    >
      {collectionsLoading || collectionInfo?.collections?.length < 1 ? (
        <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index: number) => {
            return (
              <div
                className="relative w-full h-72 flex flex-col items-center justify-center opacity-30 animate-pulse p-2 gap-2"
                key={index}
              >
                <div
                  className="rounded-tr-2xl w-full h-full"
                  id="staticLoad"
                ></div>
                <div className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3">
                  <div
                    className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                    id="vending"
                  ></div>
                  <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                    @!245%rXmes
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col items-start justify-center gap-8">
          <div className="relative w-full h-fit flex items-start justify-start flex-col preG:flex-row gap-3">
            <div className="relative w-fit h-fit flex flex-row gap-3">
              <FilterVending
                router={router}
                handleOpenDropdown={setDropDownPriceSort}
                openDropdown={dropDownPriceSort}
                values={filters?.priceValues}
                selectorValue={
                  filters?.priceSelected?.[router.locale as "en" | "es"]
                }
                filterUpdate={(selected) =>
                  dispatch(
                    setFilter({
                      actionPriceValues: filters?.priceValues,
                      actionPriceSelected: selected,
                      actionDateValues: filters?.dateValues,
                      actionDateSelected: filters?.dateSelected,
                    })
                  )
                }
              />
              <FilterVending
                handleOpenDropdown={setDropDownDateSort}
                openDropdown={dropDownDateSort}
                values={filters?.dateValues}
                selectorValue={
                  filters?.dateSelected?.[router.locale as "en" | "es"]
                }
                router={router}
                filterUpdate={(selected) =>
                  dispatch(
                    setFilter({
                      actionPriceValues: filters?.priceValues,
                      actionPriceSelected: filters?.priceSelected,
                      actionDateValues: filters?.dateValues,
                      actionDateSelected: selected,
                    })
                  )
                }
              />
            </div>
            <SearchVending
              t={t}
              handleSearch={handleSearch}
              searchOpen={searchOpen}
              searchResults={searchResults}
              handleSearchChoose={handleSearchChoose}
            />
          </div>
          {collectionInfo?.collections?.length > 0 && (
            <InfiniteScroll
              hasMore={collectionInfo?.hasMore}
              height={"40rem"}
              loader={""}
              dataLength={collectionInfo?.collections?.length}
              next={handleGetMoreCollections}
              className={`relative w-full h-full overflow-y-scroll flex flex-col overflow-x-hidden`}
            >
              <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
                {lodash(collectionInfo?.collections)
                  ?.filter((collection: Collection) => {
                    if (
                      filters.priceSelected?.[router.locale as "en" | "es"] ===
                      "ALL"
                    ) {
                      return true;
                    } else {
                      const matchingAddress = lodash
                        .find(
                          ACCEPTED_TOKENS,
                          ([token]) =>
                            token.toLowerCase() ===
                            filters.priceSelected?.[
                              router.locale as "en" | "es"
                            ].toLowerCase()
                        )?.[1]
                        ?.toLowerCase();
                      return collection.acceptedTokens.includes(
                        matchingAddress!
                      );
                    }
                  })
                  .map((collection: Collection) => {
                    if (
                      filters.priceSelected?.[router.locale as "en" | "es"] ===
                      "ALL"
                    ) {
                      return collection;
                    } else {
                      const matchingAddress = lodash
                        .find(
                          ACCEPTED_TOKENS,
                          ([token]) =>
                            token.toLowerCase() ===
                            filters.priceSelected?.[
                              router.locale as "en" | "es"
                            ].toLowerCase()
                        )?.[1]
                        ?.toLowerCase();
                      const matchingIndex = collection.acceptedTokens.indexOf(
                        matchingAddress!
                      );
                      const matchingPrice = parseFloat(
                        collection.prices[matchingIndex]
                      );
                      return { ...collection, matchingPrice };
                    }
                  })
                  .filter((collection: any) => {
                    if (
                      filters.priceSelected?.[router.locale as "en" | "es"] ===
                      "ALL"
                    ) {
                      return true;
                    } else {
                      return collection.matchingPrice !== undefined;
                    }
                  })
                  .sortBy((collection: any) => {
                    if (
                      filters.priceSelected?.[router.locale as "en" | "es"] ===
                      "ALL"
                    ) {
                      return 0;
                    } else {
                      return -collection.matchingPrice;
                    }
                  })
                  .sortBy((collection: any) => {
                    if (
                      filters.priceSelected?.[router.locale as "en" | "es"] ===
                      "ALL"
                    ) {
                      if (
                        filters.dateSelected?.[router.locale as "en" | "es"] !==
                        "random"
                      ) {
                        if (
                          filters.dateSelected?.[
                            router.locale as "en" | "es"
                          ] === "earliest"
                        ) {
                          return collection.blockTimestamp;
                        } else if (
                          filters.dateSelected?.[
                            router.locale as "en" | "es"
                          ] === "latest"
                        ) {
                          return -collection.blockTimestamp;
                        }
                      }
                    }
                  })
                  .value()
                  ?.map((collection: Collection, index: number) => {
                    const profilePicture = createProfilePicture(
                      collection?.publication?.by?.metadata?.picture
                    );

                    return (
                      <div
                        className="relative h-72 w-full flex flex-col p-2 gap-2"
                        key={index}
                      >
                        <div
                          className="relative w-full h-full cursor-pointer rounded-tr-2xl"
                          id={"staticLoad"}
                          onClick={() => {
                            dispatch(
                              setCollectionInfo({
                                actionSkip: collectionInfo?.skip,
                                actionCollections: collectionInfo?.collections,
                                actionHasMore: collectionInfo?.hasMore,
                                actionMain: collection,
                              })
                            );
                            router?.asPath?.includes("&profile=")
                              ? router?.asPath?.includes("?option=")
                                ? router.push(
                                    router?.asPath.split("?option=")[0] +
                                      "?option=fulfillment&profile=" +
                                      router?.asPath.split("&profile=")[1]
                                  )
                                : router.push(
                                    router?.asPath.split("&profile=")[0] +
                                      "?option=fulfillment&profile=" +
                                      router?.asPath.split("&profile=")[1]
                                  )
                              : router?.asPath?.includes("&post=")
                              ? router?.asPath?.includes("?option=")
                                ? router.push(
                                    router?.asPath.split("?option=")[0] +
                                      "?option=fulfillment&post=" +
                                      router?.asPath.split("&post=")[1]
                                  )
                                : router.push(
                                    router?.asPath.split("&post=")[0] +
                                      "?option=fulfillment&post=" +
                                      router?.asPath.split("&post=")[1]
                                  )
                              : router?.asPath?.includes("?option=")
                              ? router.push(
                                  router?.asPath.split("?option=")[0] +
                                    "?option=fulfillment"
                                )
                              : router.push(
                                  router?.asPath + "?option=fulfillment"
                                );
                          }}
                        >
                          {collection.collectionMetadata.mediaTypes
                            ?.toLowerCase()
                            ?.includes("video") ? (
                            <video
                              playsInline
                              className={`rounded-tr-2xl object-cover h-[12.5rem] w-full`}
                              muted
                              loop
                              id={collection?.collectionMetadata?.video}
                              key={collection?.collectionMetadata?.video}
                            >
                              <source
                                src={`${INFURA_GATEWAY}/ipfs/${collection?.collectionMetadata?.video
                                  ?.split("ipfs://")[1]
                                  ?.replace(/"/g, "")
                                  ?.trim()}`}
                                type="video/mp4"
                                draggable={false}
                              />
                            </video>
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${collection?.collectionMetadata?.images?.[0]
                                ?.split("ipfs://")[1]
                                ?.replace(/"/g, "")
                                ?.trim()}`}
                              alt="vending"
                              layout="fill"
                              className={`rounded-tr-2xl`}
                              objectFit="cover"
                              draggable={false}
                            />
                          )}
                          {collection?.collectionMetadata?.video && (
                            <WaveformComponent
                              video={collection?.collectionMetadata?.video}
                            />
                          )}
                        </div>
                        <div className="relative flex flex-row w-full h-fit gap-2  text-sm font-arcade">
                          <div className="relative uppercase text-white w-fit h-fit cursor-pointer whitespace-nowrap">
                            {collection?.collectionMetadata?.title.length > 20
                              ? collection?.collectionMetadata?.title.slice(
                                  0,
                                  18
                                ) + "..."
                              : collection?.collectionMetadata?.title}
                          </div>
                          <div className="flex flex-row relative w-full h-fit gap-1.5 justify-end">
                            <div className="relative w-fit h-fit text-ama justify-end flex">
                              {Number(collection?.amount) -
                                (collection?.soldTokens?.length
                                  ? collection?.soldTokens?.length
                                  : 0)}
                            </div>
                            <div
                              className="relative w-2 h-2 text-ama items-center flex cursor-pointer active:scale-95"
                              onClick={() =>
                                router.push(
                                  `/autograph/${
                                    collection?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                                      "@"
                                    )[1]
                                  }/collection/${collection?.collectionMetadata?.title
                                    ?.replace(/\s/g, "_")
                                    .toLowerCase()}`
                                )
                              }
                            >
                              <Image
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/QmRbgQM3Unc2wYYJStNHP4Y2JvVk3HrP5rnrmCNE1u9cWu`}
                                draggable={false}
                              />
                            </div>
                          </div>
                        </div>
                        <Link
                          className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                          href={`/autograph/${
                            collection?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }`}
                        >
                          <div
                            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                            id="crt"
                          >
                            {profilePicture && (
                              <Image
                                src={profilePicture}
                                layout="fill"
                                onError={(e) => handleImageError(e)}
                                alt="pfp"
                                className="rounded-full w-full h-full flex"
                                draggable={false}
                              />
                            )}
                          </div>
                          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                            {
                              collection?.publication?.by?.handle
                                ?.suggestedFormatted?.localName
                            }
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                <>
                  {" "}
                  {moreCollectionsLoading &&
                    Array.from({ length: 8 }).map((_, index: number) => {
                      return (
                        <div
                          className="relative w-full h-[12.5rem] flex flex-col items-center justify-center opacity-30 animate-pulse p-2 gap-2"
                          key={index}
                        >
                          <div
                            className="rounded-tr-2xl w-full h-full"
                            id="staticLoad"
                          ></div>
                          <div className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3">
                            <div
                              className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                              id="vending"
                            ></div>
                            <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                              @!245%rXmes
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </>
              </div>
            </InfiniteScroll>
          )}
        </div>
      )}
    </div>
  );
};

export default Vending;
