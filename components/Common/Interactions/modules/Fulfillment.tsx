import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { FulfillmentProps } from "../types/interactions.types";
import Purchase from "./Purchase";
import PurchaseCoinOp from "./PurchaseCoinOp";

const Fulfillment: FunctionComponent<FulfillmentProps> = ({
  currency,
  setCurrency,
  totalAmount,
  acceptedtokens,
  approved,
  mainNFT,
  approveSpend,
  buyNFT,
  purchaseLoading,
  collections,
  dispatch,
  router,
  viewScreenNFT,
  setViewScreenNFT,
  address,
  oracleValue,
  openConnectModal,
  openChainModal,
  fulfillmentDetails,
  chain,
  cryptoCheckoutLoading,
  encryptedInformation,
  handleCheckoutCrypto,
  imageIndex,
  setImageIndex,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full xl:h-[45.8rem] flex items-start justify-center bg-black border-t border-white">
      <div className="absolute w-full h-full justify-stretch flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUFwK9nUrUnAoVm3fhbw2XqtUAdzz2js8ju7LjdGXVQe5`}
          layout="fill"
          draggable={false}
          objectFit="cover"
        />
      </div>
      {collections?.length > 0 && (
        <div className="relative w-full h-fit flex flex-col overflow-y-scroll py-4 items-center justify-center gap-3">
          {!mainNFT?.coinOp ? (
            <div className="relative w-full h-full text-center items-start font-earl text-moda text-lg p-3 flex justify-center flex-row gap-1">
              <div
                className="relative w-fit h-fit cursor-pointer flex justify-center items-start"
                onClick={() =>
                  window.open("https://coinop.themanufactory.xyz/")
                }
              >
                This one&apos;s minted, but not yet printed. Level up on Coin Op
                for more immediate fulfillment.
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex flex-col gap-2 items-center justify-center">
              <div className="relative w-fit h-fit text-center items-start font-earl text-moda text-lg p-3 flex justify-center flex-row">
                Select mode: NFT or IRL fulfillment
              </div>
              <div
                className="flex w-fit h-fit relative flex flex-row items-center justify-center gap-1.5 cursor-pointer"
                onClick={() => setViewScreenNFT(!viewScreenNFT)}
              >
                <div className="relative w-8 h-8">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmcK1EJdp5HFuqPUds3WjgoSPmoomiWfiroRFa3bQUh5Xj`}
                    objectFit="cover"
                    draggable={false}
                  />
                </div>
                <div className="relative w-4 h-3 items-center justify-center flex text-white">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmYzbyMb3okS1RKhxogJZWT56kCFjVcXZWk1aJiA8Ch2xi`}
                    draggable={false}
                  />
                </div>
                <div className="relative w-8 h-8">
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmbjKczJYHKu6FkZMoBRBg2ZuszkJ5CA74x8YF2rYzmA7b`}
                    objectFit="cover"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-xl flex text-center">
            {mainNFT?.name}
          </div>
          <div className="relative w-full preG:w-1/2 lg:w-full h-fit items-center justify-center text-white font-earl text-xs flex text-center px-3">
            {mainNFT?.description}
          </div>
          {viewScreenNFT ? (
            <>
              <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
                {Number(mainNFT?.tokenIds?.length) -
                  (mainNFT?.tokensSold?.length
                    ? mainNFT?.tokensSold?.length
                    : 0) ===
                0
                  ? "SOLD OUT"
                  : `${
                      Number(mainNFT?.tokenIds?.length) -
                      (mainNFT?.tokensSold?.length
                        ? mainNFT?.tokensSold?.length
                        : 0)
                    } /
                  ${Number(mainNFT?.tokenIds?.length)}`}
              </div>
              <Purchase
                acceptedtokens={acceptedtokens}
                approved={approved}
                currency={currency}
                setCurrency={setCurrency}
                totalAmount={totalAmount}
                mainNFT={mainNFT}
                approveSpend={approveSpend}
                buyNFT={buyNFT}
                purchaseLoading={purchaseLoading}
                router={router}
              />
            </>
          ) : (
            mainNFT?.coinOp && (
              <>
                <div className="relative w-full h-fit items-center justify-center text-ama font-earl text-base flex">
                  {Number(mainNFT?.coinOp?.amount) -
                    (mainNFT?.amount ? mainNFT?.coinOp?.soldTokens : 0) ===
                  0
                    ? "SOLD OUT"
                    : `${
                        Number(mainNFT?.coinOp?.amount) -
                        (mainNFT?.coinOp?.amount
                          ? mainNFT?.coinOp?.soldTokens
                          : 0)
                      } /
                  ${Number(mainNFT?.coinOp?.amount)}`}
                </div>
                <PurchaseCoinOp
                  imageIndex={imageIndex}
                  setImageIndex={setImageIndex}
                  address={address}
                  dispatch={dispatch}
                  currency={currency}
                  setCurrency={setCurrency}
                  mainNFT={mainNFT}
                  oracleValue={oracleValue}
                  openConnectModal={openConnectModal}
                  openChainModal={openChainModal}
                  cryptoCheckoutLoading={cryptoCheckoutLoading}
                  handleApproveSpend={approveSpend}
                  approved={approved}
                  encryptedInformation={encryptedInformation}
                  chain={chain}
                  handleCheckoutCrypto={handleCheckoutCrypto}
                  fulfillmentDetails={fulfillmentDetails}
                  router={router}
                />
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Fulfillment;
