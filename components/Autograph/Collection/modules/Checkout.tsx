import { FunctionComponent } from "react";
import usePurchase from "../hooks/usePurchase";
import Purchase from "@/components/Common/Interactions/modules/Purchase";
import PurchaseCoinOp from "@/components/Common/Interactions/modules/PurchaseCoinOp";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useChainModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useNetwork } from "wagmi";
import { useRouter } from "next/router";
import { CheckoutProps } from "../types/collection.types";

const Checkout: FunctionComponent<CheckoutProps> = ({
  dispatch,
  push,
  address,
}): JSX.Element => {
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { chain } = useNetwork();
  const { openChainModal } = useChainModal();
  const fulfillmentDetails = useSelector(
    (state: RootState) => state.app.fulfillmentDetailsReducer.value
  );
  const autoDispatch = useSelector(
    (state: RootState) => state.app.autoCollectionReducer
  );
  const encryptedInformation = useSelector(
    (state: RootState) => state.app.encryptedInformationReducer.information
  );
  const viewScreenNFT = useSelector(
    (state: RootState) => state.app.nftScreenReducer.value
  );
  const {
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
  } = usePurchase();
  return (
    <>
      {autoDispatch.collection && (
        <div className="relative w-full h-fit flex justify-center items-center lg:justify-end lg:items-end py-10">
          {viewScreenNFT ? (
            <Purchase
              acceptedtokens={autoDispatch.collection?.acceptedTokens}
              approved={approved}
              currency={currency}
              setCurrency={setCurrency}
              totalAmount={totalAmount}
              mainNFT={autoDispatch.collection}
              approveSpend={approveSpend}
              buyNFT={buyNFT}
              purchaseLoading={purchaseLoading}
              push={push}
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
