import { FunctionComponent } from "react";
import Crypto from "./Crypto";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import {  PurchaseCoinOpProps } from "../types/interactions.types";
import ShippingInfo from "./ShippingInfo";
import { MainNFT } from "../../NFT/types/nft.types";
import { setNftScreen } from "@/redux/reducers/nftScreenSlice";

const PurchaseCoinOp: FunctionComponent<PurchaseCoinOpProps> = ({
  address,
  dispatch,
  currency,
  setCurrency,
  mainNFT,
  oracleValue,
  openConnectModal,
  openChainModal,
  cryptoCheckoutLoading,
  handleApproveSpend,
  approved,
  chain,
  handleCheckoutCrypto,
  fulfillmentDetails,
  router,
  push,
  imageIndex,
  setImageIndex,
  hideImage,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit flex flex-col gap-4 ${
        !hideImage
          ? "justify-center items-center"
          : "justify-center items-center lg:items-end lg:justify-end"
      }`}
    >
      {mainNFT?.coinOp?.uri?.image && !hideImage && (
        <div
          className={
            "relative w-full h-full flex flex-col items-center justify-center pt-4"
          }
        >
          <div
            className="relative w-60 h-60 lg:w-2/3 lg:h-52 rounded-br-lg rounded-tl-lg border border-white cursor-pointer"
            id="staticLoad"
            onClick={() => {
              dispatch(setNftScreen(false));
              router
                ? router.push(
                    `/autograph/${
                      (mainNFT as MainNFT)?.creator?.name?.split(".lens")[0]
                    }/collection/${mainNFT?.name
                      ?.replaceAll(" ", "_")
                      .toLowerCase()}`
                  )
                : push &&
                  push(
                    `/autograph/${
                      (mainNFT as MainNFT)?.creator?.name?.split(".lens")[0]
                    }/collection/${mainNFT?.name
                      ?.replaceAll(" ", "_")
                      .toLowerCase()}`
                  );
            }}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                mainNFT.coinOp?.uri?.image?.[imageIndex || 0]?.split(
                  "ipfs://"
                )[1]
              }`}
              className="rounded-br-lg rounded-tl-lg w-full h-full"
              layout="fill"
              draggable={false}
              objectFit="cover"
              key={(mainNFT as MainNFT).media}
            />
            <div
              className={`absolute bottom-2 right-2 w-fit h-fit flex flex-row gap-1.5`}
            >
              <div
                className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                onClick={(e) => {
                  e.stopPropagation();
                  setImageIndex!(imageIndex! < 1 ? imageIndex! + 1 : 0);
                }}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                  layout="fill"
                  draggable={false}
                />
              </div>
              <div
                className={`relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95`}
                onClick={(e) => {
                  e.stopPropagation();

                  setImageIndex!(imageIndex! > 0 ? imageIndex! - 1 : 1);
                }}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
        {ACCEPTED_TOKENS.map((item: string[], index: number) => {
          return (
            <div
              className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                currency === item[0] ? "opacity-50" : "opacity-100"
              }`}
              key={index}
              onClick={() => setCurrency(item[0])}
            >
              <Image
                src={`${INFURA_GATEWAY}/ipfs/${item[2]}`}
                className="flex"
                draggable={false}
                width={30}
                height={35}
              />
            </div>
          );
        })}
      </div>
      <div className="relative justify-center items-center w-fit h-fit flex flex-row font-digi text-white text-base gap-3 text-sm">
        <div className="relative w-fit h-fit">Total:</div>
        <div className="relative w-fit h-fit">
          ${ACCEPTED_TOKENS.find((subArray) => subArray[0] === currency)?.[0]}{" "}
          {(
            Number(mainNFT?.coinOp?.price?.[0]!) /
            10 ** 18 /
            oracleValue
          )?.toFixed(2)}
        </div>
      </div>
      <ShippingInfo
        fulfillmentDetails={fulfillmentDetails}
        dispatch={dispatch}
        hideImage={hideImage}
      />
      <Crypto
        address={address}
        openConnectModal={openConnectModal}
        handleCheckoutCrypto={handleCheckoutCrypto}
        cryptoCheckoutLoading={cryptoCheckoutLoading}
        approved={approved}
        handleApproveSpend={handleApproveSpend}
        chain={chain}
        openChainModal={openChainModal}
        coinOp={mainNFT?.coinOp!}
      />
    </div>
  );
};

export default PurchaseCoinOp;
