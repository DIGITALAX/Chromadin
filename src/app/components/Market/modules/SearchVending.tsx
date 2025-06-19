import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { SearchVendingProps } from "../types/market.types";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { Collection, Drop } from "../../Common/types/common.types";
import { Account } from "@lens-protocol/client";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const SearchVending: FunctionComponent<SearchVendingProps> = ({
  handleSearch,
  searchOpen,
  searchResults,
  handleSearchChoose,
  mainPage,
  dict,
}): JSX.Element => {
  return (
    <div
      className={`relative flex flex-row font-earl text-white text-xs lowercase border border-white rounded-tr-lg rounded-bl-lg justify-start preG:justify-end preG:ml-auto ${
        mainPage ? "w-full h-8" : "w-fit h-full"
      }`}
    >
      <input
        className={`relative w-full p-1 bg-black  rounded-tr-lg rounded-bl-lg ${
          mainPage ? "h-full" : "h-8 preG:h-full"
        }`}
        placeholder={dict?.search}
        onChange={(e) => handleSearch(e)}
        type="text"
      />
      {searchOpen && (
        <div className="absolute w-full justify-start top-9 right-0 h-40 rounded-br-lg rounded-tl-lg flex flex-col gap-4 bg-black border border-white z-1 overflow-y-scroll py-2 px-1">
          {searchResults?.filter(Boolean)?.map(
            (result: Collection | Account | Drop, index: number) => {
              const name =
                !(result as Account)?.username?.localName &&
                (result as Collection)?.acceptedTokens?.length > 0
                  ? (result as Collection)?.metadata?.title
                  : (result as Drop)?.metadata?.title;
              return (
                <div
                  key={index}
                  className={`relative w-full flex justify-start items-center cursor-pointer hover:opacity-70 ${
                    mainPage ? "h-20" : "h-10"
                  }`}
                  onClick={() => handleSearchChoose(result)}
                >
                  <div className="relative flex flex-row gap-2 w-full h-fit justify-start items-center">
                    <div
                      className={`relative rounded-md ${
                        mainPage ? "w-20 h-14" : "w-12 h-9"
                      }`}
                      id="crt"
                    >
                      {(result as Account)?.username?.localName ? (
                        <Image
                          src={handleProfilePicture(
                            (result as Account)?.metadata?.picture
                          )}
                          className="rounded-md"
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          onError={(e) => handleImageError(e)}
                        />
                      ) : (
                        <Image
                          src={`${INFURA_GATEWAY_INTERNAL}${
                            (result as Collection)?.acceptedTokens?.length > 0
                              ? (
                                  result as Collection
                                )?.metadata?.images?.[0]?.split(
                                  "ipfs://"
                                )?.[1] ||
                                (
                                  result as Collection
                                )?.metadata?.mediaCover?.split("ipfs://")?.[1]
                              : (result as Drop)?.metadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                          }`}
                          className="rounded-md"
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                        />
                      )}
                    </div>
                    <div className="relative flex flex-col h-fit w-full items-start justify-center">
                      <div
                        className={`relative w-fit h-fit justify-start ${
                          (result as Collection)?.acceptedTokens?.length > 0
                            ? "text-ama"
                            : (result as Account)?.username?.localName
                            ? "text-moda"
                            : "text-azul"
                        }  font-arcade flex`}
                      >
                        {(result as Collection)?.acceptedTokens?.length > 0
                          ? "Collection"
                          : (result as Account)?.username?.localName
                          ? "Profile"
                          : "Drop"}
                      </div>
                      <div className="relative w-full h-fit justify-start items-center text-xs">
                        {name
                          ? (mainPage ? name?.length > 20 : name?.length > 10)
                            ? (mainPage
                                ? name?.slice(0, 18)
                                : name?.slice(0, 8)) + "..."
                            : name
                          : Number(
                              (result as Account)?.username?.localName?.length
                            ) > 10
                          ? `${(result as Account)?.username?.localName?.slice(
                              0,
                              8
                            )}` + "..."
                          : `${
                              (result as Account)?.username?.localName
                            }`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default SearchVending;
