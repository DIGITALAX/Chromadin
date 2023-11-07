import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { NotFoundProps } from "./types/loading.types";

const NotFound: FunctionComponent<NotFoundProps> = ({
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="relative w-full h-fit flex items-center justify-center font-earl text-white text-base sm:text-lg text-center row-start-1">
        Frequency out of range. <br />
        <br /> Scan your dial to try again.
      </div>
      <div
        className="relative flex items-center justify-center w-60 h-60 hover:rotate-3 active:rotate-6 row-start-2"
        onClick={() => router.push("/")}
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          className="relative w-fit h-fit relative cursor-pointer"
          width={100}
          height={100}
          alt="dial"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default NotFound;
