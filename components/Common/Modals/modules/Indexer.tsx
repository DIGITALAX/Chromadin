import { FunctionComponent } from "react";
import { IndexingModalProps } from "../types/modals.types";

const IndexingModal: FunctionComponent<IndexingModalProps> = ({
  message,
}): JSX.Element => {
  return (
    <div className="fixed bottom-5 right-5 w-fit h-fit">
      <div className="w-fit h-16 flex items-center justify-center bg-gradient-to-r from-white to-offBlack rounded-lg border border-black">
        <div className="relative w-fit h-fit flex items-center justify-center px-4 py-2 text-black font-earl">
          {message}
        </div>
      </div>
    </div>
  );
};

export default IndexingModal;
