import { FunctionComponent } from "react";
import { AccountProps } from "../types/interactions.types";
import Image from "next/legacy/image";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { INFURA_GATEWAY } from "@/lib/constants";

const Account: FunctionComponent<AccountProps> = ({ profile }): JSX.Element => {
  const formattedURL = createProfilePicture(profile);
  return (
    <div className="relative w-full h-full xl:h-[45.8rem] flex flex-col items-center justify-center bg-black border-t border-white">
      <div className="absolute w-full h-full xl:h-[40vw] flex grow top-0">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUBMaicGmBVTqUr5QXaqEu1AkavAhprwpDXKbMiy74g8p`}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
      </div>
      {profile ? (
        <div className="relative w-full h-full flex flex-col p-2 gap-2">
          <div className="relative w-full h-fit items-center justify-center py-3 flex">
            <div
              className="relative flex w-14 h-14 rounded-full items-center justify-center border border-moda"
              id="crt"
            >
              {formattedURL && (
                <Image
                  src={formattedURL}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full flex"
                  draggable={false}
                />
              )}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2">
            <input
              disabled
              className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
              value={`@${profile?.handle}`}
            />
            <input
              disabled
              className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
              value={`${profile?.id}`}
            />
          </div>
          <input
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={`${profile?.name}`}
          />
          <textarea
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-28 rounded-br-lg rounded-tl-lg border border-white/30 px-2 py-1 text-sm"
            style={{
              resize: "none",
            }}
            value={`${profile?.bio}`}
          ></textarea>
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-center justify-center font-arcade text-moda text-sm p-3">
          Connect to Lens to View Your Account
        </div>
      )}
    </div>
  );
};

export default Account;
