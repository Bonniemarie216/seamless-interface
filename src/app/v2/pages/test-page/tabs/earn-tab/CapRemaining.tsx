import { DisplayText, DisplayTextProps, FlexRow } from "@shared";
import React from "react";
import { useFetchViewDetailTotalSupplied } from "../../../../../state/lending-borrowing/hooks/useFetchViewDetailTotalSupplied";
import { findILMStrategyByAddress } from "../../../../../state/loop-strategy/config/StrategyConfig";
import { useFetchViewStrategyRemainingCap } from "../../../../../state/loop-strategy/queries/useFetchStrategyRemainingCap";
import { Address } from "viem";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export const CapRemaining: React.FC<{
  asset?: Address;
  marketType?: MarketType;
  textProps?: DisplayTextProps;
}> = ({
  asset,
  marketType,
  textProps = {
    typography: "medium2",
  },
}) => {
  if (marketType === MarketType.Staking) return null;

  return (
    <FlexRow className="max-w-40 md:max-w-full bg-background-capacity items-center border border-solid gap-1 px-2 py-1.5 rounded-[100px] border-metallicBorder">
      {marketType === MarketType.Lending ? (
        <RemainingCap asset={asset} {...textProps} />
      ) : (
        <StrategyRemainingCap asset={asset} {...textProps} />
      )}
    </FlexRow>
  );
};

export const RemainingCap: React.FC<{
  asset?: Address;
  textProps?: DisplayTextProps;
}> = ({ asset, textProps }) => {
  const { data: remainingCap, ...rest } = useFetchViewDetailTotalSupplied(asset);

  return (
    <DisplayText
      viewValue={`${remainingCap?.capacityRemainingPercentage?.viewValue || ""}% cap remaining`}
      {...rest}
      {...textProps}
    />
  );
};

export const StrategyRemainingCap: React.FC<{
  asset?: Address;
  textProps?: DisplayTextProps;
}> = ({ asset, textProps }) => {
  const strategy = findILMStrategyByAddress(asset);

  const { data: remainingCap, ...rest } = useFetchViewStrategyRemainingCap(strategy?.address);

  return (
    <DisplayText
      viewValue={`${remainingCap?.remainingCapPercentage?.viewValue || ""}% cap remaining`}
      {...rest}
      {...textProps}
    />
  );
};
