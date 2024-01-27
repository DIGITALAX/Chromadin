import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import Fulfillment from "./Fulfillment";
import { SwitchProps } from "../types/interactions.types";

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
  mainNFT,
  collections,
  isCreator,
  historyData,
}): JSX.Element => {
  switch (action) {
    case "account":
      return <Account profile={profile} isCreator={isCreator} />;

    case "fulfillment":
      return (
        <Fulfillment
          currency={currency}
          setCurrency={setCurrency}
          totalAmount={totalAmount}
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collections={collections}
          dispatch={dispatch}
          router={router}
          address={address}
        />
      );

    default:
      return (
        <History
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
