import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";

const FetchMoreLoading: FunctionComponent<{ size: string }> = ({
  size,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit grid grid-flow-col auto-cols-auto py-3">
      <div
        className={`relative place-self-center w-${size} h-${size} animate-spin`}
      >
        <Image
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmQZ8UwjeizDQkbCiZED8Ya4LxpFD5JbVbNeAdowurHkiY`}
          draggable={false}
        />
      </div>
    </div>
  );
};

export default FetchMoreLoading;
