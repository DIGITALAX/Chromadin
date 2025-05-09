import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { Collection } from "../../Common/types/common.types";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { useRouter } from "next/navigation";
import { AllDropsProps } from "../types/autograph.types";

const AllDrops: FunctionComponent<AllDropsProps> = ({
  collections,
  profile,
  dict,
}): JSX.Element => {
  const router = useRouter();
  return (
    <div className="relative w-full h-full flex flex-col gap-3">
      <div className="relative w-fit h-fit text-white font-earl text-3xl">
        {collections?.[0]?.drop?.metadata?.title}
      </div>
      {profile && (
        <Link
          className="relative flex flex-row w-fit h-fit gap-3 items-center pb-3 cursor-pointer"
          href={`/autograph/${profile?.username?.localName}`}
        >
          <div
            className="relative w-6 h-6 cursor-pointer border border-ama rounded-full"
            id="crt"
          >
            <Image
              src={handleProfilePicture(profile?.metadata?.picture)}
              layout="fill"
              alt="pfp"
              className="rounded-full w-full h-full flex"
              draggable={false}
              onError={(e) => handleImageError(e)}
            />
          </div>
          <div className="relative w-fit h-fit cursor-pointer text-ama font-arcade text-sm">
            {profile?.username?.localName}
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
                    profile?.username?.localName
                  }/collection/${collection.metadata?.title
                    ?.replaceAll(" ", "_")
                    ?.toLowerCase()}`
                )
              }
            >
              <div
                className="relative w-full h-full rounded-md flex w-full"
                id="staticLoad"
              >
                {collection?.metadata?.mediaTypes
                  ?.toLowerCase()
                  ?.includes("video") ? (
                  <video
                    muted
                    autoPlay
                    playsInline
                    className="relative w-full h-full object-cover rounded-md"
                  >
                    <source
                      src={`${INFURA_GATEWAY_INTERNAL}${
                        collection?.metadata?.video?.split(
                          "ipfs://"
                        )[1]
                      }`}
                      type="video/mp4"
                    />
                  </video>
                ) : (
                  <Image
                    src={`${INFURA_GATEWAY_INTERNAL}${
                      collection?.metadata?.images?.[0]?.split(
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
                    {Number(collection?.tokenIdsMinted?.length || 0) ===
                    Number(collection?.amount)
                      ? dict?.Common?.sold
                      : `${Number(collection?.tokenIdsMinted?.length || 0)} /
                  ${Number(collection?.amount)}`}
                  </div>
                </div>
                <div
                  className={`absolute bottom-0 right-0 flex flex-col w-full h-fit text-center items-end justify-end ml-auto`}
                >
                  <div
                    className={`relative w-fit h-fit text-white font-mana words-break flex text-xs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
                  >
                    {collection?.metadata?.title?.length! > 12
                      ? collection?.metadata?.title?.slice(0, 12) +
                        "..."
                      : collection?.metadata?.title}
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
