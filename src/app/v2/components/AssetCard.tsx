import { FlexRow, FlexCol, Typography, Icon, useFullTokenData } from "@shared";
import { Tag } from "../pages/test-page/tabs/earn-tab/Tag";
import { Address } from "viem";
import { AssetApy } from "./apy/AssetApy";
import { getSecondaryTitle, getTokenTitle } from "../../../shared/state/meta-data-queries/useTokenDescription";
import { findILMStrategyByAddress } from "../../state/loop-strategy/config/StrategyConfig";
import { GauntletOptimized } from "./specific-components/GauntletOptimized";
import { getBaseAssetConfig } from "../../state/lending-borrowing/config/BaseAssetsConfig";
import { MarketType } from "../../state/common/hooks/useFetchAllMarkets";

export interface AssetCardProps {
  address: Address;
  isStrategy: boolean;
  hideBorder?: boolean;
  apy?: string;
  incentivesButton?: React.ReactNode;
  isSelected?: boolean;
  marketType?: MarketType;
}

export const AssetCard: React.FC<AssetCardProps> = ({ address, hideBorder, isSelected, isStrategy, marketType }) => {
  const strategyIcon = isStrategy && findILMStrategyByAddress(address)?.logo;

  const {
    data: { logo: icon, name },
  } = useFullTokenData(address);
  const assetConfig = getBaseAssetConfig(address);

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
              <Typography type="bold3">{getTokenTitle(address, marketType)}</Typography>
              <Typography type="regular1">{getSecondaryTitle(address, name, marketType)}</Typography>
            </FlexCol>
            <FlexRow className="gap-2">
              <Tag marketType={marketType} />
              {assetConfig?.isGauntletOptimized && <GauntletOptimized />}
            </FlexRow>
          </FlexCol>
        </FlexRow>
        <AssetApy asset={address} marketType={marketType} typography="bold3" />
      </FlexRow>
    </div>
  );
};
