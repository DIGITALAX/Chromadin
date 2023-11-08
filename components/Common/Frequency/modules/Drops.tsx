import { FunctionComponent } from "react";
import { DropsProps } from "../types/collections.types";
import { setMainNFT } from "@/redux/reducers/mainNFTSlice";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const Drops: FunctionComponent<DropsProps> = ({
  collections,
  dispatch,
  collectionsLoading,
  router,
  moreCollectionsLoading,
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
        : collections?.map((collection: Collection, index: number) => {
            const profileImage = createProfilePicture(
              collection?.profile?.metadata?.picture
            );
            return (
              <div
                className="relative w-60 h-40 flex flex-col items-center shrink-0 cursor-pointer"
                key={index}
                onClick={() => {
                  dispatch(
                    setMainNFT({
                      name: collection?.name,
                      media: collection?.uri?.image?.split("ipfs://")[1],
                      audio:
                        collection?.uri?.audio?.split("ipfs://")[1] ||
                        undefined,
                      description: collection?.uri?.description,
                      type: collection?.uri?.type,
                      drop: collection?.drop,
                      creator: {
                        media: profileImage!,
                        name: collection?.profile?.handle?.localName?.split(
                          "@"
                        )[1]!,
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
                  if (router.asPath.includes("/autograph")) {
                    router.replace(
                      `/autograph/${
                        collection?.profile?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )[1]
                      }/collection/${collection?.name
                        ?.replaceAll(" ", "_")
                        ?.toLowerCase()}`
                    );
                  } else if (
                    router.asPath.includes("#sampler") ||
                    router.asPath.includes("#chat")
                  ) {
                    if (router.asPath?.includes("&post=")) {
                      router.push(
                        "#collect?option=fulfillment" +
                          "&post=" +
                          router.asPath?.split("&post=")[1]
                      );
                    } else if (router.asPath?.includes("&profile=")) {
                      router.push(
                        "#collect?option=fulfillment" +
                          "&profile=" +
                          router.asPath?.split("&profile=")[1]
                      );
                    } else {
                      router.push("#collect?option=fulfillment");
                    }
                  } else {
                    if (router.asPath.includes("#")) {
                      if (router.asPath.includes("&profile=")) {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath?.split("?option=")[0] +
                                "?option=fulfillment" +
                                "&profile=" +
                                router.asPath?.split("&profile=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                "&profile=" +
                                router.asPath?.split("&profile=")[1]
                            );
                      } else if (router.asPath.includes("&post=")) {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath?.split("?option=")[0] +
                                "?option=fulfillment" +
                                router.asPath
                                  ?.split("?option=fulfillment")[1]
                                  ?.split("&post=")[0] +
                                "&post=" +
                                router.asPath?.split("&post=")[1]
                            )
                          : router.push(
                              "?option=fulfillment" +
                                router.asPath
                                  ?.split("?option=fulfillment")[1]
                                  ?.split("&post=")[0] +
                                "&post=" +
                                router.asPath?.split("&post=")[1]
                            );
                      } else {
                        router.asPath.includes("?option=")
                          ? router.push(
                              router.asPath?.split("?option=")[0] +
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
                  {collection?.uri?.image &&
                    (collection.uri.type === "video/mp4" ? (
                      <video
                        playsInline
                        autoPlay
                        className={`w-full h-36 object-cover`}
                        muted
                        loop
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
                        src={`${INFURA_GATEWAY}/ipfs/${
                          collection.uri.image.split("ipfs://")[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        objectPosition="top"
                        className="w-full h-full"
                        draggable={false}
                        key={collection?.uri?.image}
                      />
                    ))}
                </div>
                <div className="relative w-full h-fit flex flex-row items-center gap-2">
                  <div className="rounded-full bg-verde h-2 w-2"></div>
                  <div className="relative w-fit h-fit font-geom text-xs text-verde whitespace-nowrap">
                    {collection?.drop?.name?.length > 15
                      ? collection?.drop?.name.slice(0, 15) + "..."
                      : collection?.drop?.name}
                  </div>
                  <div className="relative w-fit h-fit font-geom text-xs text-white whitespace-nowrap">
                    {" "}
                    —{" "}
                    {collection?.name?.length > 7
                      ? collection?.name.slice(0, 7) + "..."
                      : collection?.name}
                  </div>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default Drops;
