import { Erc20 } from "@/components/Home/types/generated";
import getEnabledCurrencies from "@/graphql/lens/queries/enabledCurrencies";
import { LimitType } from "@lens-protocol/client";

const availableCurrencies = async (
  setEnabledCurrencies: (e: Erc20[]) => void,
  setEnabledCurrency: (e: string) => void,
  presetCurrency?: string
): Promise<void> => {
  try {
    const response = await getEnabledCurrencies({
      limit: LimitType.TwentyFive,
    });
    if (response && response.data) {
      setEnabledCurrencies(response.data.currencies.items);
      setEnabledCurrency(
        presetCurrency
          ? presetCurrency
          : response.data.currencies.items[0]?.symbol
      );
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default availableCurrencies;
