import { Address } from "viem";
import { useFetchRawReservesList } from "../../lending-borrowing/queries/useFetchRawReservesList";
import { FetchData } from "../../../../shared/types/Fetch";
import { ilmAssetStrategiesMap } from "../../loop-strategy/config/StrategyConfig";
import { lendingAssetToHide } from "../../../../meta";
import { useFetchAllStakingTokens } from "../../staking/queries/useFetchAllStakingTokens";
import { mergeQueryStates } from "../../../../shared";

export enum MarketType {
  Lending,
  Strategy,
  Staking,
}

export interface Market {
  address?: Address;
  isStrategy: boolean;
  marketType?: MarketType;
}

export const isEqualMarket = (market: Market, otherMarket: Market) => {
  return (
    market.address === otherMarket.address &&
    market.isStrategy === otherMarket.isStrategy &&
    market.marketType?.toString() === otherMarket.marketType?.toString()
  );
};

export const useFetchAllMarkets = (): FetchData<Market[] | undefined> => {
  const { data: lendingAssets, ...restReserve } = useFetchRawReservesList();
  const { data: stakingTokens, ...restStaking } = useFetchAllStakingTokens();

  const lendingMarkets: Market[] | undefined = lendingAssets
    ?.filter((asset) => {
      return lendingAssetToHide.indexOf(asset?.toLowerCase()) === -1;
    })
    .map((asset) => ({
      address: asset,
      isStrategy: false,
      marketType: MarketType.Lending,
    }));

  const stakingMarkets: Market[] | undefined = stakingTokens?.map((token) => ({
    address: token,
    isStrategy: false,
    marketType: MarketType.Staking,
  }));

  const ilmMarkets: Market[] = [];

  ilmAssetStrategiesMap.forEach((_, asset) => {
    ilmMarkets.push({
      address: asset,
      isStrategy: true,
      marketType: MarketType.Strategy,
    });
  });

  return {
    ...mergeQueryStates([restReserve, restStaking]),
    data: lendingAssets ? [...ilmMarkets, ...(lendingMarkets || []), ...(stakingMarkets || [])] : undefined,
  };
};
