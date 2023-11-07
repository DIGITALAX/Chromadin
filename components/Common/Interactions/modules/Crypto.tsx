import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { CryptoProps } from "../types/interactions.types";

const Crypto: FunctionComponent<CryptoProps> = ({
  address,
  handleCheckoutCrypto,
  cryptoCheckoutLoading,
  approved,
  handleApproveSpend,
  chain,
  openChainModal,
  openConnectModal,
  coinOp,
}): JSX.Element => {
  return (
    <div
      className={`relative rounded-lg p-1.5 w-44 text-center border-white border font-earl text-white h-8 hover:bg-moda cursor-pointer
          ${
            coinOp?.soldTokens !== coinOp?.amount
              ? "bg-verde/60"
              : "bg-verde/20"
          }`}
      onClick={
        !cryptoCheckoutLoading && !address
          ? openConnectModal
          : chain.id !== 137
          ? openChainModal
          : approved
          ? () => !cryptoCheckoutLoading && handleCheckoutCrypto!()
          : () => !cryptoCheckoutLoading && handleApproveSpend!()
      }
    >
      <div
        className={`relative w-full h-full flex items-center justify-center ${
          cryptoCheckoutLoading && "animate-spin"
        }`}
      >
        {cryptoCheckoutLoading ? (
          <AiOutlineLoading size={10} color="white" />
        ) : coinOp?.soldTokens === coinOp?.amount ? (
          "SOLD OUT"
        ) : !approved ? (
          "APPROVE"
        ) : (
          "COLLECT"
        )}
      </div>
    </div>
  );
};

export default Crypto;
