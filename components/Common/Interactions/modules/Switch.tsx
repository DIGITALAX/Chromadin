import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import Fulfillment from "./Fulfillment";
import { SwitchProps } from "../types/interactions.types";

const Switch: FunctionComponent<SwitchProps> = ({
  dispatch,
  router,
  address,
  openConnectModal,
  chain,
  openChainModal,
  currency,
  setCurrency,
  baseColor,
  setBaseColor,
  selectSize,
  setSelectSize,
  totalAmount,
  approved,
  buyNFT,
  approveSpend,
  purchaseLoading,
  viewScreenNFT,
  setViewScreenNFT,
  handleCheckoutCrypto,
  oracleValue,
  cryptoCheckoutLoading,
  imageIndex,
  setImageIndex,
  historyLoading,
  historySwitch,
  setHistorySwitch,
  getMoreBuyerHistory,
  getMoreUserHistory,
  moreHistoryLoading,
  action,
  profile,
  encryptedInformation,
  mainNFT,
  historyReducer,
  collections,
  isCreator,
  buyerHistoryReducer,
  fulfillmentDetails,
  hasMoreHistory,
  hasMoreHistorySpecific,
}): JSX.Element => {
  switch (action) {
    case "account":
      return <Account profile={profile} isCreator={isCreator} />;

    case "fulfillment":
      return (
        <Fulfillment
          currency={currency}
          setCurrency={setCurrency}
          setBaseColor={setBaseColor}
          selectSize={selectSize}
          baseColor={baseColor}
          setSelectSize={setSelectSize}
          totalAmount={totalAmount}
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
          collections={collections}
          dispatch={dispatch}
          router={router}
          viewScreenNFT={viewScreenNFT}
          setViewScreenNFT={setViewScreenNFT}
          handleCheckoutCrypto={handleCheckoutCrypto}
          address={address}
          cryptoCheckoutLoading={cryptoCheckoutLoading}
          oracleValue={oracleValue}
          openChainModal={openChainModal}
          openConnectModal={openConnectModal}
          encryptedInformation={encryptedInformation}
          fulfillmentDetails={fulfillmentDetails}
          chain={chain as any}
          imageIndex={imageIndex}
          setImageIndex={setImageIndex}
        />
      );

    default:
      return (
        <History
          historyReducer={historyReducer}
          historyLoading={historyLoading}
          buyerHistoryReducer={buyerHistoryReducer}
          historySwitch={historySwitch}
          setHistorySwitch={setHistorySwitch}
          getMoreBuyerHistory={getMoreBuyerHistory}
          getMoreUserHistory={getMoreUserHistory}
          moreHistoryLoading={moreHistoryLoading}
          hasMoreHistory={hasMoreHistory}
          hasMoreHistorySpecific={hasMoreHistorySpecific}
        />
      );
  }
};

export default Switch;
