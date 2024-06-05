import { DisplayPercentage, FlexRow, Tooltip, Icon, ViewNumber, useToken } from "@shared";
import { ViewRewardToken } from "../../../v1/pages/ilm-page/hooks/useFetchViewBaseAsset";
import { Address } from "viem";
import { MarketType } from "../../../state/common/hooks/useFetchAllMarkets";
import { useFetchViewSupplyIncentives } from "../../../state/lending-borrowing/hooks/useFetchViewSupplyIncentives";
import { IncentivesDetailCard } from "./IncentivesDetailCard";
import { useFetchStakingApr } from "../../../state/staking/hooks/useFetchViewStakingApr";
import { WETH_ADDRESS } from "../../../../meta";

interface IncentivesButtonProps {
  asset: Address | undefined;
  marketType?: MarketType;
  totalApr?: ViewNumber;
  rewardTokens?: ViewRewardToken[];
  isLoading?: boolean;
  isFetched?: boolean;
}

export const LendingIncentivesButton: React.FC<IncentivesButtonProps> = ({ asset }) => {
  const { data: tokenData } = useToken(asset);

  const { data: supplyIncentives, isLoading, isFetched } = useFetchViewSupplyIncentives(asset);

  if (isLoading || !isFetched) {
    return <span className="skeleton mt-[0.2px] flex w-20 h-6" />;
  }

  if (!supplyIncentives?.totalApr?.viewValue) {
    return null;
  }

  return (
    <Tooltip tooltip={<IncentivesDetailCard {...supplyIncentives} assetSymbol={tokenData.symbol} />}>
      <FlexRow className=" bg-smallElements-rewardAPY items-center gap-2 border border-solid px-2 py-1.5 rounded-[100px] border-metallicBorder">
        <FlexRow className="object-cover ">
          {supplyIncentives?.rewardTokens?.map((rewardToken, index) => {
            return (
              <Icon
                key={index}
                className={index > 0 ? "-ml-1 w-4 h-4" : "w-4 h-4"}
                src={rewardToken.logo}
                alt="reward-token-logo"
              />
            );
          })}
        </FlexRow>
        <DisplayPercentage {...supplyIncentives?.totalApr} typography="medium2" />
      </FlexRow>
    </Tooltip>
  );
};

export const StakingIncentivesButton: React.FC<IncentivesButtonProps> = ({ asset }) => {
  const { data: tokenData } = useToken(asset);

  const { data: stakingApr, isLoading, isFetched } = useFetchStakingApr(asset);

  if (isLoading || !isFetched) {
    return <span className="skeleton mt-[0.2px] flex w-20 h-6" />;
  }

  if (!stakingApr?.totalApr?.viewValue) {
    return null;
  }

  return (
    <Tooltip tooltip={<IncentivesDetailCard {...stakingApr} assetSymbol={tokenData.symbol} />}>
      <FlexRow className="bg-smallElements-rewardAPY items-center gap-2 border border-solid px-2 py-1.5 rounded-[100px] border-metallicBorder">
        <FlexRow className="object-cover ">
          {stakingApr?.rewardTokens?.map((rewardToken, index) => {
            return (
              <Icon
                key={index}
                className={index > 0 ? "-ml-1 w-4 h-4" : "w-4 h-4"}
                src={rewardToken.logo}
                alt="reward-token-logo"
              />
            );
          })}
        </FlexRow>
        <DisplayPercentage {...stakingApr?.totalApr} typography="medium2" />
      </FlexRow>
    </Tooltip>
  );
};

export const IncentivesButton: React.FC<IncentivesButtonProps> = ({ asset, marketType }) => {
  return marketType === MarketType.Lending ? (
    <LendingIncentivesButton asset={WETH_ADDRESS} />
  ) : (
    <StakingIncentivesButton asset={asset} />
  );
};
