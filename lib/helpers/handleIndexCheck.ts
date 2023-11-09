import { AnyAction, Dispatch } from "redux";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import pollUntilIndexed from "@/graphql/lens/queries/checkIndexed";
import { LensTransactionStatusRequest } from "@lens-protocol/client";

const handleIndexCheck = async (
  tx: LensTransactionStatusRequest,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const indexedStatus = await pollUntilIndexed(tx);
    if (indexedStatus) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Successfully Indexed",
        })
      );
    } else {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: "Post Unsuccessful, Please Try Again",
        })
      );
    }
    setTimeout(() => {
      dispatch(
        setIndexModal({
          actionValue: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleIndexCheck;
