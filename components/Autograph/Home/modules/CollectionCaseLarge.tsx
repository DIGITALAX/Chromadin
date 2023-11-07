import { INFURA_GATEWAY } from "@/lib/constants";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { CollectionCaseProps } from "../types/autograph.types";

const CollectionCaseLarge: FunctionComponent<CollectionCaseProps> = ({
  router,
  collection,
  autoProfile,
  handleShareCollection,
  imageLoading,
  address,
  profileId,
  handleConnect,
  handleLensSignIn,
}): JSX.Element => {
  return (
    <div
      className={`relative flex rounded-md w-full h-[40rem]`}
      id="staticLoad"
    >
      {collection?.uri?.image &&
        (!collection?.uri?.type?.includes("video") ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              collection?.uri?.image?.split("ipfs://")[1]
            }`}
            layout="fill"
            objectFit="cover"
            className="rounded-md cursor-pointer hover:opacity-80"
            draggable={false}
            onClick={() =>
              router.push(
                `/autograph/${
                  autoProfile?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )[1]
                }/collection/${collection?.uri?.name
                  ?.replaceAll(" ", "_")
                  ?.toLowerCase()}`
              )
            }
          />
        ) : (
          <video
            muted
            autoPlay
            playsInline
            onClick={() =>
              router.push(
                `/autograph/${
                  autoProfile?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )[1]
                }/collection/${collection?.uri?.name
                  ?.replaceAll(" ", "_")
                  ?.toLowerCase()}`
              )
            }
            className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
          >
            <source
              src={`${INFURA_GATEWAY}/ipfs/${
                collection?.uri?.image?.split("ipfs://")[1]
              }`}
              type="video/mp4"
            />
          </video>
        ))}
      {collection?.coinOp && (
        <div
          className="absolute flex top-2 right-2 w-7 h-7 rounded-full p-px"
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
      <div
        className={`absolute w-5/6 h-fit flex preG:items-center preG:justify-center justify-start items-start z-1 bg-black md:left-20 rounded-t-lg bottom-0`}
      >
        <div
          className={`relative w-full h-fit flex preG:items-center preG:justify-center justify-start items-start p-2 flex-col preG:flex-row`}
        >
          <div className="relative w-fit h-fit hidden md:flex flex-row gap-3 preG:items-center preG:justify-center justify-start items-start">
            <div
              className="relative w-10 h-10 border border-ama rounded-full flex preG:items-center preG:justify-center justify-start items-start"
              id="crt"
            >
              {createProfilePicture(autoProfile?.metadata?.picture) !== "" && (
                <Image
                  src={createProfilePicture(autoProfile?.metadata?.picture)}
                  layout="fill"
                  alt="pfp"
                  className="rounded-full w-full h-full flex"
                  draggable={false}
                />
              )}
            </div>
            <div className="relative w-fit h-fit text-ama font-arcade text-sm flex preG:items-center preG:justify-center justify-start items-start">
              {autoProfile?.handle?.suggestedFormatted?.localName &&
              autoProfile?.handle?.suggestedFormatted?.localName?.length > 14
                ? autoProfile?.handle?.suggestedFormatted?.localName?.slice(
                    0,
                    12
                  ) + "..."
                : autoProfile?.handle?.suggestedFormatted?.localName}
            </div>
          </div>
          <div
            className={`relative flex flex-col w-full h-fit justify-start items-start text-left preG:text-center preG:items-center preG:justify-center ml-auto pr-2 pb-2`}
          >
            <div
              className={`relative w-fit h-fit text-white font-mana words-break flex text-lg`}
            >
              {collection?.uri?.name?.length! > 15
                ? collection?.uri?.name?.slice(0, 12) + "..."
                : collection?.uri?.name}
            </div>

            <div
              className={`relative w-fit h-fit text-verde font-mana text-sm words-break flex`}
            >
              {collection?.drop?.name?.length! > 18
                ? collection?.drop?.name?.slice(0, 16) + "..."
                : collection?.drop?.name}
            </div>
          </div>
          <div className="relative w-fit h-fit justify-start items-start preG:items-center preG:justify-center gap-2 flex flex-row preG:flex-col">
            <div
              className={`relative flex w-full h-fit text-ama font-mana justify-start whitespace-nowrap pb-2 text-sm`}
            >
              {Number(collection?.tokenIds?.length) -
                (collection?.soldTokens?.length
                  ? collection?.soldTokens?.length
                  : 0) ===
              0
                ? "SOLD OUT"
                : `${
                    Number(collection?.tokenIds?.length) -
                    (collection?.soldTokens?.length
                      ? collection?.soldTokens?.length
                      : 0)
                  } /
                  ${Number(collection?.tokenIds?.length)}`}
            </div>
            <div
              className={`relative text-ama items-start preG:items-center flex cursor-pointer hover:opacity-70 active:scale-95 flex-row gap-1`}
              onClick={
                !address && !profileId
                  ? () => handleConnect()
                  : address && !profileId
                  ? () => handleLensSignIn()
                  : imageLoading
                  ? () => {}
                  : () => handleShareCollection(collection!)
              }
            >
              <div className="relative w-6 h-4 flex items-center justify-center preG:items-center preG:justify-center">
                <Image
                  layout="fill"
                  alt="post to lens"
                  src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
                  draggable={false}
                />
              </div>
              <div className="relative w-4 h-4 flex items-center justify-center preG:items-center preG:justify-center">
                <Image
                  layout="fill"
                  alt="post to lens"
                  src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCaseLarge;
