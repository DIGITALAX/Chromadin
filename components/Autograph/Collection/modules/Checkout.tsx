import { FunctionComponent } from "react";
import Purchase from "@/components/Common/Interactions/modules/Purchase";
import { CheckoutProps } from "../types/collection.types";

const Checkout: FunctionComponent<CheckoutProps> = ({
  router,
  collection,
  purchaseLoading,
  buyNFT,
  totalAmount,
  approved,
  approveSpend,
  currency,
  setCurrency,
  t
}): JSX.Element => {
  return (
    <>
      {collection && (
        <div className="relative w-full h-fit flex justify-center items-center lg:justify-end lg:items-end py-10">
          <Purchase
            t={t}
            approved={approved}
            currency={currency}
            setCurrency={setCurrency}
            totalAmount={totalAmount}
            mainNFT={collection}
            approveSpend={approveSpend}
            buyNFT={buyNFT}
            purchaseLoading={purchaseLoading}
            router={router}
          />
        </div>
      )}
    </>
  );
};

export default Checkout;
