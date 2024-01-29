import { FunctionComponent } from "react";
import { SearchProps } from "../types/wavs.types";
import { Profile } from "@/components/Home/types/generated";
import Image from "next/legacy/image";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import InfiniteScroll from "react-infinite-scroll-component";
import handleImageError from "@/lib/helpers/handleImageError";

const Search: FunctionComponent<SearchProps> = ({
  searchProfiles,
  profilesFound,
  profilesOpenSearch,
  router,
  hasMoreSearch,
  fetchMoreSearch,
  setProfilesOpenSearch,
  setProfilesFound,
}): JSX.Element => {
  return (
    <div className="relative w-full sm:w-44 h-full grid grid-flow-cols ml-auto order-1 sm:order-2 lg:order-1 stuck2:order-2">
      <input
        className={`relative row-start-1 col-start-1 h-10 bg-black border border-white font-dosis text-white p-2 rounded-md w-full text-sm`}
        placeholder="Explore Profiles"
        onChange={(e) => searchProfiles(e)}
      />
      {profilesOpenSearch && profilesFound.length > 0 && (
        <InfiniteScroll
          hasMore={hasMoreSearch}
          next={fetchMoreSearch}
          height={"10rem"}
          loader={""}
          dataLength={profilesFound?.length}
          className="absolute w-full overflow-y-scroll top-10 rounded-md z-1 flex flex-col"
        >
          {profilesFound?.map((profile: Profile, index: number) => {
            const profileImage = createProfilePicture(
              profile?.metadata?.picture
            );
            return (
              <div
                key={index}
                className={`relative w-full h-10 px-3 py-2 bg-black flex flex-row border-x rounded-md gap-3 cursor-pointer items-center justify-center hover:bg-offBlack border-b`}
                onClick={() => {
                  router.push(
                    router?.asPath?.includes("?option=")
                      ? router?.asPath +
                          `&profile=${profile.handle?.suggestedFormatted?.localName?.split("@")[1]}`
                      : router?.asPath +
                          "?option=history" +
                          `&profile=${profile.handle?.suggestedFormatted?.localName?.split("@")[1]}`
                  );
                  setProfilesOpenSearch(false);
                  setProfilesFound([]);
                }}
              >
                <div className="relative flex flex-row w-full h-full text-white font-dosis lowercase place-self-center gap-2">
                  <div
                    className={`relative rounded-full flex bg-white w-5 h-5 items-center justify-center col-start-1`}
                    id="crt"
                  >
                    {profileImage && (
                      <Image
                        src={profileImage}
                        onError={(e) => handleImageError(e)}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                        draggable={false}
                      />
                    )}
                  </div>
                  <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                    {profile?.handle?.suggestedFormatted?.localName?.length! >
                    15
                      ? profile?.handle?.suggestedFormatted?.localName.slice(
                          0,
                          14
                        )
                      : profile?.handle?.suggestedFormatted?.localName}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default Search;
