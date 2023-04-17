import { FunctionComponent } from "react";
import { CollectorsProps } from "../types/interactions.types";
import InfiniteScroll from "react-infinite-scroll-component";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/lib/constants";

const Collectors: FunctionComponent<CollectorsProps> = ({
  collectors,
  collectLoading,
  getMorePostCollects,
  hasMoreCollects,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full bg-offBlack flex flex-col">
      <div className="relative w-full h-full flex flex-col">
        {collectLoading ? (
          <div className="relative w-full h-60 justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : collectors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-60 justify-center items-start p-3 flex text-center">
            Be the first to collect this stream :)
          </div>
        ) : (
          <InfiniteScroll
            hasMore={hasMoreCollects}
            height={"15rem"}
            loader={<FetchMoreLoading size="3" />}
            dataLength={collectors?.length}
            next={getMorePostCollects}
            className={`relative row-start-1 w-full h-full`}
          >
            <div className="relative w-full h-fit flex flex-col gap-3 px-4 pt-4">
              {collectors?.map((collector: any, index: number) => {
                let profileImage: string;
                if (!(collector?.defaultProfile?.picture as any)?.original) {
                  profileImage = "";
                } else if (
                  (collector?.defaultProfile?.picture as any)?.original
                ) {
                  if (
                    (
                      collector?.defaultProfile?.picture as any
                    )?.original?.url.includes("http")
                  ) {
                    profileImage = (collector?.defaultProfile?.picture as any)
                      ?.original.url;
                  } else {
                    const cut = (
                      collector?.defaultProfile?.picture as any
                    ).original.url.split("/");
                    profileImage = `${INFURA_GATEWAY}/ipfs/${cut[2]}`;
                  }
                } else {
                  profileImage = (collector?.defaultProfile?.picture as any)
                    ?.uri;
                }
                return (
                  <div
                    className="relative w-full h-fit flex flex-row gap-3"
                    key={index}
                  >
                    <div className="relative w-6 h-6 border border-white">
                      <Image
                        src={profileImage}
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                      />
                    </div>
                    <div className="relative w-full h-fit text-ama font-arcade">
                      {collector?.defaultProfile?.handle}
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
      <div className="relative w-full h-full py-2 border-t border-white text-white font-arcade uppercase items-end justify-center flex">
        COLLECTED BY
      </div>
    </div>
  );
};

export default Collectors;
