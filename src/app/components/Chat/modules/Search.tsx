import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import handleImageError from "@/app/lib/helpers/handleImageError";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { Account } from "@lens-protocol/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSearch from "../hooks/useSearch";

const Search: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const path = usePathname();
  const search = useSearchParams();
  const router = useRouter();
  const {
    profilesOpen,
    profilesFound,
    setProfilesOpen,
    setProfilesFound,
    fetchMoreProfiles,
    info,
    searchProfiles,
  } = useSearch();
  return (
    <div className="relative w-full sm:w-fit h-full flex justify-end">
      <div className="relative w-full sm:w-44 h-full grid grid-flow-cols ml-auto order-1 sm:order-2 lg:order-1 stuck2:order-2">
        <input
          className={`relative row-start-1 col-start-1 h-10 bg-black border border-white font-dosis text-white p-2 rounded-md w-full text-sm`}
          placeholder={dict?.Common?.explore}
          onChange={(e) => searchProfiles(e)}
        />
        {profilesOpen && profilesFound.length > 0 && (
          <InfiniteScroll
            hasMore={info?.hasMore}
            next={fetchMoreProfiles}
            height={"10rem"}
            loader={""}
            dataLength={profilesFound?.length}
            className="absolute w-full overflow-y-scroll top-10 rounded-md z-1 flex flex-col"
          >
            {profilesFound?.map((profile: Account, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-10 px-3 py-2 bg-black flex flex-row border-x rounded-md gap-3 cursor-pointer items-center justify-center hover:bg-offBlack border-b`}
                  onClick={() => {
                    const params = new URLSearchParams(search?.toString());

                    params.set("profile", profile?.username?.localName!);
                    if (!search.get("option")) {
                      params.set("option", "history");
                    }

                    router.replace(path + `?${params.toString()}`);
                    setProfilesOpen(false);
                    setProfilesFound([]);
                  }}
                >
                  <div className="relative flex flex-row w-full h-full text-white font-dosis lowercase place-self-center gap-2">
                    <div
                      className={`relative rounded-full flex bg-white w-5 h-5 items-center justify-center col-start-1`}
                      id="crt"
                    >
                      <Image
                        src={handleProfilePicture(profile?.metadata?.picture)}
                        onError={(e) => handleImageError(e)}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                        draggable={false}
                      />
                    </div>
                    <div className="relative col-start-2 items-center justify-center w-fit h-fit text-xs flex">
                      {profile?.username?.localName?.length! > 15
                        ? profile?.username?.localName.slice(0, 14)
                        : profile?.username?.localName}
                    </div>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};

export default Search;
