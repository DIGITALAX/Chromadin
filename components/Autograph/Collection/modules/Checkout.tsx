import { FunctionComponent } from "react";
import Purchase from "@/components/Common/Interactions/modules/Purchase";
import PurchaseCoinOp from "@/components/Common/Interactions/modules/PurchaseCoinOp";
import { CheckoutProps } from "../types/collection.types";

const Checkout: FunctionComponent<CheckoutProps> = ({
  dispatch,
  address,
  router,
  chain,
  openConnectModal,
  openChainModal,
  fulfillmentDetails,
  autoDispatch,
  encryptedInformation,
  viewScreenNFT,
  purchaseLoading,
  buyNFT,
  totalAmount,
  approved,
  approveSpend,
  currency,
  setCurrency,
  handleCheckoutCrypto,
  oracleValue,
  cryptoCheckoutLoading,
}): JSX.Element => {
  return (
    <>
      {autoDispatch.collection && (
        <div className="relative w-full h-fit flex justify-center items-center lg:justify-end lg:items-end py-10">
          {viewScreenNFT ? (
            <Purchase
              approved={approved}
              currency={currency}
              setCurrency={setCurrency}
              totalAmount={totalAmount}
              mainNFT={autoDispatch.collection}
              approveSpend={approveSpend}
              buyNFT={buyNFT}
              purchaseLoading={purchaseLoading}
              router={router}
            />
          ) : (
            <PurchaseCoinOp
              address={address}
              dispatch={dispatch}
              currency={currency}
              setCurrency={setCurrency}
              mainNFT={autoDispatch.collection}
              oracleValue={oracleValue}
              openConnectModal={openConnectModal}
              openChainModal={openChainModal}
              cryptoCheckoutLoading={cryptoCheckoutLoading}
              handleApproveSpend={approveSpend}
              approved={approved}
              encryptedInformation={encryptedInformation}
              chain={chain as any}
              handleCheckoutCrypto={handleCheckoutCrypto}
              fulfillmentDetails={fulfillmentDetails}
              router={router}
              hideImage={true}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Checkout;
