import { LimitType } from "@/components/Home/types/generated";
import getEnabledCurrencies from "@/graphql/lens/queries/enabledCurrencies";
import { setEnabledCurrenciesRedux } from "@/redux/reducers/enabledCurrenciesSlice";
import { AnyAction, Dispatch } from "redux";

const availableCurrencies = async (
  dispatch: Dispatch<AnyAction>
): Promise<void> => {
  try {
    const response = await getEnabledCurrencies({
      limit: LimitType.TwentyFive,
    });
    if (response && response.data) {
      dispatch(setEnabledCurrenciesRedux(response.data.currencies.items));
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default availableCurrencies;
