import { FunctionComponent } from "react";
import { DropsProps } from "../types/collections.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { setCollectionInfo } from "@/redux/reducers/collectionInfoSlice";

const Drops: FunctionComponent<DropsProps> = ({
  collectionInfo,
  dispatch,
  collectionsLoading,
  router,
  moreCollectionsLoading,
  currentIndex,
}): JSX.Element => {
  return (
    <div className="relative w-[80%] h-full p-4 flex flex-row gap-4">
      {collectionsLoading || moreCollectionsLoading
        ? Array.from({ length: 7 }).map((_: any, index: number) => {
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                key={index}
              >
                <div
                  className="relative w-full h-full border-white border"
                  id="staticLoad"
                ></div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    TboPcMv^&fN
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    — H!lPn&bQ@f
                  </div>
                </div>
              </div>
            );
          })
        : [
            ...collectionInfo?.collections!?.slice(currentIndex),
            ...collectionInfo?.collections!?.slice(0, currentIndex),
          ]?.map((collection: Collection, index: number) => {
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                key={index}
                onClick={() => {
                  dispatch(
                    setCollectionInfo({
                      actionSkip: collectionInfo?.skip,
                      actionCollections: collectionInfo?.collections,
                      actionHasMore: collectionInfo?.hasMore,
                      actionMain: collection,
                    })
                  );
                  if (router?.asPath?.includes("/autograph")) {
                    router?.replace(
                      `/autograph/${
                        collection?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )[1]
                      }/collection/${collection?.collectionMetadata?.title
                        ?.replaceAll(" ", "_")
                        ?.toLowerCase()}`
                    );
                  } else if (
                    router?.asPath?.includes("#sampler") ||
                    router?.asPath?.includes("#chat")
                  ) {
                    if (router?.asPath?.includes("&post=")) {
                      router.push(
                        "#collect?option=fulfillment" +
                          "&post=" +
                          router?.asPath?.split("&post=")[1]
                      );
                    } else if (router?.asPath?.includes("&profile=")) {
                      router.push(
                        "#collect?option=fulfillment" +
                          "&profile=" +
                          router?.asPath?.split("&profile=")[1]
                      );
                    } else {
                      router.push("#collect?option=fulfillment");
                    }
                  } else {
                    if (router?.asPath?.includes("#")) {
                      if (router?.asPath?.includes("&profile=")) {
                        router?.asPath?.includes("?option=")
                          ? router.push(
                              router?.asPath?.split("?option=")[0] +
                                "?option=fulfillment" +
                                "&profile=" +
                                router?.asPath?.split("&profile=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                "&profile=" +
                                router?.asPath?.split("&profile=")[1]
                            );
                      } else if (router?.asPath?.includes("&post=")) {
                        router?.asPath?.includes("?option=")
                          ? router.push(
                              router?.asPath?.split("?option=")[0] +
                                "?option=fulfillment" +
                                router?.asPath
                                  ?.split("?option=fulfillment")[1]
                                  ?.split("&post=")[0] +
                                "&post=" +
                                router?.asPath?.split("&post=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                router?.asPath
                                  ?.split("?option=fulfillment")[1]
                                  ?.split("&post=")[0] +
                                "&post=" +
                                router?.asPath?.split("&post=")[1]
                            );
                      } else {
                        router?.asPath?.includes("?option=")
                          ? router.push(
                              router?.asPath?.split("?option=")[0] +
                                "?option=fulfillment"
                            )
                          : router.push("?option=fulfillment");
                      }
                    } else {
                      router.push("#stream?option=fulfillment");
                    }
                  }
                }}
              >
                <div
                  className="relative w-full h-full border-white border"
                  id="staticLoad"
                >
                  {collection?.collectionMetadata?.mediaTypes
                    ?.toLowerCase()
                    ?.includes("video") ? (
                    <video
                      playsInline
                      autoPlay
                      className={`w-full h-36 object-cover`}
                      muted
                      loop
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
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.collectionMetadata?.images?.[0]?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      layout="fill"
                      objectFit="cover"
                      objectPosition="top"
                      className="w-full h-full"
                      draggable={false}
                      key={collection?.collectionMetadata?.images?.[0]}
                    />
                  )}
                </div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    {collection?.dropMetadata?.dropTitle?.length > 15
                      ? collection?.dropMetadata?.dropTitle?.slice(0, 15) +
                        "..."
                      : collection?.dropMetadata?.dropTitle}
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    —{" "}
                    {collection?.collectionMetadata?.title?.length > 7
                      ? collection?.collectionMetadata?.title.slice(0, 7) +
                        "..."
                      : collection?.collectionMetadata?.title}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Drops;
