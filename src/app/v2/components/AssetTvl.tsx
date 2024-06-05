import React from "react";
import { Address } from "viem";
import { DisplayMoney, DisplayPercentageProps } from "@shared";
import { StrategyData, ilmAssetStrategiesMap } from "../../state/loop-strategy/config/StrategyConfig";
import { useFetchViewDetailTotalSupplied } from "../../state/lending-borrowing/hooks/useFetchViewDetailTotalSupplied";
import { useFetchViewDetailEquity } from "../../state/loop-strategy/queries/useFetchViewEquity";
import { useFetchViewDetailTotalStaked } from "../../state/staking/hooks/useFetchDetailTotalStaked";
import { MarketType } from "../../state/common/hooks/useFetchAllMarkets";

interface AssetTvlProps extends DisplayPercentageProps {
  asset: Address;
  marketType: MarketType | undefined;
}

const StrategyTvl: React.FC<{ asset: Address }> = ({ asset, ...rest }) => {
  const strategies = ilmAssetStrategiesMap.get(asset) as StrategyData[];

  const {
    data: { dollarAmount },
    isLoading,
    isFetched,
  } = useFetchViewDetailEquity(strategies[strategies?.length - 1].address);

  return <DisplayMoney isLoading={isLoading} isFetched={isFetched} {...dollarAmount} {...rest} />;
};

const LendingTvl: React.FC<{ asset: Address }> = ({ asset, ...rest }) => {
  const {
    data: {
      totalSupplied: { dollarAmount },
    },
    isLoading,
    isFetched,
  } = useFetchViewDetailTotalSupplied(asset);

  return <DisplayMoney isLoading={isLoading} isFetched={isFetched} {...rest} {...dollarAmount} />;
};

const StakingTvl: React.FC<{ asset: Address }> = ({ asset, ...rest }) => {
  const { data: detailTotalStaked, isLoading, isFetched } = useFetchViewDetailTotalStaked(asset);

  return <DisplayMoney isLoading={isLoading} isFetched={isFetched} {...rest} {...detailTotalStaked.dollarAmount} />;
};

export const AssetTvl: React.FC<AssetTvlProps> = ({ asset, marketType, ...rest }) => {
  switch (marketType) {
    case MarketType.Strategy:
      return <StrategyTvl asset={asset} {...rest} />;
    case MarketType.Lending:
      return <LendingTvl asset={asset} {...rest} />;
    case MarketType.Staking:
      return <StakingTvl asset={asset} {...rest} />;
  }
};
