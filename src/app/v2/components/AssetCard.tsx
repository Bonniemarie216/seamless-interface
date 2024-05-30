import { FlexRow, FlexCol, Typography, Icon, useFullTokenData } from "@shared";
import { Tag } from "../pages/test-page/tabs/earn-tab/Tag";
import { Address } from "viem";
import { AssetApy } from "./AssetApy";
import { TokenDescriptionDict, getTokenTitle } from "../../../shared/state/meta-data-queries/useTokenDescription";
import { IncentivesButton } from "./IncentivesButton";
import { useFetchViewSupplyIncentives } from "../../state/lending-borrowing/hooks/useFetchViewSupplyIncentives";
import { findILMStrategyByAddress, ilmAssetStrategiesMap } from "../../state/loop-strategy/config/StrategyConfig";
import { IncentivesDetailCard } from "./IncentivesDetailCard";
import { GauntletOptimized } from "./specific-components/GauntletOptimized";
import { getBaseAssetConfig } from "../../state/lending-borrowing/config/BaseAssetsConfig";

export interface AssetCardProps {
  address: Address;
  isStrategy: boolean;
  hideBorder?: boolean;
  apy?: string;
  incentivesButton?: React.ReactNode;
  isSelected?: boolean;
}

export const AssetCard: React.FC<AssetCardProps> = ({ address, hideBorder, isSelected, isStrategy }) => {
  const strategyIcon = isStrategy && findILMStrategyByAddress(address)?.logo;
  const strategiesData = address ? ilmAssetStrategiesMap.get(address) || [] : [];

  const {
    data: { logo: icon, name, symbol },
  } = useFullTokenData(address);
  const assetConfig = getBaseAssetConfig(address);

  const { data: supplyIncentives, ...supplyRest } = useFetchViewSupplyIncentives(address);

  return (
    <div
      className={`p-6 pr-8  ${hideBorder ? "" : "border-solid border-b border-b-navy-100"}
        ${isSelected ? "bg-background-selected" : "bg-neutral-0"} cursor-pointer`}
    >
      <FlexRow className="gap-10 justify-between">
        <FlexRow className="gap-4 items-start">
          <Icon width={40} src={strategyIcon || icon} alt={strategyIcon || icon || ""} />
          <FlexCol className="gap-2 max-w-58 text-start">
            <FlexCol className="gap-[2px]">
              <Typography type="bold3">{getTokenTitle(address, isStrategy)}</Typography>
              <Typography type="regular1">
                {isStrategy ? TokenDescriptionDict[address].secondaryStrategyTitle : name}
              </Typography>
            </FlexCol>
            <FlexRow className="gap-2">
              <Tag tag={isStrategy ? "ILM" : "LEND"} />

              {assetConfig?.isGauntletOptimized && <GauntletOptimized />}
            </FlexRow>
          </FlexCol>
        </FlexRow>
        <FlexCol className="gap-1 text-center items-center">
          <FlexCol className="gap-1">
            {strategiesData?.length > 1 && isStrategy && (
              <Typography type="bold" className="text-end">
                Up To
              </Typography>
            )}
            <AssetApy asset={address} isStrategy={isStrategy} typography="bold3" />
          </FlexCol>
          {!isStrategy && (
            <IncentivesButton {...supplyIncentives} {...supplyRest}>
              <IncentivesDetailCard {...supplyIncentives} assetSymbol={symbol} />
            </IncentivesButton>
          )}
        </FlexCol>
      </FlexRow>
    </div>
  );
};
