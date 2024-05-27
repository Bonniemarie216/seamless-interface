import { Address } from "viem";
import { FlexCol, FlexRow, Icon, TableCell, TableRow, Typography, useFullTokenData } from "../../../../../../shared";
import { getOverridenName, getTokenTitle } from "../../../../../../shared/state/meta-data-queries/useTokenDescription";
import { Tag } from "../earn-tab/Tag";
import { AssetApy } from "../../../../components/apy/AssetApy";
import { CurrentBalance } from "./CurrentBalance";
import { TableButtons } from "./TableButtons";
import { findILMStrategyByAddress } from "../../../../../state/loop-strategy/config/StrategyConfig";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const MyStrategiesDesktopTableRow: React.FC<{
  asset: Address;
  marketType: MarketType;
  strategy?: Address;
  hideBorder?: boolean;
}> = ({ asset, strategy, marketType, hideBorder }) => {
  const isStrategy = !!strategy;
  const strategyIcon = isStrategy && findILMStrategyByAddress(asset)?.logo;

  const {
    data: { logo: icon, name },
  } = useFullTokenData(asset);

  return (
    <div className="hidden md:block py-4 border-solid border-b border-b-navy-100">
      <TableRow className="md:grid grid-cols-12" hideBorder={hideBorder}>
        <TableCell alignItems="items-start col-span-4">
          <FlexRow className="gap-4 items-start">
            <Icon width={40} src={strategyIcon || icon} alt={strategyIcon || icon || ""} />
            <FlexCol className="gap-2 text-start">
              <FlexCol className="gap-[2px]">
                <Typography type="bold3">{getTokenTitle(asset, marketType)}</Typography>
                <Typography type="regular1">{getOverridenName(asset, name, isStrategy)}</Typography>
              </FlexCol>
              <FlexRow>
                <Tag marketType={marketType} />
              </FlexRow>
            </FlexCol>
          </FlexRow>
        </TableCell>

        <TableCell className="col-span-2">
          <CurrentBalance asset={isStrategy ? strategy : asset} marketType={marketType} />
        </TableCell>

        <TableCell className="col-span-3">
          <AssetApy asset={asset} marketType={marketType} typography="bold3" />
        </TableCell>

        <TableCell className="col-span-3" alignItems="items-center">
          <TableButtons asset={asset} marketType={marketType} />
        </TableCell>
      </TableRow>
    </div>
  );
};
