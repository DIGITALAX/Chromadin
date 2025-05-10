import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import lodash from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import { ModalContext } from "@/app/providers";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY_INTERNAL,
  INITIAL_FILTERS,
} from "@/app/lib/constants";
import { Collection, Options, Viewer } from "../../Common/types/common.types";
import useDrop from "../../Common/hooks/useDrop";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { usePathname, useRouter } from "next/navigation";
import WaveformComponent from "./Waveform";
import useSearch from "../hooks/useSearch";
import FilterVending from "./FilterVending";
import SearchVending from "./SearchVending";

const Vending: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const { handleGetMoreCollections, filters, setFilters } = useDrop();
  const {
    dropDownPriceSort,
    setDropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  } = useSearch();

  return (
    <div
      className={`relative w-full overflow-y-scroll gap-3 h-full p-4 flex flex-col mt-0`}
    >
      {context?.collectionInfo?.collectionsLoading &&
      Number(context?.collectionInfo?.collections?.length) < 1 ? (
        <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index: number) => {
            return (
              <div
                className="relative w-full h-fit flex opacity-30 p-2 gap-2"
                key={index}
              >
                <div className="relative w-full h-72 flex flex-col items-center justify-center animate-pulse">
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col items-start justify-center gap-8">
          <div className="relative w-full h-fit flex items-start justify-start flex-col preG:flex-row gap-3">
            <div className="relative w-fit h-fit flex flex-row gap-3">
              <FilterVending
                handleOpenDropdown={setDropDownPriceSort}
                openDropdown={dropDownPriceSort}
                values={filters?.prices}
                selectorValue={filters?.priceSelected}
                filterUpdate={(selected) =>
                  setFilters((prev) => ({
                    ...prev,
                    priceSelected: selected,
                  }))
                }
              />
              <FilterVending
                handleOpenDropdown={setDropDownDateSort}
                openDropdown={dropDownDateSort}
                values={filters?.dates}
                selectorValue={filters?.dateSelected}
                filterUpdate={(selected) =>
                  setFilters((prev) => ({
                    ...prev,
                    dateSelected: selected,
                  }))
                }
              />
            </div>
            <SearchVending
              dict={dict}
              handleSearch={handleSearch}
              searchOpen={searchOpen}
              searchResults={searchResults}
              handleSearchChoose={handleSearchChoose}
            />
          </div>
          {Number(context?.collectionInfo?.collections?.length) > 0 && (
            <InfiniteScroll
              hasMore={context?.collectionInfo?.hasMore!}
              height={"40rem"}
              loader={""}
              dataLength={context?.collectionInfo?.collections?.length!}
              next={handleGetMoreCollections}
              className={`relative w-full h-full overflow-y-scroll flex flex-col overflow-x-hidden`}
            >
              <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
                {lodash(context?.collectionInfo?.collections)
                  ?.filter((collection: Collection) => {
                    if (
                      filters.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ] ===
                      INITIAL_FILTERS.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ]
                    ) {
                      return true;
                    } else {
                      const matchingAddress = lodash
                        .find(
                          ACCEPTED_TOKENS,
                          ([token]) =>
                            token.toLowerCase() ===
                            filters.priceSelected?.[
                              path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as
                                | "es"
                                | "en"
                            ]?.toLowerCase()
                        )?.[1]
                        ?.toLowerCase();
                      return collection.acceptedTokens.includes(
                        matchingAddress!
                      );
                    }
                  })
                  .map((collection: Collection) => {
                    if (
                      filters.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ] ===
                      INITIAL_FILTERS.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ]
                    ) {
                      return collection;
                    } else {
                      return {
                        ...collection,
                        matchingPrice: parseFloat(collection.price),
                      };
                    }
                  })
                  .filter((collection: any) => {
                    if (
                      filters.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ] ===
                      INITIAL_FILTERS.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ]
                    ) {
                      return true;
                    } else {
                      return collection.matchingPrice !== undefined;
                    }
                  })
                  .sortBy((collection: any) => {
                    if (
                      filters.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ] ===
                      INITIAL_FILTERS.priceSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ]
                    ) {
                      return 0;
                    } else {
                      return -collection.matchingPrice;
                    }
                  })
                  .sortBy((collection: any) => {
                    // if (
                    //   filters.priceSelected?.[router.locale as "en" | "es"] ===
                    //   initialFilterState.priceSelected?.[
                    //     router.locale as "en" | "es"
                    //   ]
                    // ) {
                    if (
                      filters.dateSelected?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ] !==
                      INITIAL_FILTERS.dates?.[0]?.[
                        path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                      ]
                    ) {
                      if (
                        filters.dateSelected?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ] ===
                        INITIAL_FILTERS.dates?.[2]?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ]
                      ) {
                        return collection.blockTimestamp;
                      } else if (
                        filters.dateSelected?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ] ===
                        INITIAL_FILTERS.dates?.[1]?.[
                          path.match(/(?<=\/)(en|es)(?=\/)/)?.[0] as "es" | "en"
                        ]
                      ) {
                        return -collection.blockTimestamp;
                      }
                    }
                    // }
                  })
                  .value()
                  ?.map((collection: Collection, index: number) => {
                    return (
                      <div
                        className="relative h-72 w-full flex flex-col p-2 gap-2"
                        key={index}
                      >
                        <div
                          className="relative w-full h-full cursor-pointer rounded-tr-2xl"
                          id={"staticLoad"}
                          onClick={() => {
                            context?.setCollectionInfo((prev) => ({
                              ...prev,
                              main: collection,
                            }));
                            context?.setOptions(Options.Fulfillment);
                            context?.setViewer(Viewer.Collect);
                          }}
                        >
                          {collection?.metadata?.mediaTypes
                            ?.toLowerCase()
                            ?.includes("video") ? (
                            <video
                              playsInline
                              className={`rounded-tr-2xl object-cover h-[12.5rem] w-full`}
                              muted
                              loop
                              id={collection?.metadata?.video}
                              key={collection?.metadata?.video}
                            >
                              <source
                                src={`${INFURA_GATEWAY_INTERNAL}${collection?.metadata?.video
                                  ?.split("ipfs://")[1]
                                  ?.replace(/"/g, "")
                                  ?.trim()}`}
                                type="video/mp4"
                                draggable={false}
                              />
                            </video>
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY_INTERNAL}${collection?.metadata?.images?.[0]
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
                          {collection?.metadata?.video && (
                            <WaveformComponent
                              video={collection?.metadata?.video}
                            />
                          )}
                        </div>
                        <div className="relative flex flex-row w-full h-fit gap-2  text-sm font-arcade">
                          <div className="relative uppercase text-white w-fit h-fit cursor-pointer whitespace-nowrap">
                            {collection?.metadata?.title.length > 20
                              ? collection?.metadata?.title.slice(0, 18) + "..."
                              : collection?.metadata?.title}
                          </div>
                          <div className="flex flex-row relative w-full h-fit gap-1.5 justify-end">
                            <div className="relative w-fit h-fit text-ama justify-end flex">
                              {Number(collection?.amount) -
                                (collection?.tokenIdsMinted?.length
                                  ? collection?.tokenIdsMinted?.length
                                  : 0)}
                            </div>
                            <div
                              className="relative w-2 h-2 text-ama items-center flex cursor-pointer active:scale-95"
                              onClick={() =>
                                router.push(
                                  `/autograph/${
                                    collection?.publication?.author?.username
                                      ?.localName
                                  }/collection/${collection?.metadata?.title
                                    ?.replace(/\s/g, "_")
                                    .toLowerCase()}`
                                )
                              }
                            >
                              <Image
                                layout="fill"
                                src={`${INFURA_GATEWAY_INTERNAL}QmRbgQM3Unc2wYYJStNHP4Y2JvVk3HrP5rnrmCNE1u9cWu`}
                                draggable={false}
                              />
                            </div>
                          </div>
                        </div>
                        <Link
                          className="relative flex flex-row w-fit h-fit gap-3 items-center pt-3 cursor-pointer"
                          href={`/autograph/${collection?.publication?.author?.username?.localName}`}
                        >
                          <div
                            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                            id="crt"
                          >
                            <Image
                              src={handleProfilePicture(
                                collection?.publication?.author?.metadata
                                  ?.picture
                              )}
                              layout="fill"
                              alt="pfp"
                              className="rounded-full w-full h-full flex"
                              draggable={false}
                            />
                          </div>
                          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                            {collection?.publication?.author?.username
                              ?.localName ??
                              collection?.publication?.author?.username?.value}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                <>
                  {context?.collectionInfo?.moreCollectionsLoading &&
                    Array.from({ length: 8 }).map((_, index: number) => {
                      return (
                        <div
                          className="relative w-full h-fit flex opacity-30 p-2 gap-2"
                          key={index}
                        >
                          <div className="relative w-full h-72 flex flex-col items-center animate-pulse justify-center">
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
