import React from "react";
import { AmountInput } from "./AmountInput";
import { useFetchViewAssetBalance } from "../../../../../state/common/queries/useFetchViewAssetBalance";
import { ilmStrategies } from "../../../../../state/loop-strategy/config/StrategyConfig";

interface AmountInputBoxWrapperProps {
  id: number;
  debouncedAmountInUsd: number;
}

export const AmountInputWrapper: React.FC<AmountInputBoxWrapperProps> = ({
  id,
  debouncedAmountInUsd,
}) => {
  const { symbol, logo, address: assetAddress } = ilmStrategies[id];

  // TODO: properly invallidate query!!!
  const {
    data: { balance },
  } = useFetchViewAssetBalance(assetAddress);

  return (
    <AmountInput
      walletBalance={balance}
      debouncedAmountInUsd={debouncedAmountInUsd}
      assetSymbol={symbol}
      assetLogo={logo}
      maxAssets={balance}
    />
  );
};

export default AmountInputWrapper;
