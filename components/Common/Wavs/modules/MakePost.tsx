import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MakePostProps } from "../types/wavs.types";
import { setMakePost } from "@/redux/reducers/makePostSlice";
import { setNoHandle } from "@/redux/reducers/noHandleSlice";

const MakePost: FunctionComponent<MakePostProps> = ({
  dispatch,
  profileId,
  address,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-end ml-auto">
      <div
        className="relative w-4 h-4 flex cursor-pointer active:scale-95"
        onClick={() =>
          profileId && address
            ? dispatch(
                setMakePost({
                  actionValue: true,
                  actionQuote: undefined,
                })
              )
            : dispatch(
                setNoHandle({
                  actionValue: true,
                  actionMessage: "Sign In to Lens to Make A Post.",
                })
              )
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSRHvHoTZHuEpzaV8apWqubM92QG94a7q6spVgrNkQZbA`}
          className="w-full h-full flex"
          layout="fill"
          draggable={false}
        />
      </div>
    </div>
  );
};

export default MakePost;
