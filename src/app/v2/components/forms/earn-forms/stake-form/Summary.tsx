import { FlexCol, FlexRow, Typography } from "@shared";
import { useFormSettingsContext } from "../../contexts/useFormSettingsContext";
import { AssetApr } from "../../../apy/AssetApr";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const Summary = () => {
  const { asset } = useFormSettingsContext();

  return (
    <FlexCol className="rounded-card bg-background-selected p-6 gap-4">
      <Typography type="bold3">Summary</Typography>
      <FlexRow className="text-navy-600 justify-between">
        <Typography type="bold2">Rewards APR</Typography>
        <AssetApr asset={asset} marketType={MarketType.Staking} />
      </FlexRow>
    </FlexCol>
  );
};
