import { FunctionComponent } from "react";
import { CollectorsProps } from "../types/interactions.types";
import InfiniteScroll from "react-infinite-scroll-component";
import FetchMoreLoading from "../../Loading/FetchMoreLoading";
import Image from "next/legacy/image";
import { Profile } from "@/components/Home/types/generated";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import handleImageError from "@/lib/helpers/handleImageError";

const Collectors: FunctionComponent<CollectorsProps> = ({
  collectors,
  collectLoading,
  getMorePostCollects,
  hasMoreCollects,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full bg-offBlack flex flex-col">
      <div className="relative w-full h-full flex flex-col pb-2">
        {collectLoading ? (
          <div className="relative w-full h-60 justify-center items-center flex">
            <FetchMoreLoading size="6" />
          </div>
        ) : collectors?.length < 1 ? (
          <div className="relative text-white font-arcade w-full h-60 justify-center items-start p-3 flex text-center">
            {`Be the first to collect this stream :)`}
          </div>
        ) : (
          <InfiniteScroll
            hasMore={hasMoreCollects}
            height={"15rem"}
            loader={<FetchMoreLoading size="3" />}
            dataLength={collectors?.length}
            next={getMorePostCollects}
            className={`relative row-start-1 w-full h-full overflow-y-scroll`}
          >
            <div className="relative w-full h-fit flex flex-col gap-3 px-4 pt-4">
              {collectors?.map((collector: Profile, index: number) => {
                let profileImage = createProfilePicture(
                  collector?.metadata?.picture
                );

                return (
                  <div
                    className={`relative w-full h-fit flex flex-row gap-3 ${
                      collector?.handle?.suggestedFormatted?.localName &&
                      "cursor-pointer"
                    }`}
                    key={index}
                    onClick={() =>
                      collector?.handle?.suggestedFormatted?.localName &&
                      window.open(
                        `https://www.chromadin.xyz/#chat?option=history&profile=${
                          collector?.handle?.suggestedFormatted?.localName?.split(
                            "@"
                          )[1]
                        }`
                      )
                    }
                  >
                    <div
                      className="relative w-6 h-6 border border-white"
                      id="crt"
                    >
                      {profileImage && (
                        <Image
                          src={profileImage}
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          onError={(e) => handleImageError(e)}
                        />
                      )}
                    </div>
                    <div className="relative w-full h-fit text-ama font-arcade">
                      {collector?.handle?.suggestedFormatted?.localName
                        ? collector?.handle?.suggestedFormatted?.localName
                        : collector?.ownedBy?.address?.slice(0, 20)}
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
