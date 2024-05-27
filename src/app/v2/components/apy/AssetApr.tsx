import { Address } from "viem";
import { useFetchViewSupplyIncentives } from "../../../state/lending-borrowing/hooks/useFetchViewSupplyIncentives";
import { DisplayPercentage, DisplayPercentageProps, Tooltip, useToken } from "@shared";
import { IncentivesDetailCard } from "./IncentivesDetailCard";
import { MarketType } from "../../../state/common/hooks/useFetchAllMarkets";
import { useFetchStakingApr } from "../../../state/staking/hooks/useFetchViewStakingApr";

interface AssetAprProps extends DisplayPercentageProps {
  asset?: Address;
  marketType?: MarketType;
}

export const LendingApr: React.FC<AssetAprProps> = ({ asset, ...rest }) => {
  const { data: tokenData } = useToken(asset);

  const { isLoading, isFetched, data: supplyIncentives } = useFetchViewSupplyIncentives(asset);

  return (
    <Tooltip tooltip={<IncentivesDetailCard {...supplyIncentives} assetSymbol={tokenData?.symbol} />}>
      <DisplayPercentage isLoading={isLoading} isFetched={isFetched} {...rest} {...supplyIncentives.totalApr} />
    </Tooltip>
  );
};

export const StakingApr: React.FC<AssetAprProps> = ({ asset, ...rest }) => {
  const { data: tokenData } = useToken(asset);

  const { data, isLoading, isFetched } = useFetchStakingApr(asset);

  return (
    <Tooltip tooltip={<IncentivesDetailCard {...data} assetSymbol={tokenData?.symbol} />}>
      <DisplayPercentage isLoading={isLoading} isFetched={isFetched} {...rest} {...data?.totalApr} />
    </Tooltip>
  );
};

export const AssetApr: React.FC<AssetAprProps> = ({ asset, marketType, ...rest }) => {
  return marketType === MarketType.Lending ? (
    <LendingApr asset={asset} {...rest} />
  ) : (
    <StakingApr asset={asset} {...rest} />
  );
};
