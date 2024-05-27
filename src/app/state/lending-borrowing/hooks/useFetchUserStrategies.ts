import { Address } from "viem";
import { useFetchUserSupplyTokens } from "./useFetchUserSupplyTokens";
import { useFetchUserDepositStrategies } from "../../loop-strategy/hooks/useFetchUserDepositStrategies";
import { FetchData } from "../../../../shared/types/Fetch";
import { mergeQueryStates } from "../../../../shared";
import { MarketType } from "../../common/hooks/useFetchAllMarkets";
import { useFetchUserStakingTokens } from "../../staking/hooks/useFetchUserStakingTokens";

interface UserStrategies {
  asset: Address;
  marketType: MarketType;
  strategy?: Address;
}

export const useFetchUserStrategies = (): FetchData<UserStrategies[] | undefined> => {
  const { data: supplyTokens, ...supplyRest } = useFetchUserSupplyTokens();

  const { data: depositStrategies, ...depositRest } = useFetchUserDepositStrategies();

  const { data: stakingTokens, ...stakingRest } = useFetchUserStakingTokens();

  let strategies: UserStrategies[] | undefined;
  if (depositStrategies && stakingTokens) {
    strategies = depositStrategies
      ? depositStrategies.map((strategy) => ({
          asset: strategy!.asset,
          strategy: strategy!.strategy,
          marketType: MarketType.Strategy,
        }))
      : [];

    strategies = strategies.concat(
      stakingTokens.map((token) => ({
        asset: token,
        marketType: MarketType.Staking,
      }))
    );
  }

  return {
    ...mergeQueryStates([supplyRest, depositRest, stakingRest]),
    data: strategies?.concat(
      supplyTokens.map((token) => ({
        asset: token,
        marketType: MarketType.Lending,
      }))
    ),
  };
};
