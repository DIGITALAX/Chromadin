import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const History: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black border-t border-white">
      <div className="relative w-full h-full flex flex-col items-center justify-center font-earl text-moda text-center p-3">
        Nothing to see here.
        <br />
        <br />
        Looks like you haven’t made history, yet.
        <br />
        <br />
        Let’s change that by picking up the remote and dialing in to some good
        old channel surfing.
      </div>
      <div className="relative w-full h-[29.4rem] flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmPKeuGZU2QZQm8GVhp7X3WvhzELLnmL5VNCFitgzCP6od`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="relative bottom-0 w-full h-fit py-2 border-y border-white text-white font-arcade uppercase items-end justify-center flex">
        CHROMADIN HISTORY
      </div>
    </div>
  );
};

export default History;
