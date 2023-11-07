import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { Collection, VendingProps } from "../types/home.types";
import useDrop from "../hooks/useDrop";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import SearchVending from "@/components/Common/Buttons/SearchVending";
import FilterVending from "@/components/Common/Buttons/FilterVending";
import useViewer from "../hooks/useViewer";
import { setPriceFilter } from "@/redux/reducers/priceFilterSlice";
import { setDateFilter } from "@/redux/reducers/dateFilterSlice";
import lodash from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import WaveformComponent from "./Waveform";

const Vending: FunctionComponent<VendingProps> = ({
  dispatch,
  router,
}): JSX.Element => {
  const {
    collectionsLoading,
    error,
    moreCollectionsLoading,
    handleGetMoreCollections,
  } = useDrop();
  const {
    setDropDownPriceSort,
    dropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
    searchOpen,
    searchResults,
    handleSearchChoose,
  } = useViewer();
  const dispatchCollections = useSelector(
    (state: RootState) => state.app.collectionsReducer.value
  );
  const priceFilter = useSelector(
    (state: RootState) => state.app.priceFilterReducer
  );
  const dateFilter = useSelector(
    (state: RootState) => state.app.dateFilterReducer
  );
  const hasMoreCollections = useSelector(
    (state: RootState) => state.app.hasMoreCollectionReducer.value
  );

  return (
    <div
      className={`relative w-full overflow-y-scroll gap-3 h-[28.6rem] p-4 flex flex-col`}
    >
      {error ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center">
          Unfortunately the subgraph isn&apos;t responding right now :/, tune in
          again soon to browse collections
        </div>
      ) : collectionsLoading ? (
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
                handleOpenDropdown={setDropDownPriceSort}
                openDropdown={dropDownPriceSort}
                values={priceFilter.values}
                setDispatchFilter={setPriceFilter}
                selectorValue={priceFilter.selected}
                dispatch={dispatch}
              />
              <FilterVending
                handleOpenDropdown={setDropDownDateSort}
                openDropdown={dropDownDateSort}
                values={dateFilter.values}
                setDispatchFilter={setDateFilter}
                selectorValue={dateFilter.selected}
                dispatch={dispatch}
              />
            </div>
            {/* <div className="relative w-fit h-full flex items-center justify-center flex-col">
              <div
                className="relative w-fit h-fit items-center justify-center flex cursor-pointer active:scale-95"
                onClick={() => handleShuffle()}
              >
                <CiShuffle color="white" size={15} />
              </div>
            </div> */}
            <SearchVending
              handleSearch={handleSearch}
              searchOpen={searchOpen}
              searchResults={searchResults}
              handleSearchChoose={handleSearchChoose}
            />
          </div>
          <InfiniteScroll
            hasMore={
              hasMoreCollections.new
                ? hasMoreCollections.new
                : hasMoreCollections.old
            }
            height={"40rem"}
            loader={""}
            dataLength={dispatchCollections?.length}
            next={handleGetMoreCollections}
            className={`relative row-start-1 w-full h-full overflow-y-scroll flex flex-col`}
          >
            <div className="relative w-full h-full grid grid-cols-1 preG:grid-cols-2 sm:grid-cols-3 wrap:grid-cols-4">
              {dispatchCollections?.length > 0 &&
                lodash(dispatchCollections)
                  .filter((collection: Collection) => {
                    if (priceFilter.selected === "ALL") {
                      return true;
                    } else {
                      const matchingAddress = lodash
                        .find(
                          ACCEPTED_TOKENS,
                          ([token]) =>
                            token.toLowerCase() ===
                            priceFilter.selected.toLowerCase()
                        )?.[1]
                        ?.toLowerCase();
                      return collection.acceptedTokens.includes(
                        matchingAddress!
                      );
                    }
                  })
                  .map((collection: any) => {
                    if (priceFilter.selected === "ALL") {
                      return collection;
                    } else {
                      const matchingAddress = lodash
                        .find(
                          ACCEPTED_TOKENS,
                          ([token]) =>
                            token.toLowerCase() ===
                            priceFilter.selected.toLowerCase()
                        )?.[1]
                        ?.toLowerCase();
                      const matchingIndex = collection.acceptedTokens.indexOf(
                        matchingAddress!
                      );
                      const matchingPrice = parseFloat(
                        collection.basePrices[matchingIndex]
                      );
                      return { ...collection, matchingPrice };
                    }
                  })
                  .filter((collection: any) => {
                    if (priceFilter.selected === "ALL") {
                      return true;
                    } else {
                      return collection.matchingPrice !== undefined;
                    }
                  })
                  .sortBy((collection: any) => {
                    if (priceFilter.selected === "ALL") {
                      return 0;
                    } else {
                      return -collection.matchingPrice;
                    }
                  })
                  .sortBy((collection: any) => {
                    if (priceFilter.selected === "ALL") {
                      if (dateFilter.selected === "earliest") {
                        return collection.blockTimestamp;
                      } else if (dateFilter.selected === "latest") {
                        return -collection.blockTimestamp;
                      }
                    }
                  })
                  .value()
                  ?.map((collection: Collection, index: number) => {
                    const profilePicture = createProfilePicture(
                      collection?.profile?.metadata?.picture
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
                              setMainNFT({
                                name: collection?.name,
                                media: collection?.uri?.image
                                  ?.split("ipfs://")[1]
                                  ?.replace(/"/g, "")
                                  ?.trim(),
                                audio: collection?.uri?.audio
                                  ?.split("ipfs://")[1]
                                  ?.replace(/"/g, "")
                                  ?.trim(),
                                description: collection?.uri?.description,
                                type: collection?.uri?.type,
                                drop: collection?.drop,
                                creator: {
                                  media: createProfilePicture(
                                    collection.profile?.metadata?.picture
                                  ),
                                  name: collection?.profile?.handle?.localName!,
                                },
                                price: collection?.basePrices,
                                acceptedTokens: collection?.acceptedTokens,
                                amount: collection?.amount,
                                tokenIds: collection?.tokenIds,
                                tokensSold: collection?.soldTokens,
                                blockNumber: collection?.blockNumber,
                                hasAudio: collection?.hasAudio,
                                coinOp: collection?.coinOp,
                              })
                            );
                            router.asPath.includes("&profile=")
                              ? router.asPath.includes("?option=")
                                ? router.push(
                                    router.asPath.split("?option=")[0] +
                                      "?option=fulfillment&profile=" +
                                      router.asPath.split("&profile=")[1]
                                  )
                                : router.push(
                                    router.asPath.split("&profile=")[0] +
                                      "?option=fulfillment&profile=" +
                                      router.asPath.split("&profile=")[1]
                                  )
                              : router.asPath.includes("&post=")
                              ? router.asPath.includes("?option=")
                                ? router.push(
                                    router.asPath.split("?option=")[0] +
                                      "?option=fulfillment&post=" +
                                      router.asPath.split("&post=")[1]
                                  )
                                : router.push(
                                    router.asPath.split("&post=")[0] +
                                      "?option=fulfillment&post=" +
                                      router.asPath.split("&post=")[1]
                                  )
                              : router.asPath.includes("?option=")
                              ? router.push(
                                  router.asPath.split("?option=")[0] +
                                    "?option=fulfillment"
                                )
                              : router.push(
                                  router.asPath + "?option=fulfillment"
                                );
                          }}
                        >
                          {collection.uri.type === "video/mp4" ? (
                            <video
                              playsInline
                              className={`rounded-tr-2xl object-cover h-[12.5rem] w-full`}
                              muted
                              loop
                              id={collection?.uri?.image}
                              key={collection?.uri?.image}
                            >
                              <source
                                src={`${INFURA_GATEWAY}/ipfs/${collection?.uri?.image
                                  .split("ipfs://")[1]
                                  .replace(/"/g, "")
                                  .trim()}`}
                                type="video/mp4"
                                draggable={false}
                              />
                            </video>
                          ) : (
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${collection?.uri?.image
                                .split("ipfs://")[1]
                                .replace(/"/g, "")
                                .trim()}`}
                              alt="vending"
                              layout="fill"
                              className={`rounded-tr-2xl`}
                              objectFit="cover"
                              draggable={false}
                            />
                          )}
                          {collection?.coinOp && (
                            <div
                              className="absolute flex top-2 right-2 w-5 h-5 rounded-full p-px"
                              id="raincode"
                              title="irl fulfillment"
                            >
                              <div className="relative w-full h-full bg-black rounded-full">
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                                  objectFit="cover"
                                  className="rounded-full"
                                  draggable={false}
                                />
                              </div>
                            </div>
                          )}
                          {(collection.uri?.audio || collection?.hasAudio) && (
                            <WaveformComponent
                              audio={collection?.uri?.audio}
                              image={collection?.uri?.image}
                            />
                          )}
                        </div>
                        <div className="relative flex flex-row w-full h-fit gap-2  text-sm font-arcade">
                          <div className="relative uppercase text-white w-fit h-fit cursor-pointer whitespace-nowrap">
                            {collection?.name.length > 20
                              ? collection?.name.slice(0, 18) + "..."
                              : collection?.name}
                          </div>
                          <div className="flex flex-row relative w-full h-fit gap-1.5 justify-end">
                            <div className="relative w-fit h-fit text-ama justify-end flex">
                              {Number(collection?.tokenIds?.length) -
                                (collection?.soldTokens?.length
                                  ? collection?.soldTokens?.length
                                  : 0)}
                            </div>
                            <div
                              className="relative w-2 h-2 text-ama items-center flex cursor-pointer active:scale-95"
                              onClick={() =>
                                router.push(
                                  `/autograph/${
                                    collection?.profile?.handle?.suggestedFormatted?.localName?.split(
                                      "@"
                                    )[1]
                                  }/collection/${collection?.name
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
                            collection.profile?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }`}
                        >
                          <div
                            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
                            id="crt"
                          >
                            {profilePicture && profilePicture !== "" && (
                              <Image
                                src={profilePicture}
                                layout="fill"
                                alt="pfp"
                                className="rounded-full w-full h-full flex"
                                draggable={false}
                              />
                            )}
                          </div>
                          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
                            {
                              collection?.profile?.handle?.suggestedFormatted
                                ?.localName
                            }
                          </div>
                        </Link>
                      </div>
                    );
                  })}
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
            </div>
          </InfiniteScroll>
        </div>
      )}
    </div>
  );
};

export default Vending;
