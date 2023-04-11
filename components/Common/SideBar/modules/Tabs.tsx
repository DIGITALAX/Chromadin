import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { TabProps } from "../types/sidebar.types";

const Tabs: FunctionComponent<TabProps> = ({
  tab,
  setTab,
  viewer,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex xl:hidden flex-col cursor-pointer hover:opacity-80">
      <div
        className="relative w-full h-10 bg-verde font-earl text-center items-center flex flex-row px-3 uppercase"
        onClick={() => {
          setTab(tab === 0 ? 1 : 0);
        }}
      >
        <div className="relative w-full h-fit flex items-center flex flex-row gap-2 justify-center">
          <span
            className={`${
              tab === 1 ? "text-moda" : "text-ama"
            } flex items-center`}
          >
            {viewer === "collect" ? "Fulfill Drop" : "Chat"}
          </span>
          <span className="relative w-fit h-fit text-white font-earl flex items-center leading-0">
            &lt;-- --&gt;
          </span>
          <span
            className={`${
              tab === 0 ? "text-moda" : "text-ama"
            } flex items-center`}
          >
            Channels
          </span>
        </div>
        <div className={`relative w-4 h-4  flex items-center -rotate-90`}>
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
            layout="fill"
            alt="player"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
