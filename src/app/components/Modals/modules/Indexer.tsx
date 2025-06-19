import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";

const Indexer: FunctionComponent<{ dict: any }> = ({dict}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit">
      <div className="w-fit h-16 flex items-center justify-center bg-gradient-to-r z-50 from-white to-offBlack rounded-lg border border-black">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-black font-earl">
          {dict?.[context?.indexar as any ]}
        </div>
      </div>
    </div>
  );
};

export default Indexer;
