import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PurchaseProps } from "../types/interactions.types";
import { AiOutlineLoading } from "react-icons/ai";

const Purchase: FunctionComponent<PurchaseProps> = ({
  acceptedtokens,
  approved,
  currency,
  setCurrency,
  totalAmount,
  mainNFT,
  approveSpend,
  buyNFT,
  purchaseLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col">
      {mainNFT && (
        <div className="relative w-full h-full flex flex-col items-center justify-center pt-4">
          <div className="relative w-60 h-60 lg:w-2/3 lg:h-52 rounded-br-lg rounded-tl-lg border border-white">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${mainNFT.media}`}
              className="rounded-br-lg rounded-tl-lg w-full h-full"
              layout="fill"
              draggable={false}
              objectFit="cover"
            />
          </div>
        </div>
      )}
      <div className="relative w-full h-fit flex flex-col items-center gap-3 pt-4 justify-center px-3">
        <div className="relative w-fit h-fit flex flex-row items-center justify-center gap-2">
          {Array.from([
            [
              "QmYYUQ8nGDnyuk8jQSung1WmTksvLEQBXjnCctdRrKtsNk",
              "MATIC",
              "0x6199A505ec1707695Ce49b59A07A147f2d50f22D",
            ],
            [
              "QmZRhUgjK6bJM8fC7uV145yf66q2e7vGeT7CLosw1SdMdN",
              "WETH",
              "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
            ],
            [
              "QmSbpsDRwxSCPBWPkwWvcb49jViSxzmNHjYy3AcGF3qM2x",
              "USDT",
              "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
            ],
            [
              "QmS6f8vrNZok9j4pJttUuWpNrjsf4vP9RD5mRL36z6UdaL",
              "MONA",
              "0x6968105460f67c3bf751be7c15f92f5286fd0ce5",
            ],
          ])
            .filter((item) => acceptedtokens?.includes(item[2].toLowerCase()))
            .map((item: string[], index: number) => {
              return (
                <div
                  className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                    currency === item[1] ? "opacity-50" : "opacity-100"
                  }`}
                  key={index}
                  onClick={() => setCurrency(item[1])}
                >
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                    className="flex"
                    draggable={false}
                    width={30}
                    height={35}
                  />
                </div>
              );
            })}
        </div>
        <div className="relative w-1/2 h-fit font-digi text-white text-sm items-center justify-center flex whitespace-nowrap">
          Total: {totalAmount} {currency}
        </div>
      </div>
      <div className="relative w-full h-fit font-earl items-center justify-center flex text-sm pt-4">
        <div
          className={`relative rounded-lg p-1.5 w-24 text-center border-white border text-white h-8 ${
            mainNFT?.tokensSold &&
            mainNFT?.tokenIds?.length! - mainNFT?.tokensSold?.length !== 0 ?
            "hover:bg-moda cursor-pointer bg-verde/60" : "bg-verde/20"
          }`}
          onClick={
            mainNFT?.tokensSold &&
            mainNFT?.tokenIds?.length! - mainNFT?.tokensSold?.length === 0
              ? () => {}
              : !approved
              ? () => approveSpend()
              : () => buyNFT()
          }
        >
          <div
            className={`relative w-full h-full flex items-center justify-center ${
              purchaseLoading && "animate-spin"
            }`}
          >
            {purchaseLoading ? (
              <AiOutlineLoading size={10} color="white" />
            ) : mainNFT?.tokensSold &&
              mainNFT?.tokenIds?.length! - mainNFT?.tokensSold?.length === 0 ? (
              "SOLD OUT"
            ) : !approved ? (
              "APPROVE"
            ) : (
              "COLLECT"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purchase;
