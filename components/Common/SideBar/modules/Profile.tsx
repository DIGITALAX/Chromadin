import { FunctionComponent } from "react";
import { ProfileProps } from "../types/sidebar.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/image";
import { useRouter } from "next/router";

const Profile: FunctionComponent<ProfileProps> = ({
  profile,
  mainPage,
}): JSX.Element => {
  const picture = createProfilePicture(profile?.metadata?.picture);
  const router = useRouter();
  return (
    <div
      className={`relative h-12 font-geom text-white flex flex-row px-2 cursor-pointer items-center justify-center ${
        mainPage
          ? "bg-none gap-2 w-40"
          : "bg-lensLight/70 border-white border rounded-tl-lg rounded-br-lg gap-4 w-full sm:w-40 lg:w-full"
      }`}
      onClick={() => {
        if (
          router.asPath.includes("stream") ||
          router.asPath.includes("sampler")
        ) {
          router.asPath.includes("&profile=")
            ? router.push(
                "#collect?option=account" +
                  "&profile=" +
                  router.asPath.split("&profile=")[1]
              )
            : router.asPath.includes("&post=")
            ? router.push(
                "#collect?option=account" +
                  "&post=" +
                  router.asPath.split("&post=")[1]
              )
            : router.push("#collect?option=account");
        }
      }}
    >
      <div className={`relative rounded-full w-6 h-6`} id="crt">
        {picture && (
          <Image
            src={picture}
            fill
            alt="pfp"
            className="rounded-full flex"
            draggable={false}
          />
        )}
      </div>
      <div
        className={`relative w-fit h-fit font-geom text-pesa ${
          mainPage ? "text-xs" : "text-sm sm:text-xs lg:text-sm"
        }`}
      >
        {profile?.handle?.suggestedFormatted?.localName || ""}
      </div>
    </div>
  );
};

export default Profile;
