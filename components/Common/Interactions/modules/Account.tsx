import { FunctionComponent } from "react";
import { AccountProps } from "../types/interactions.types";
import Image from "next/legacy/image";
import createProfilePicture from "@/lib/helpers/createProfilePicture";
import { INFURA_GATEWAY } from "@/lib/constants";
import Link from "next/link";

const Account: FunctionComponent<AccountProps> = ({
  profile,
  isCreator,
}): JSX.Element => {
  const formattedURL = createProfilePicture(profile?.metadata?.picture);
  return (
    <div className="relative w-full h-full xl:h-[45.8rem] flex flex-col items-start justify-start bg-black border-t border-white">
      <div className="absolute w-full h-full xl:h-[40vw] flex grow top-0">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUBMaicGmBVTqUr5QXaqEu1AkavAhprwpDXKbMiy74g8p`}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
      </div>
      {profile?.id ? (
        <div
          className={`relative w-full ${
            isCreator ? "h-fit" : "h-full"
          } flex flex-col p-2 gap-2 items-start justify-center`}
        >
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
              value={`@${profile?.handle?.fullHandle}`}
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
            value={`${
              profile?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
            }`}
          />
          <textarea
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-28 rounded-br-lg rounded-tl-lg border border-white/30 px-2 py-1 text-sm"
            style={{
              resize: "none",
            }}
            value={`${profile?.metadata?.bio}`}
          ></textarea>
        </div>
      ) : (
        <div
          className={`relative w-full ${
            isCreator ? "h-fit p-5" : "h-full p-3"
          } flex flex-col items-center justify-center font-arcade text-moda text-sm`}
        >
          Connect to Lens to View Your Account
        </div>
      )}
      {isCreator && (
        <div className="relative w-full h-fit flex flex-col items-center justify-center p-3">
          <Link
            className="relative w-fit h-fit py-2 px-3 rounded-br-lg  rounded-tl-lg bg-offBlack border-white border font-earl text-white text-xs word-break cursor-pointer flex items-center justify-center active:scale-95 hover:opacity-70"
            target="_blank"
            rel="noreferrer"
            href={`https://cypher.digitalax.xyz/autograph/${
              profile?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
            }`}
          >
            Go To Creator Dashboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;
