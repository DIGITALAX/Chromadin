import { PublicationReactionType } from "@/components/Home/types/generated";
import addReaction from "@/graphql/lens/mutations/react";
import { AnyAction, Dispatch } from "redux";
import handleIndexCheck from "./handleIndexCheck";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";

const likeSig = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  downvote: boolean
): Promise<void> => {
  const data = await addReaction({
    for: id,
    reaction: downvote
      ? PublicationReactionType.Downvote
      : PublicationReactionType.Upvote,
  });

  if (
    data?.data?.addReaction?.__typename === "RelaySuccess" ||
    !data?.data?.addReaction
  ) {
    if (data?.data?.addReaction?.txId) {
      await handleIndexCheck(
        {
          forTxId: data?.data?.addReaction?.txId,
        },
        dispatch
      );
    } else {
      dispatch(
        setIndexModal({
          actionOpen: true,
          actionMessage: "Successfully Indexed",
        })
      );
      setTimeout(() => {
        dispatch(
          setIndexModal({
            actionOpen: false,
            actionMessage: undefined,
          })
        );
      }, 1000);
    }
  }
};

export default likeSig;