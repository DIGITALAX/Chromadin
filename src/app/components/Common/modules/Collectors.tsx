import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import FetchMoreLoading from "./FetchMoreLoading";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { Account } from "@lens-protocol/client";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import useCollects from "../hooks/useCollects";

const Collectors: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { collectors, collectsLoading, getMorePostCollects, collectInfo } =
    useCollects();
  return (
    <div className="relative w-full h-full bg-offBlack flex flex-col">
      <div className="relative w-full h-full flex flex-col pb-2">
        {collectsLoading ? (
          <div className="relative w-full h-60 justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : collectors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-60 justify-center items-start p-3 flex text-center">
            {dict?.firstCollect}
          </div>
        ) : (
          <InfiniteScroll
            hasMore={collectInfo?.hasMore}
            height={"15rem"}
            loader={<FetchMoreLoading size="3" />}
            dataLength={collectors?.length}
            next={getMorePostCollects}
            className={`relative row-start-1 w-full h-full overflow-y-scroll`}
          >
            <div className="relative w-full h-fit flex flex-col gap-3 px-4 pt-4">
              {collectors?.map((collector: Account, index: number) => {
                return (
                  <div
                    className={`relative w-full h-fit flex flex-row gap-3 ${
                      collector?.username?.localName && "cursor-pointer"
                    }`}
                    key={index}
                    onClick={() =>
                      collector?.username?.localName &&
                      window.open(
                        `https://www.chromadin.xyz/?option=history&profile=${collector?.username?.localName}`
                      )
                    }
                  >
                    <div
                      className="relative w-6 h-6 border border-white"
                      id="crt"
                    >
                      <Image
                        src={`${INFURA_GATEWAY_INTERNAL}${
                          collector?.metadata?.picture?.split("ipfs://")?.[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        draggable={false}
                        onError={(e) => handleImageError(e)}
                      />
                    </div>
                    <div className="relative w-full h-fit text-ama font-arcade">
                      {collector?.username?.localName
                        ? collector?.username?.localName
                        : collector?.owner?.slice(0, 20)}
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        )}
      </div>
      <div className="relative w-full h-full py-2 border-t border-white text-white font-arcade uppercase items-end justify-center flex">
        {dict?.collected}
      </div>
    </div>
  );
};

export default Collectors;
