import { FunctionComponent, JSX } from "react";
import { CollectionsProps } from "../types/autograph.types";
import { Collection } from "../../Common/types/common.types";
import CollectionCaseLarge from "./CollectionCaseLarge";
import CollectionCaseSmall from "./CollectionCaseSmall";
import CollectionCaseMedium from "./CollectionCaseMedium";

const Collections: FunctionComponent<CollectionsProps> = ({
  collections,
  profile,
  dict,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-14">
      <div className="relative flex flex-col w-full h-fit gap-3">
        <div className="relative w-full h-full flex flex-col">
          <CollectionCaseLarge
            collection={collections?.[0]}
            profile={profile}
            dict={dict}
          />
        </div>
        <div className="relative w-full h-fit justify-end items-end flex ml-auto">
          <div className="relative w-full tablet:w-132 h-fit overflow-x-scroll inline-flex">
            <div className="flex flex-row gap-2 w-fit h-fit min-w-fit justify-end ml-auto">
              {collections
                ?.filter((collection, index) => {
                  if (
                    collection?.drop?.metadata?.title ===
                      collections[0]?.drop?.metadata?.title &&
                    index !== 0
                  ) {
                    return true;
                  }
                })
                ?.map((collection: Collection, index: number) => {
                  return (
                    <CollectionCaseSmall
                      key={index}
                      collection={collection}
                      profile={profile}
                      dict={dict}
                    />
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {(
        collections?.filter((collection) => {
          if (
            collection?.drop?.metadata?.title !==
            collections[0]?.drop?.metadata?.title
          ) {
            return true;
          }
        }) || []
      )?.length > 0 && (
        <div className="relative w-full h-[50rem] overflow-y-scroll justify-end items-start flex">
          <div className="relative w-fit h-fit gap-6 tablet:gap-12 flex inline-flex flex-wrap overflow-y-scroll justify-end">
            {collections
              ?.filter((collection) => {
                if (
                  collection?.drop?.metadata?.title !==
                  collections[0]?.drop?.metadata?.title
                ) {
                  return true;
                }
              })
              ?.map((collection: Collection, index: number) => {
                return (
                  <CollectionCaseMedium
                    key={index}
                    collection={collection}
                    profile={profile}
                    dict={dict}
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
