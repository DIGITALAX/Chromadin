import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import Fulfillment from "./Fulfillment";
import { Options, SwitchProps } from "../types/interactions.types";

const Switch: FunctionComponent<SwitchProps> = ({
  dispatch,
  router,
  address,
  currency,
  setCurrency,
  totalAmount,
  approved,
  buyNFT,
  approveSpend,
  purchaseLoading,
  historyLoading,
  historySwitch,
  setHistorySwitch,
  getMoreBuyerHistory,
  getMoreUserHistory,
  action,
  profile,
  isCreator,
  historyData,
  collectionInfo,
  t,
}): JSX.Element => {
  switch (action) {
    case Options.Account:
      return <Account profile={profile} isCreator={isCreator} />;

    case Options.Fulfillment:
      return (
        <Fulfillment
          t={t}
          currency={currency}
          setCurrency={setCurrency}
          totalAmount={totalAmount}
          approved={approved}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collectionInfo={collectionInfo}
          dispatch={dispatch}
          router={router}
          address={address}
        />
      );

    default:
      return (
        <History
          t={t}
          historyLoading={historyLoading}
          historySwitch={historySwitch}
          setHistorySwitch={setHistorySwitch}
          getMoreBuyerHistory={getMoreBuyerHistory}
          getMoreUserHistory={getMoreUserHistory}
          historyData={historyData}
        />
      );
  }
};

export default Switch;
