import hidePublication from "@/graphql/lens/mutations/hidePublication";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { TFunction } from "i18next";
import { AnyAction, Dispatch } from "redux";

const handleHidePost = async (
  id: string,
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"common", undefined>
): Promise<void> => {
  try {
    const hidden = await hidePublication({
      for: id,
    });
    if (hidden) {
      dispatch(
        setIndexModal({
          actionValue: true,
          actionMessage: t("hideT"),
        })
      );
    }
  } catch (err: any) {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("hide"),
      })
    );
    console.error(err?.message);
  }
  setTimeout(() => {
    dispatch(
      setIndexModal({
        actionValue: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default handleHidePost;
