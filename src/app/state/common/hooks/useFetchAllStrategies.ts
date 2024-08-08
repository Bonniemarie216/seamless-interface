import { Address } from "viem";
import { FetchData } from "../../../../shared/types/Fetch";
import { strategiesConfig } from "../../settings/config";
import { LendMarketState, StrategyState } from "../types/StateTypes";

/**
 * For now this hook is not fetching anything. It just returns an array of `StrategyState` objects.
 *
 * @returns An object containing a `state`.
 */
export const useFetchAllStrategies = (): {
  state: FetchData<(LendMarketState | StrategyState)[]>;
} => {
  // todo: fetch rest of the things for strategies?
  const ilmMarkets: StrategyState[] = [];
  Object.keys(strategiesConfig).forEach((key) => {
    ilmMarkets.push({
      isStrategy: true,
      tags: ["ILM"],
      ...strategiesConfig[key as Address],
    });
  });

  return {
    state: {
      data: ilmMarkets,
      ...{
        isFetched: true,
        isLoading: false
      },
    },
  };
};
