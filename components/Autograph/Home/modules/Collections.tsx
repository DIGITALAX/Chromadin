import { FunctionComponent } from "react";
import { CollectionsProps } from "../types/autograph.types";
import { Collection } from "@/components/Home/types/home.types";
import CollectionCaseLarge from "./CollectionCaseLarge";
import CollectionCaseMedium from "./CollectionCaseMedium";
import CollectionCaseSmall from "./CollectionCaseSmall";

const Collections: FunctionComponent<CollectionsProps> = ({
  autoCollections,
  router,
  autoProfile,
  dispatch,
  address,
  lensProfile,
  openConnectModal,
  handleLensSignIn,
  t,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-14">
      <div className="relative flex flex-col w-full h-fit gap-3">
        <div className="relative w-full h-full flex flex-col">
          <CollectionCaseLarge
            t={t}
            router={router}
            collection={autoCollections?.[0]}
            autoProfile={autoProfile}
            dispatch={dispatch}
            address={address}
            lensProfile={lensProfile}
            openConnectModal={openConnectModal}
            handleLensSignIn={handleLensSignIn}
          />
        </div>
        <div className="relative w-full h-fit justify-end items-end flex ml-auto">
          <div className="relative w-full tablet:w-132 h-fit overflow-x-scroll inline-flex">
            <div className="flex flex-row gap-2 w-fit h-fit min-w-fit justify-end ml-auto">
              {autoCollections
                ?.filter((collection, index) => {
                  if (
                    collection?.dropMetadata?.dropTitle ===
                      autoCollections[0]?.dropMetadata?.dropTitle &&
                    index !== 0
                  ) {
                    return true;
                  }
                })
                ?.map((collection: Collection, index: number) => {
                  return (
                    <CollectionCaseSmall
                      router={router}
                      key={index}
                      dispatch={dispatch}
                      collection={collection}
                      autoProfile={autoProfile}
                      address={address}
                      lensProfile={lensProfile}
                      openConnectModal={openConnectModal}
                      handleLensSignIn={handleLensSignIn}
                      t={t}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {(
        autoCollections?.filter((collection) => {
          if (
            collection?.dropMetadata?.dropTitle !==
            autoCollections[0]?.dropMetadata?.dropTitle
          ) {
            return true;
          }
        }) || []
      )?.length > 0 && (
        <div className="relative w-full h-[50rem] overflow-y-scroll justify-end items-start flex">
          <div className="relative w-fit h-fit gap-6 tablet:gap-12 flex inline-flex flex-wrap overflow-y-scroll justify-end">
            {autoCollections
              ?.filter((collection) => {
                if (
                  collection?.dropMetadata?.dropTitle !==
                  autoCollections[0]?.dropMetadata?.dropTitle
                ) {
                  return true;
                }
              })
              ?.map((collection: Collection, index: number) => {
                return (
                  <CollectionCaseMedium
                    router={router}
                    dispatch={dispatch}
                    t={t}
                    key={index}
                    collection={collection}
                    autoProfile={autoProfile}
                    address={address}
                    lensProfile={lensProfile}
                    openConnectModal={openConnectModal}
                    handleLensSignIn={handleLensSignIn}
                  />
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collections;
