import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/image";
import { Viewer } from "../../Common/types/common.types";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import Options from "./Options";
import Switch from "../../Common/modules/Switch";
import Collectors from "../../Common/modules/Collectors";
import { InteractionsProps } from "../types/sidebar.types";
import Comments from "./Comments";

const Interactions: FunctionComponent<InteractionsProps> = ({
  dict,
  secondaryComment,
  setSecondaryComment,
  commentLoading,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full xl:w-80 xl:shrink-0 xl:h-full flex-col border border-white h-full flex overflow-y-scroll">
      <div className="relative w-full h-full flex flex-col bg-verde">
        <div className="relative w-full h-fit flex flex-row py-2 bg-black rounded-tl-xl border-b border-white">
          <div className="relative w-full h-fit font-arcade text-white flex justify-center text-sm uppercase">
            {context?.viewer !== Viewer.Collect
              ? dict?.Common?.str
              : dict?.Common?.din}
          </div>
          <div className="relative w-fit h-full align-center flex pl-2 rotate-180">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmTXyxVtGPSSyjjLzTfNdLANmc6Wiq8EToEGYefthNsXjw`}
              width={20}
              height={20}
              alt="player"
              draggable={false}
            />
          </div>
        </div>
        {context?.viewer !== Viewer.Collect ? (
          <Comments
            dict={dict}
            commentLoading={commentLoading}
            secondaryComment={secondaryComment}
            setSecondaryComment={setSecondaryComment}
          />
        ) : (
          <Options />
        )}
        {context?.viewer !== Viewer.Collect ? (
          <Collectors dict={dict} />
        ) : (
          <Switch dict={dict} />
        )}
      </div>
    </div>
  );
};

export default Interactions;
