import { FunctionComponent } from "react";
import { AllDropsProps } from "../type/drop.types";
import { Collection } from "@/components/Home/types/home.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import Link from "next/link";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import handleImageError from "@/lib/helpers/handleImageError";

const AllDrops: FunctionComponent<AllDropsProps> = ({
  collections,
  autoProfile,
  router,
  t
}): JSX.Element => {
  const pfp = createProfilePicture(autoProfile?.metadata?.picture);
  return (
    <div className="relative w-full h-full flex flex-col gap-3">
      <div className="relative w-fit h-fit text-white font-earl text-3xl">
        {collections?.[0]?.dropMetadata?.dropTitle}
      </div>
      {autoProfile && (
        <Link
          className="relative flex flex-row w-fit h-fit gap-3 items-center pb-3 cursor-pointer"
          href={`/autograph/${
            autoProfile?.handle?.suggestedFormatted?.localName?.split("@")[1]
          }`}
        >
          <div
            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
            id="crt"
          >
            {pfp && (
              <Image
                src={pfp}
                layout="fill"
                alt="pfp"
                className="rounded-full w-full h-full flex"
                draggable={false}
                onError={(e) => handleImageError(e)}
              />
            )}
          </div>
          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
            {autoProfile?.handle?.suggestedFormatted?.localName}
          </div>
        </Link>
      )}
      <div className="relative h-fit w-full flex flex-row flex-wrap gap-5">
        {collections?.map((collection: Collection, index: number) => {
          return (
            <div
              key={index}
              className="flex flex-col relative w-full preG:w-60 h-60 pb-2 cursor-pointer hover:opacity-70"
              onClick={() =>
                router?.push(
                  `/autograph/${
                    autoProfile?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )[1]
                  }/collection/${collection.collectionMetadata?.title
                    ?.replaceAll(" ", "_")
                    ?.toLowerCase()}`
                )
              }
            >
              <div
                className="relative w-full h-full rounded-md flex w-full"
                id="staticLoad"
              >
                {collection?.collectionMetadata?.mediaTypes
                  ?.toLowerCase()
                  ?.includes("video") ? (
                  <video
                    muted
                    autoPlay
                    playsInline
                    className="relative w-full h-full object-cover rounded-md"
                  >
                    <source
                      src={`${INFURA_GATEWAY}/ipfs/${
                        collection?.collectionMetadata?.video?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      type="video/mp4"
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
                    className="rounded-md"
                    draggable={false}
                    onError={(e) => handleImageError(e)}
                  />
                )}
                <div className="absolute w-full h-fit flex flex-col gap-2 justify-end ml-auto items-end right-0 top-4">
                  <div
                    className={`relative flex w-fit p-1 rounded-l-md h-fit text-ama font-mana items-end justify-end whitespace-nowrap text-xs bg-black right-0 border border-ama`}
                  >
                    {Number(collection?.soldTokens) ===
                    Number(collection?.amount)
                      ? t("sold")
                      : `${Number(collection?.soldTokens)} /
                  ${Number(collection?.amount)}`}
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 right-0 flex flex-col w-full h-fit text-center items-end justify-end ml-auto`}
                >
                  <div
                    className={`relative w-fit h-fit text-white font-mana words-break flex text-xs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
                  >
                    {collection?.collectionMetadata?.title?.length! > 12
                      ? collection?.collectionMetadata?.title?.slice(0, 12) +
                        "..."
                      : collection?.collectionMetadata?.title}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllDrops;
