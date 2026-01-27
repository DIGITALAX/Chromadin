import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import Auth from "../../Common/modules/Auth";
import SearchVending from "../../Market/modules/SearchVending";
import Video from "../../Player/modules/Video";
import useChannels from "../../Player/hooks/useChannels";
import useSearch from "../../Market/hooks/useSearch";
import useBar from "../hooks/useBar";

const Bar: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const router = useRouter();
  const { fetchMoreVideos } = useChannels();
  const { handleSearch, searchOpen, searchResults, handleSearchChoose } =
    useSearch();
  const { isLargeScreen } = useBar();


  return (
    <div className="relative w-full h-fit lg:h-24 flex flex-col justify-start items-center bg-offBlack p-3 gap-3">
      <div className="relative w-full h-full flex flex-row justify-start items-center gap-6">
        <div className="relative flex flex-row w-fit h-fit justify-center items-end gap-3">
          <div
            className="relative w-fit h-fit font-arcade word-break uppercase text-sm lg:text-xl flex justify-center grid grid-flow-row auto-rows-auto cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="rainbow">CHR</span>
            <span className="rainbow">OMA</span>
            <span className="static">DIN</span>
          </div>
        </div>
        {isLargeScreen && (
          <div className="relative w-full flex top-0">
            <Video fetchMoreVideos={fetchMoreVideos} dict={dict} />
          </div>
        )}
        <div className="relative w-full h-full hidden md:flex justify-end items-center flex-row ml-auto">
          <SearchVending
            dict={dict}
            handleSearch={handleSearch}
            searchOpen={searchOpen}
            searchResults={searchResults}
            handleSearchChoose={handleSearchChoose}
            mainPage={true}
          />
          <Auth dict={dict} mainPage={true} />
        </div>
        <div className="relative w-fit h-full flex flex-col items-end justify-center gap-2 ml-auto">
          <div className="relative w-4 h-4">
            <Image
              src={`${INFURA_GATEWAY_INTERNAL}QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
              layout="fill"
              alt="player"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-fit font-geom flex text-white flex flex-col">
            <div className="relative w-full h-fit flex justify-end text-xxs text-right">
              {dict?.trans}
            </div>
            <div className="relative w-full h-fit flex justify-end text-xxs ">
              24 - 7 - 365
            </div>
          </div>
        </div>
      </div>
      {!isLargeScreen && (
        <div className="relative w-full flex">
          <Video fetchMoreVideos={fetchMoreVideos} dict={dict} />
        </div>
      )}
      <div className="relative w-full h-full flex md:hidden justify-end items-center flex-row ml-auto">
        <SearchVending
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          mainPage={true}
          dict={dict}
        />
        <Auth dict={dict} mainPage={true} />
      </div>
    </div>
  );
};

export default Bar;
