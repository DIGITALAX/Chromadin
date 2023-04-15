import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useFulfillment = () => {
  const acceptedTokens: string[][] = [
    ["MATIC", "0x0000000000000000000000000000000000001010"],
    ["WETH", "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619"],
    ["USDT", "0xc2132d05d31c914a87c6611c10748aeb04b58e8f"],
    ["MONA", "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"],
  ];
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const productType = useSelector(
    (state: RootState) => state.app.productTypeReducer.value
  );
  const [selectSize, setSelectSize] = useState<number>(0);
  const [baseColor, setBaseColor] = useState<number>(0);
  const [currency, setCurrency] = useState<string>(
    acceptedTokens.filter(
      (token) => token[1] === mainNFT?.acceptedTokens?.[0]
    )?.[0]?.[0]
  );
  const [posterSize, setPosterSize] = useState<number>(0);
  const [stickerPack, setStickerPack] = useState<number>(0);
  const [posterAmount, setPosterAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(
    Number(mainNFT?.price[0]) / 10 ** 18
  );

  const getTotalAmount = () => {
    if (productType === "poster") {
      if (posterSize === 0) {
        if (posterAmount === 0) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(19);
          } else if (currency === "ETH") {
            setTotalAmount(0.01);
          } else {
            setTotalAmount(0.05);
          }
        } else if (posterAmount === 1) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(180);
          } else if (currency === "ETH") {
            setTotalAmount(0.1);
          } else {
            setTotalAmount(0.45);
          }
        } else {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(400);
          } else if (currency === "ETH") {
            setTotalAmount(0.222);
          } else {
            setTotalAmount(1);
          }
        }
      } else if (posterSize === 1) {
        if (posterAmount === 0) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(27);
          } else if (currency === "ETH") {
            setTotalAmount(0.015);
          } else {
            setTotalAmount(0.0675);
          }
        } else if (posterAmount === 1) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(250);
          } else if (currency === "ETH") {
            setTotalAmount(0.139);
          } else {
            setTotalAmount(0.625);
          }
        } else {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(600);
          } else if (currency === "ETH") {
            setTotalAmount(0.33);
          } else {
            setTotalAmount(1.5);
          }
        }
      } else if (posterSize === 2) {
        if (posterAmount === 0) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(52);
          } else if (currency === "ETH") {
            setTotalAmount(0.029);
          } else {
            setTotalAmount(0.13);
          }
        } else if (posterAmount === 1) {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(420);
          } else if (currency === "ETH") {
            setTotalAmount(0.23);
          } else {
            setTotalAmount(1.05);
          }
        } else {
          if (currency === "MATIC" || currency === "USDT") {
            setTotalAmount(1024);
          } else if (currency === "ETH") {
            setTotalAmount(0.57);
          } else {
            setTotalAmount(2.56);
          }
        }
      }
    } else if (productType === "sticker") {
      if (stickerPack === 1) {
        if (currency === "MATIC" || currency === "USDT") {
          setTotalAmount(32);
        } else if (currency === "ETH") {
          setTotalAmount(0.018);
        } else {
          setTotalAmount(0.08);
        }
      } else if (stickerPack === 2) {
        if (currency === "MATIC" || currency === "USDT") {
          setTotalAmount(52);
        } else if (currency === "ETH") {
          setTotalAmount(0.029);
        } else {
          setTotalAmount(0.13);
        }
      } else {
        if (currency === "MATIC" || currency === "USDT") {
          setTotalAmount(7);
        } else if (currency === "ETH") {
          setTotalAmount(0.0039);
        } else {
          setTotalAmount(0.0175);
        }
      }
    } else {
      let number;
      if (
        mainNFT?.acceptedTokens.find(
          (token) =>
            token ===
            acceptedTokens.find((token) => token[0] === currency)?.[1]!
        )
      ) {
        number =
          Number(
            mainNFT?.price[
              mainNFT?.acceptedTokens.indexOf(
                acceptedTokens.find((token) => token[0] === currency)?.[1]!
              )
            ]
          ) /
          10 ** 18;
      } else {
        setCurrency(
          acceptedTokens.find(
            (token) => token[1] === mainNFT?.acceptedTokens[0]
          )?.[0]!
        );
        number =
          Number(
            mainNFT?.price[
              mainNFT?.acceptedTokens.indexOf(
                acceptedTokens.find(
                  (token) => token[1] === mainNFT?.acceptedTokens[0]
                )?.[0]!
              )
            ]
          ) /
          10 ** 18;
      }
      setTotalAmount(number);
    }
  };

  useEffect(() => {
    getTotalAmount();
  }, [currency, posterSize, stickerPack, posterAmount, productType, mainNFT]);

  return {
    baseColor,
    selectSize,
    setBaseColor,
    setSelectSize,
    currency,
    setCurrency,
    stickerPack,
    setStickerPack,
    posterSize,
    setPosterSize,
    posterAmount,
    setPosterAmount,
    totalAmount,
  };
};

export default useFulfillment;
