import { FunctionComponent } from "react";
import Account from "./Account";
import History from "./History";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Fulfillment from "./Fulfillment";
import useFulfillment from "../hooks/useFulfillment";
import useHistory from "../hooks/useHistory";

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
  const mainNFT = useSelector(
    (state: RootState) => state.app.mainNFTReducer.value
  );
  const historyReducer = useSelector(
    (state: RootState) => state.app.historyReducer.value
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
    approved,
    buyNFT,
    approveSpend,
    purchaseLoading,
  } = useFulfillment();
  const { history, historyLoading } = useHistory();
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
          approved={approved}
          mainNFT={mainNFT}
          buyNFT={buyNFT}
          approveSpend={approveSpend}
          purchaseLoading={purchaseLoading}
        />
      );

    default:
      return (
        <History
          history={history}
          historyReducer={historyReducer}
          historyLoading={historyLoading}
        />
      );
  }
};

export default Switch;
