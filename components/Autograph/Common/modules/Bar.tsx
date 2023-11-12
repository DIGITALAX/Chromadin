import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";
import { BarProps } from "../../Collection/types/collection.types";
import Auth from "@/components/Common/SideBar/modules/Auth";
import SearchVending from "@/components/Common/Buttons/SearchVending";
import Video from "@/components/Common/Video/modules/Video";

const Bar: FunctionComponent<BarProps> = ({
  router,
  openConnectModal,
  connected,
  handleLensSignIn,
  lensProfile,
  handleSearch,
  searchOpen,
  searchResults,
  handleSearchChoose,
  isLargeScreen,
  hasMore,
  reactions,
  streamRef,
  formatTime,
  volume,
  handleVolumeChange,
  volumeOpen,
  setVolumeOpen,
  handleHeart,
  mirrorVideo,
  collectVideo,
  likeVideo,
  mirrorLoading,
  collectLoading,
  likeLoading,
  mainVideo,
  wrapperRef,
  progressRef,
  handleSeek,
  videoSync,
  fetchMoreVideos,
  videosLoading,
  setVideosLoading,
  dispatch,
  dispatchVideos,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit md:h-24 flex flex-col justify-start items-center bg-offBlack p-3 gap-3">
      <div className="relative w-full h-full flex flex-row justify-start items-center gap-6">
        <div className="relative flex flex-row w-fit h-fit justify-center items-end gap-3">
          <div
            className="relative w-fit h-fit font-arcade word-break uppercase text-sm lg:text-xl flex justify-center grid grid-flow-row auto-rows-auto cursor-pointer"
            onClick={() => router.push("/#stream?option=history")}
          >
            <span className="rainbow">CHR</span>
            <span className="rainbow">OMA</span>
            <span className="static">DIN</span>
          </div>
        </div>
        {isLargeScreen && (
          <div className="relative w-full flex">
            <Video
              viewer={"autograph"}
              hasMore={hasMore}
              reactions={reactions}
              streamRef={streamRef}
              formatTime={formatTime}
              volume={volume}
              lensProfile={lensProfile}
              handleVolumeChange={handleVolumeChange}
              volumeOpen={volumeOpen}
              setVolumeOpen={setVolumeOpen}
              handleHeart={handleHeart}
              mirrorVideo={mirrorVideo}
              collectVideo={collectVideo}
              likeVideo={likeVideo}
              mirrorLoading={mirrorLoading}
              collectLoading={collectLoading}
              likeLoading={likeLoading}
              mainVideo={mainVideo}
              wrapperRef={wrapperRef}
              progressRef={progressRef}
              handleSeek={handleSeek}
              videoSync={videoSync}
              fetchMoreVideos={fetchMoreVideos}
              videosLoading={videosLoading}
              setVideosLoading={setVideosLoading}
              dispatch={dispatch}
              dispatchVideos={dispatchVideos}
            />
          </div>
        )}
        <div className="relative w-full h-full hidden md:flex justify-end items-center flex-row ml-auto">
          <SearchVending
            handleSearch={handleSearch}
            searchOpen={searchOpen}
            searchResults={searchResults}
            handleSearchChoose={handleSearchChoose}
            mainPage={true}
          />
          <Auth
          router={router}
            connected={connected}
            openConnectModal={openConnectModal}
            handleLensSignIn={handleLensSignIn}
            profile={lensProfile}
            mainPage={true}
          />
        </div>
        <div className="relative w-fit h-full flex flex-col items-end justify-center gap-2 ml-auto">
          <div className="relative w-4 h-4">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
              layout="fill"
              alt="player"
              draggable={false}
            />
          </div>
          <div className="relative w-full h-fit font-geom flex text-white flex flex-col">
            <div className="relative w-full h-fit flex justify-end text-xxs text-right">
              LIVE TRANSMISSION
            </div>
            <div className="relative w-full h-fit flex justify-end text-xxs ">
              24 - 7 - 365
            </div>
          </div>
        </div>
      </div>
      {!isLargeScreen && (
        <div className="relative w-full flex">
          <Video
            viewer={"autograph"}
            hasMore={hasMore}
            reactions={reactions}
            streamRef={streamRef}
            formatTime={formatTime}
            volume={volume}
            handleVolumeChange={handleVolumeChange}
            volumeOpen={volumeOpen}
            setVolumeOpen={setVolumeOpen}
            handleHeart={handleHeart}
            mirrorVideo={mirrorVideo}
            collectVideo={collectVideo}
            likeVideo={likeVideo}
            mirrorLoading={mirrorLoading}
            collectLoading={collectLoading}
            likeLoading={likeLoading}
            mainVideo={mainVideo}
            wrapperRef={wrapperRef}
            progressRef={progressRef}
            handleSeek={handleSeek}
            videoSync={videoSync}
            fetchMoreVideos={fetchMoreVideos}
            videosLoading={videosLoading}
            setVideosLoading={setVideosLoading}
            dispatch={dispatch}
            dispatchVideos={dispatchVideos}
            lensProfile={lensProfile}
          />
        </div>
      )}
      <div className="relative w-full h-full flex md:hidden justify-end items-center flex-row ml-auto">
        <SearchVending
          handleSearch={handleSearch}
          searchOpen={searchOpen}
          searchResults={searchResults}
          handleSearchChoose={handleSearchChoose}
          mainPage={true}
        />
        <Auth
          router={router}
          connected={connected}
          openConnectModal={openConnectModal}
          handleLensSignIn={handleLensSignIn}
          profile={lensProfile}
          mainPage={true}
        />
      </div>
    </div>
  );
};

export default Bar;
