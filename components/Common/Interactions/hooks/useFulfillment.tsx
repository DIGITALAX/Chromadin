import { useState } from "react";

const useFulfillment = () => {
  const [selectSize, setSelectSize] = useState<number | undefined>();
  const [baseColor, setBaseColor] = useState<number | undefined>();
  const [currency, setCurrency] = useState<number | undefined>();
  const [posterSize, setPosterSize] = useState<number | undefined>();
  const [stickerPack, setStickerPack] = useState<number | undefined>();
  const [posterAmount, setPosterAmount] = useState<number | undefined>();

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
  };
};

export default useFulfillment;
