import { Erc20 } from "@/components/Home/types/lens.types";
import getEnabledCurrencies from "@/graphql/lens/queries/enabledCurrencies";

const availableCurrencies = async (
  setEnabledCurrencies: (e: Erc20[]) => void,
  setEnabledCurrency: (e: string) => void,
  presetCurrency?: string
): Promise<void> => {
  const response = await getEnabledCurrencies();
  setEnabledCurrencies(response.data.enabledModuleCurrencies);
  setEnabledCurrency(
    presetCurrency
      ? presetCurrency
      : response.data.enabledModuleCurrencies[0]?.symbol
  );
};

export default availableCurrencies;
