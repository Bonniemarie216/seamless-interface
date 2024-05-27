import { FlexCol, Typography, FlexRow } from "@shared";
import { Address } from "viem";
import { AssetApr } from "../../../apy/AssetApr";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const Summary: React.FC<{
  asset: Address;
}> = ({ asset }) => {
  return (
    <FlexCol className="rounded-card bg-background-selected p-6 gap-4 text-navy-600">
      <Typography type="bold3">Summary</Typography>
      <FlexRow className="text-navy-600 justify-between">
        <Typography type="bold2">Rewards APR</Typography>
        <AssetApr asset={asset} marketType={MarketType.Staking} />
      </FlexRow>
    </FlexCol>
  );
};
