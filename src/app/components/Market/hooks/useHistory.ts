import { ModalContext } from "@/app/providers";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import {  Options } from "../../Common/types/common.types";
import getBuyerHistory, {
  getBuyerHistorySpecific,
} from "../../../../../graph/queries/getBuyerHistory";
import { BuyerHistory } from "../types/market.types";

const useHistory = (address: `0x${string}` | undefined) => {
  const context = useContext(ModalContext);
  const [history, setHistory] = useState<{
    buyerHistory: BuyerHistory[];
    allHistory: BuyerHistory[];
    hasMoreBuyerHistory: boolean;
    hasMoreHistory: boolean;
    allSkip: number;
    buyerSkip: number;
  }>({
    buyerHistory: [],
    buyerSkip: 0,
    allSkip: 0,
    allHistory: [],
    hasMoreBuyerHistory: true,
    hasMoreHistory: true,
  });
  const [historySwitch, setHistorySwitch] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);

  const getUserHistory = async () => {
    setHistoryLoading(true);

    try {
      const res = await getBuyerHistory(12, 0);
      const data = res?.data?.tokensBoughts || [];

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: any) => {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient || context?.clienteLens!,
              {
                managedBy: history.buyer,
              }
            );

            let profile;

            if (data?.isOk()) {
              profile = data?.value?.items?.[0];
            }

            return {
              ...history,
              profile,
            };
          })
        );

        setHistory((prev) => ({
          ...prev,
          buyerHistory: history,
          hasMoreBuyerHistory: history?.length == 12 ? true : false,
          buyerSkip: history?.length == 12 ? 12 : 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  const getHistorySpecific = async () => {
    if (!address) return;
    setHistoryLoading(true);
    try {
      const res = await getBuyerHistorySpecific(address as string, 12, 0);
      const data = res.data.tokensBoughts || [];

      if (data.length > 0) {
        const allHistory = await Promise.all(
          data.map(async (history: any) => {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient || context?.clienteLens!,
              {
                managedBy: history.buyer,
              }
            );

            let profile;

            if (data?.isOk()) {
              profile = data?.value?.items?.[0];
            }

            return {
              ...history,
              profile,
            };
          })
        );

        setHistory((prev) => ({
          ...prev,
          allHistory,
          hasMoreHistory: allHistory?.length == 12 ? true : false,
          allSkip: allHistory?.length == 12 ? 12 : 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setHistoryLoading(false);
  };

  const getMoreUserHistory = async () => {
    if (!history?.hasMoreHistory) {
      return;
    }
    let data;
    try {
      const res = await getBuyerHistory(12, history.allSkip);
      data = res?.data?.tokensBoughts;

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: any) => {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient || context?.clienteLens!,
              {
                managedBy: history.buyer,
              }
            );

            let profile;

            if (data?.isOk()) {
              profile = data?.value?.items?.[0];
            }
            return {
              ...history,
              profile,
            };
          })
        );

        setHistory((prev) => ({
          ...prev,
          allHistory: [...prev?.allHistory, ...history],
          hasMoreHistory: history?.length == 12 ? true : false,
          allSkip: history?.length == 12 ? prev?.allSkip + 12 : 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreBuyerHistory = async () => {
    if (!history?.hasMoreBuyerHistory) {
      return;
    }

    try {
      const res = await getBuyerHistorySpecific(
        address as string,
        12,
        history?.buyerSkip
      );
      const data = res?.data?.tokensBoughts;

      if (data.length > 0) {
        const history = await Promise.all(
          data.map(async (history: any) => {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient || context?.clienteLens!,
              {
                managedBy: history.buyer,
              }
            );

            let profile;

            if (data?.isOk()) {
              profile = data?.value?.items?.[0];
            }
            return {
              ...history,
              profile,
            };
          })
        );

        setHistory((prev) => ({
          ...prev,
          buyerHistory: [...prev?.buyerHistory, ...history],
          hasMoreBuyerHistory: history?.length == 12 ? true : false,
          buyerSkip: history?.length == 12 ? prev?.buyerSkip + 12 : 0,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      context?.options === Options.History &&
      ((!historySwitch && history?.allHistory?.length < 1) ||
        (historySwitch && history?.buyerHistory?.length < 1)) && context?.clienteLens
    ) {
      if (historySwitch) {
        getHistorySpecific();
      } else {
        getUserHistory();
      }
    }
  }, [context?.options, address, historySwitch, context?.clienteLens]);

  return {
    historyLoading,
    historySwitch,
    getMoreUserHistory,
    setHistorySwitch,
    history,
    getMoreBuyerHistory,
  };
};

export default useHistory;
