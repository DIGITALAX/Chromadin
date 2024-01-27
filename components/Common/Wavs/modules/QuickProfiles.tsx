import { FunctionComponent } from "react";
import { QuickProfilesProps } from "../types/wavs.types";
import Image from "next/legacy/image";
import { Profile } from "@/components/Home/types/generated";
import createProfilePicture from "@/lib/helpers/createProfilePicture";

const QuickProfiles: FunctionComponent<QuickProfilesProps> = ({
  quickProfiles,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto overflow-x-scroll">
      <div className="relative w-fit h-full overflow-x-scroll grid grid-flow-col auto-cols-auto gap-2">
        {quickProfiles?.map((profile: Profile, index: number) => {
          const pfp = createProfilePicture(profile?.metadata?.picture);
          return (
            <div
              key={index}
              className="relative rounded-full hover:opacity-70 cursor-pointer active:scale-95 h-10 w-10"
              id="crt"
              onClick={() => {
                if (router.asPath.includes("&profile=")) {
                  router.push(
                    router.asPath.split("&profile=")[0] +
                      `&profile=${
                        profile?.handle?.suggestedFormatted?.localName?.split(
                          "@"
                        )?.[1]
                      }`
                  );
                } else {
                  router.push(
                    router.asPath.includes("?option=")
                      ? router.asPath +
                          `&profile=${
                            profile?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )?.[1]
                          }`
                      : router.asPath +
                          `?option=history&profile=${
                            profile?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )?.[1]
                          }`
                  );
                }
              }}
            >
              {pfp && (
                <Image
                  layout="fill"
                  className="rounded-full w-full h-full"
                  objectFit="cover"
                  draggable={false}
                  objectPosition={"center"}
                  src={pfp}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickProfiles;
