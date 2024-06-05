import { FlexCol, FlexRow, Icon, Typography, useFullTokenData } from "@shared";
import { getOverridenName, getTokenTitle } from "../../../../../../shared/state/meta-data-queries/useTokenDescription";
import { CurrentBalance } from "./CurrentBalance";
import { useFetchViewSupplyIncentives } from "../../../../../state/lending-borrowing/hooks/useFetchViewSupplyIncentives";
import { findILMStrategyByAddress } from "../../../../../state/loop-strategy/config/StrategyConfig";
import { AssetApy } from "../../../../components/apy/AssetApy";
import { Address } from "viem";
import { Tag } from "../earn-tab/Tag";
import { IncentivesButton } from "../../../../components/apy/IncentivesButton";
import { TableButtonsMobile } from "./TableButtonsMobile";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const MyStrategiesMobileTableRow: React.FC<{
  asset: Address;
  strategy?: Address;
  marketType: MarketType | undefined;
}> = ({ asset, strategy, marketType }) => {
  const isStrategy = !!strategy;
  const {
    data: { logo, name },
  } = useFullTokenData(asset);
  const { data: supplyIncentives, ...incentivesRest } = useFetchViewSupplyIncentives(asset);

  const strategyIcon = isStrategy && findILMStrategyByAddress(asset)?.logo;

  return (
    <div className="p-2">
      <FlexCol className="md:hidden p-3 bg-neutral-100 rounded-lg gap-1">
        <FlexRow className="justify-between items-start mb-4">
          <FlexCol className="gap-2 text-start">
            <FlexRow className="gap-2">
              <Icon width={40} src={strategyIcon || logo} alt={strategyIcon || logo || ""} />
              <FlexCol className="gap-1">
                <Typography type="bold3">{getTokenTitle(asset, marketType)}</Typography>
                <Typography type="regular1">{getOverridenName(asset, name, marketType)}</Typography>
              </FlexCol>
            </FlexRow>
          </FlexCol>
          <Tag marketType={marketType} />
        </FlexRow>
        <div className="grid grid-cols-3">
          <FlexCol className="col-span-2">
            <CurrentBalance asset={isStrategy ? strategy : asset} marketType={marketType} />
          </FlexCol>
          <FlexCol className="text-end items-end">
            <AssetApy asset={asset} marketType={marketType} typography="bold3" />
            {!strategy && <IncentivesButton asset={asset} {...supplyIncentives} {...incentivesRest} />}
          </FlexCol>
        </div>
        <div className="mt-4">
          <TableButtonsMobile asset={asset} isStrategy={isStrategy} />
        </div>
      </FlexCol>
    </div>
  );
};
