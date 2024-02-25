import { INFURA_GATEWAY, MOSH_VIDEOS } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import Drops from "./Drops";
import useDrops from "../hooks/useDrops";
import { useDispatch, useSelector } from "react-redux";
import useDrop from "@/components/Home/hooks/useDrop";
import { RootState } from "@/redux/store";
import { NextRouter } from "next/router";

const Frequency: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const collectionInfo = useSelector(
    (state: RootState) => state.app.collectionInfoReducer
  );
  const lensProfile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const {
    moveBackward,
    moveForward,
    currentIndex,
    moshVideoRef,
    currentVideoIndex,
  } = useDrops(collectionInfo?.collections);
  const {
    collectionsLoading,
    handleGetMoreCollections,
    moreCollectionsLoading,
  } = useDrop(router, dispatch, collectionInfo, lensProfile);


  return (
    <div className="relative w-full h-fit preG:h-60 flex flex-row items-center md:pt-0 pt-6">
      <div className="relative w-[80%] h-full flex flex-col">
        <div className="relative w-full h-fit flex flex-col preG:flex-row preG:items-center gap-2 preG:gap-4 pb-2 pt-2">
          <div className="relative w-fit h-fit text-white font-geom uppercase whitespace-nowrap justify-start preG:justify-center text-xl px-3">
            New Frequencies
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2 items-center preG:px-0 px-3 preG:pb-0 pb-2">
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmfSx7sos7eWqZ17VcMVPdZj2v6CKqT1dytojWULoLYi7F`}
              width={20}
              height={20}
              className="flex cursor-pointer active:scale-95"
              onClick={async () => {
                if (moreCollectionsLoading) return;
                if (collectionInfo?.hasMore && currentIndex === 0) {
                  await handleGetMoreCollections();
                }
                moveBackward();
              }}
              draggable={false}
            />
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmdQ34Qn4hCdzpZmUoEsaqxGoD2hTVwDFVv2V2MiQiTEPV`}
              width={20}
              height={20}
              className="flex"
              draggable={false}
            />
            <Image
              alt="waves"
              src={`${INFURA_GATEWAY}/ipfs/QmZxBo1yBTsikqgeV8EqJBgYxcCzHULDi2R1XphqvmoxaJ`}
              width={20}
              height={20}
              className="flex cursor-pointer active:scale-95"
              onClick={async () => {
                if (moreCollectionsLoading) return;
                if (
                  collectionInfo?.hasMore &&
                  currentIndex === collectionInfo?.collections?.length - 6
                ) {
                  await handleGetMoreCollections();
                }
                moveForward();
              }}
              draggable={false}
            />
          </div>
        </div>
        <div className="relative w-full h-px flex" id="raincode"></div>
        <Drops
          collectionInfo={collectionInfo}
          dispatch={dispatch}
          collectionsLoading={collectionsLoading}
          router={router}
          moreCollectionsLoading={moreCollectionsLoading}
          currentIndex={currentIndex}
        />
      </div>
      <div
        className="absolute w-80 h-full hidden md:flex bg-offBlack border-l border-white/70 right-0"
        id="staticLoad"
      >
        <div className="relative w-full h-full justify-center flex">
          <video
            muted
            playsInline
            autoPlay
            className="flex w-full h-full"
            ref={moshVideoRef}
            key={currentVideoIndex}
          >
            <source
              src={`${INFURA_GATEWAY}/ipfs/${MOSH_VIDEOS[currentVideoIndex]}`}
              type="video/mp4"
              id="staticLoad"
            />
          </video>
        </div>
      </div>
    </div>
  );
};

export default Frequency;
