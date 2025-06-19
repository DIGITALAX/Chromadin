import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import { INFURA_GATEWAY_INTERNAL } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import handleImageError from "@/app/lib/helpers/handleImageError";

const Account: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-[45.8rem] flex flex-col items-start justify-start bg-black border-t border-white">
      <div className="absolute w-full h-full xl:h-[40vw] flex grow top-0">
        <Image
          src={`${INFURA_GATEWAY_INTERNAL}QmUBMaicGmBVTqUr5QXaqEu1AkavAhprwpDXKbMiy74g8p`}
          layout="fill"
          objectFit="cover"
          draggable={false}
        />
      </div>
      {context?.lensConectado?.profile ? (
        <div
          className={`relative w-full ${
            context?.isCreator ? "h-fit" : "h-full"
          } flex flex-col p-2 gap-2 items-start justify-center`}
        >
          <div className="relative w-full h-fit items-center justify-center py-3 flex">
            <div
              className="relative flex w-14 h-14 rounded-full items-center justify-center border border-moda"
              id="crt"
            >
              {context?.lensConectado?.profile?.metadata?.picture?.split(
                "ipfs://"
              )?.[1] && (
                <Image
                  src={`${INFURA_GATEWAY_INTERNAL}${
                    context?.lensConectado?.profile?.metadata?.picture?.split(
                      "ipfs://"
                    )?.[1]
                  }`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full flex"
                  draggable={false}
                  onError={(e) => handleImageError(e)}
                />
              )}
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-row gap-2">
            <input
              disabled
              className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
              value={`@${context?.lensConectado?.profile?.username?.value}`}
            />
            <input
              disabled
              className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
              value={`${context?.lensConectado?.profile?.address}`}
            />
          </div>
          <input
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-8 rounded-br-lg rounded-tl-lg border border-white/30 px-2 text-sm"
            value={`${context?.lensConectado?.profile?.username?.localName}`}
          />
          <textarea
            disabled
            className="relative bg-offBlack font-arcade text-white/50 w-full h-28 rounded-br-lg rounded-tl-lg border border-white/30 px-2 py-1 text-sm"
            style={{
              resize: "none",
            }}
            value={`${context?.lensConectado?.profile?.metadata?.bio}`}
          ></textarea>
        </div>
      ) : (
        <div
          className={`relative w-full ${
            context?.isCreator ? "h-fit p-5" : "h-full p-3"
          } flex flex-col items-center justify-center font-arcade text-moda text-sm`}
        >
          {dict?.view}
        </div>
      )}
      {context?.isCreator && context?.lensConectado?.profile && (
        <div className="relative w-full h-fit flex flex-col items-center justify-center p-3">
          <Link
            className="relative w-fit h-fit py-2 px-3 rounded-br-lg  rounded-tl-lg bg-offBlack border-white border font-earl text-white text-xs word-break cursor-pointer flex items-center justify-center active:scale-95 hover:opacity-70"
            target="_blank"
            rel="noreferrer"
            href={`https://cypher.digitalax.xyz/autograph/${context?.lensConectado?.profile?.username?.localName}`}
          >
            {dict?.creator}
          </Link>
        </div>
      )}
    </div>
  );
};

export default Account;
