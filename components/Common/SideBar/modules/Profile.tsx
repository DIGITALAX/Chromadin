import { FunctionComponent } from "react";
import { ProfileProps } from "../types/sidebar.types";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import Image from "next/image";
import handleImageError from "@/lib/helpers/handleImageError";

const Profile: FunctionComponent<ProfileProps> = ({
  profile,
  mainPage,
  handleLogout,
}): JSX.Element => {
  const picture = createProfilePicture(profile?.metadata?.picture);
  return (
    <div
      className={`relative h-12 font-geom text-white flex flex-row px-2 cursor-pointer items-center justify-center ${
        mainPage
          ? "bg-none gap-2 w-40"
          : "bg-lensLight/70 border-white border rounded-tl-lg rounded-br-lg gap-4 w-full sm:w-40 lg:w-full"
      }`}
      onClick={() => handleLogout()}
    >
      <div className={`relative rounded-full w-6 h-6`} id="crt">
        {picture && (
          <Image
            src={picture}
            onError={(e) => handleImageError(e)}
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
