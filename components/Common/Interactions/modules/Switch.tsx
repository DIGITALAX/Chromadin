import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Fulfillment from "./Fulfillment";
import useFulfillment from "../hooks/useFulfillment";

const Switch: FunctionComponent = (): JSX.Element => {
  const action = useSelector(
    (state: RootState) => state.app.optionsReducer.value
  );
  const profile = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile
  );
  const acceptedtokens = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value?.acceptedTokens
  );
  const {
    currency,
    setCurrency,
    baseColor,
    setBaseColor,
    selectSize,
    setSelectSize,
    posterSize,
    stickerPack,
    setPosterSize,
    setStickerPack,
    setPosterAmount,
    posterAmount,
    totalAmount,
  } = useFulfillment();
  switch (action) {
    case "account":
      return <Account profile={profile} />;

    case "fulfillment":
      return (
        <Fulfillment
          currency={currency}
          setCurrency={setCurrency}
          baseColor={baseColor}
          setBaseColor={setBaseColor}
          selectSize={selectSize}
          setSelectSize={setSelectSize}
          posterSize={posterSize}
          stickerPack={stickerPack}
          setPosterSize={setPosterSize}
          setStickerPack={setStickerPack}
          posterAmount={posterAmount}
          setPosterAmount={setPosterAmount}
          totalAmount={totalAmount}
          acceptedtokens={acceptedtokens!}
        />
      );

    default:
      return <History />;
  }
};

export default Switch;
