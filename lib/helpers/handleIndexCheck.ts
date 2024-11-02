import {
  LensTransactionStatusDocument,
  LensTransactionStatusQuery,
  LensTransactionStatusRequest,
  LensTransactionStatusType,
} from "@/components/Home/types/generated";
import { setError } from "@/redux/reducers/errorSlice";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import { FetchResult } from "@apollo/client";
import { AnyAction, Dispatch } from "redux";
import { apolloClient } from "../lens/client";
import { setModal } from "@/redux/reducers/modalSlice";
import { TFunction } from "i18next";

const handleIndexCheck = async (
  tx: LensTransactionStatusRequest,
  dispatch: Dispatch<AnyAction>,
  t: TFunction<"common", undefined>,
) => {
  const indexedStatus = await pollUntilIndexed(tx);
  if (indexedStatus) {
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: t("succ"),
      })
    );
  } else {
    dispatch(
      setModal({
        actionValue: true,
        actionMessage: t("wrong"),
      })
    );
  }

  const timeoutId = setTimeout(() => {
    dispatch(
      setIndexModal({
        actionValue: false,
        actionMessage: undefined,
      })
    );
  }, 3000);

  return () => clearTimeout(timeoutId);
};

export const getIndexed = async (
  request: LensTransactionStatusRequest
): Promise<FetchResult<LensTransactionStatusQuery>> => {
  return await apolloClient.query({
    query: LensTransactionStatusDocument,
    variables: {
      request: request,
    },
    fetchPolicy: "no-cache",
  });
};

const pollUntilIndexed = async (
  request: LensTransactionStatusRequest
): Promise<boolean> => {
  let count = 0;
  while (count < 10) {
    try {
      const datos = await getIndexed(request);
      if (datos?.data && datos?.data.lensTransactionStatus) {
        switch (datos?.data.lensTransactionStatus.status) {
          case LensTransactionStatusType.Failed:
            return false;
          case LensTransactionStatusType.OptimisticallyUpdated:
          case LensTransactionStatusType.Complete:
            return true;
          case LensTransactionStatusType.Processing:
            count += 1;
            await new Promise((resolve) => setTimeout(resolve, 6000));
            if (count == 10) return true;
            break;
          default:
            throw new Error("Unexpected status");
        }
      }
    } catch (err: any) {
      count += 1;
      console.error(err.message);
      continue;
    }
  }
  return false;
};

export default handleIndexCheck;
