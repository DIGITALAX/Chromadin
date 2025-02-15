import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { CollectionCaseProps } from "../types/autograph.types";
import { setMakePost } from "@/redux/reducers/makePostSlice";

const CollectionCaseSmall: FunctionComponent<CollectionCaseProps> = ({
  router,
  collection,
  autoProfile,
  dispatch,
  address,
  lensProfile,
  openConnectModal,
  handleLensSignIn,
  t
}): JSX.Element => {
  return (
    <div className={`relative flex rounded-md w-40 h-40`} id="staticLoad">
      <div className="relative w-full h-full border border-ama rounded-md">
        {!collection?.collectionMetadata?.mediaTypes?.includes("video") ? (
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              collection?.collectionMetadata?.images[0]?.split("ipfs://")[1]
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
                }/collection/${collection?.collectionMetadata?.title
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
            className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80"
            onClick={() =>
              router.push(
                `/autograph/${
                  autoProfile?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )[1]
                }/collection/${collection?.collectionMetadata?.title
                  ?.replaceAll(" ", "_")
                  ?.toLowerCase()}`
              )
            }
          >
            <source
              src={`${INFURA_GATEWAY}/ipfs/${
                collection?.collectionMetadata?.video?.split("ipfs://")[1]
              }`}
              type="video/mp4"
            />
          </video>
        )}
      </div>

      <div className="absolute w-fit h-fit flex flex-col gap-2 justify-end ml-auto items-end right-0 top-4">
        <div
          className={`relative flex w-fit p-1 rounded-l-md h-fit text-ama font-mana items-end justify-end whitespace-nowrap text-xs bg-black right-0 border border-ama`}
        >
          {Number(collection?.soldTokens) === Number(collection?.amount)
            ? t("sold")
            : `${Number(collection?.soldTokens)} /
                  ${Number(collection?.amount)}`}
        </div>
        <div
          className={`relative text-ama items-center flex cursor-pointer bg-black border border-ama rounded-l-md p-1 hover:opacity-70 active:scale-95 flex-row gap-1`}
          onClick={
            !address && !lensProfile?.id
              ? openConnectModal
              : address && !lensProfile?.id
              ? () => handleLensSignIn()
              : () =>
                  dispatch(
                    setMakePost({
                      actionValue: true,
                      actionQuote: collection?.publication,
                    })
                  )
          }
        >
          <div className="relative w-6 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmTosnBk8UmFjJQJrTtZwfDHTegNyDmToPSg7N2ewGmg3Z`}
              draggable={false}
            />
          </div>
          <div className="relative w-4 h-4 flex items-center justify-center">
            <Image
              layout="fill"
              alt="post to lens"
              src={`${INFURA_GATEWAY}/ipfs/QmRr4axapEyQwjoGofb3BUwUT2yN115rnr2HYLLq2Awz2P`}
              draggable={false}
            />
          </div>
        </div>
      </div>
      <div
        className={`absolute bottom-0 right-0 flex flex-col w-fit h-fit text-center items-end justify-end ml-auto`}
      >
        <div
          className={`relative w-fit h-fit text-white font-mana words-break flex text-xs p-1 bg-black border border-ama rounded-tl-md rounded-br-md`}
        >
          {collection?.collectionMetadata?.title?.length! > 12
            ? collection?.collectionMetadata?.title?.slice(0, 12) + "..."
            : collection?.collectionMetadata?.title}
        </div>
      </div>
    </div>
  );
};

export default CollectionCaseSmall;
