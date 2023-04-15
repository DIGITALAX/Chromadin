import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/image";
import { FunctionComponent } from "react";
import { ConnectProps } from "../types/sidebar.types";
import Auth from "./Auth";

const Connect: FunctionComponent<ConnectProps> = ({
  handleConnect,
  connected,
  handleLensSignIn,
  authStatus,
  profile
}): JSX.Element => {
  return (
    <div className="relative w-full h-full py-8 lg:py-3 px-3 flex flex-col sm:flex-row lg:flex-col items-center gap-4">
      <Auth
        connected={connected}
        handleConnect={handleConnect}
        handleLensSignIn={handleLensSignIn}
        authStatus={authStatus}
        profile={profile}
      />
      <div className="relative justify-center sm:justify-end w-full h-full flex flex-row gap-2">
        <div className="relative w-20 sm:w-14 lg:w-full lg:h-28 h-14 flex">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmfWD8eQEZUuyqmnzYVj2r4bS2vNWHYibSkHW7N27yJw7a`}
            fill
            alt="qr"
            draggable={false}
          />
        </div>
        <div className="relative w-fit h-full flex font-earl text-white text-xs">
          Scan to Dial in To the <br />
          Din
        </div>
        <div className="relative justify-end w-full sm:w-40 lg:w-full h-full flex flex-col gap-4 items-center">
          <div className="relative grid grid-flow-col auto-cols-auto w-1/2 self-end">
            {[...Array(5)].map((_: any, index: number) => (
              <Image
                key={index}
                src={`${INFURA_GATEWAY}/ipfs/QmfXzGt2RHdEfwgiLiYqEmdsDdSHm1SBdq1Cpys1gHTe5s`}
                height={10}
                width={5}
                alt="stripes"
                draggable={false}
              />
            ))}
          </div>
          <div className="relative w-full h-full border border-white rounded-tr-lg rounded-bl-lg text-xs preG:text-base text-white font-arcade flex justify-center items-center p-2 text-center hover:rotate-6">
            <div className="relative w-fit h-fit flex">JOIN THE NETWORK</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Connect;
