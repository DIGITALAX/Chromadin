import { FunctionComponent } from "react";
import { SearchVendingProps } from "./types/buttons.types";
import { Collection, Drop } from "@/components/Home/types/home.types";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { QuickProfilesInterface } from "../Wavs/types/wavs.types";

const SearchVending: FunctionComponent<SearchVendingProps> = ({
  handleSearch,
  searchOpen,
  searchResults,
  handleSearchChoose,
  mainPage,
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
        placeholder={"search"}
        onChange={(e) => handleSearch(e)}
        type="text"
      />
      {searchOpen && (
        <div className="absolute w-full justify-start top-9 right-0 h-40 rounded-br-lg rounded-tl-lg flex flex-col gap-4 bg-black border border-white z-1 overflow-y-scroll py-2 px-1">
          {searchResults?.map(
            (
              result: Collection | QuickProfilesInterface | Drop,
              index: number
            ) => {
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
                      {(result as QuickProfilesInterface)?.handle ? (
                        <Image
                          src={(result as QuickProfilesInterface).image}
                          className="rounded-md"
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                        />
                      ) : (
                        (result as Collection | Drop)?.uri?.image?.split(
                          "ipfs://"
                        )[1] && (
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              (result as Collection | Drop)?.uri?.image?.split(
                                "ipfs://"
                              )[1]
                            }`}
                            className="rounded-md"
                            layout="fill"
                            objectFit="cover"
                            draggable={false}
                          />
                        )
                      )}
                    </div>
                    <div className="relative flex flex-col h-fit w-full items-start justify-center">
                      <div
                        className={`relative w-fit h-fit justify-start ${
                          (result as Collection)?.acceptedTokens?.length > 0
                            ? "text-ama"
                            : (result as QuickProfilesInterface)?.handle
                            ? "text-moda"
                            : "text-azul"
                        }  font-arcade flex`}
                      >
                        {(result as Collection)?.acceptedTokens?.length > 0
                          ? "Collection"
                          : (result as QuickProfilesInterface)?.handle
                          ? "Profile"
                          : "Drop"}
                      </div>
                      <div className="relative w-full h-fit justify-start items-center text-xs">
                        {(result as Collection | Drop)?.uri?.name
                          ? (
                              mainPage
                                ? (result as Collection)?.uri?.name?.length > 20
                                : (result as Collection)?.uri?.name?.length > 10
                            )
                            ? (mainPage
                                ? (result as Collection)?.uri?.name?.slice(
                                    0,
                                    18
                                  )
                                : (result as Collection)?.uri?.name?.slice(
                                    0,
                                    8
                                  )) + "..."
                            : (result as Collection)?.uri?.name
                          : (result as QuickProfilesInterface)?.handle?.length >
                            10
                          ? `${(
                              result as QuickProfilesInterface
                            )?.handle?.slice(0, 8)}` + "..."
                          : `${(result as QuickProfilesInterface)?.handle}`}
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
