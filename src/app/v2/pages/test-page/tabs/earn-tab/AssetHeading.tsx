import { Address } from "viem";
import { FlexCol, FlexRow, Icon, Typography, useFullTokenData } from "../../../../../../shared";
import {
  getHeaderTitle,
  getTokenDescription,
} from "../../../../../../shared/state/meta-data-queries/useTokenDescription";
import { findILMStrategyByAddress } from "../../../../../state/loop-strategy/config/StrategyConfig";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const AssetHeading: React.FC<{ asset: Address; marketType?: MarketType }> = ({ asset, marketType }) => {
  const strategyLogo = findILMStrategyByAddress(asset)?.logo;

  const { data: tokenData } = useFullTokenData(asset);

  const description = getTokenDescription(asset, marketType);

  return (
    <FlexRow className="gap-6">
      <Icon width={50} alt={tokenData.symbol || ""} src={strategyLogo || tokenData.logo} className="-mt-8" />
      <FlexCol className="gap-2 min-h-24">
        <Typography type="bold5">{getHeaderTitle(asset, tokenData?.name, marketType)}</Typography>
        <Typography type="regular2">{description} </Typography>
      </FlexCol>
    </FlexRow>
  );
};
