import { parseEther } from "viem";
import { useReadAaveOracleGetAssetPrice } from "../../../generated/generated";
import { StrategyConfig, ilmStrategies } from "../config/StrategyConfig";
import { useFetchShareValue } from "../../common/hooks/useFetchShareValue";
import {
  ONE_ETHER,
  walletBalanceDecimalsOptions,
} from "../../../meta/constants";
import { formatFetchBigIntToViewBigInt } from "../../../../shared/utils/helpers";
import { ViewPreviewDeposit } from "../types/ViewPreviewDeposit";
import { Displayable } from "../../../../shared";
import { Fetch, FetchBigInt } from "src/shared/types/Fetch";
import { useBlock, useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { simulateDeposit } from "../../../../shared/utils/tenderlyBundles";

interface PreviewDeposit {
  sharesToReceive: FetchBigInt;
  sharesToReceiveInUsd: FetchBigInt;
  costInUnderlyingAsset: FetchBigInt;
  costInUsd: FetchBigInt;
}

export const useFetchPreviewDeposit = (
  strategyConfig: StrategyConfig,
  amount: string
): Fetch<PreviewDeposit> => {
  const { data: block } = useBlock();
  const account = useAccount();
  const [shares, setShares] = useState(0n);

  useEffect(() => {
    if (!block || !block.number || !account.address) return;

    simulateDeposit(account.address, amount, strategyConfig, block.number).then(
      (result) => {
        result.isSuccess && setShares(result.sharesToReceive);
      }
    );
  }, [amount, block]);

  const {
    isLoading: isShareValueLoading,
    isFetched: isShareValueFetched,
    shareValueInUsd,
    shareValueInUnderlyingAsset,
  } = useFetchShareValue(strategyConfig);

  const {
    isLoading: isAssetPriceLoading,
    isFetched: isAssetPriceFetched,
    data: assetPrice,
  } = useReadAaveOracleGetAssetPrice({
    args: [strategyConfig.underlyingAsset.address],
  });

  let sharesToReceive, sharesToReceiveInUsd, costInUnderlyingAsset, costInUsd;
  if (shares && shareValueInUsd) {
    sharesToReceive = shares;
    sharesToReceiveInUsd = (sharesToReceive * shareValueInUsd) / ONE_ETHER;

    costInUnderlyingAsset =
      parseEther(amount) -
      (sharesToReceive * (shareValueInUnderlyingAsset || 0n)) / ONE_ETHER;
    costInUsd = (costInUnderlyingAsset * (assetPrice || 0n)) / ONE_ETHER;
  }

  return {
    isLoading: isShareValueLoading || isAssetPriceLoading,
    isFetched: isShareValueFetched && isAssetPriceFetched,
    sharesToReceive: {
      bigIntValue: sharesToReceive || 0n,
      decimals: 18,
      symbol: strategyConfig.symbol,
    },
    sharesToReceiveInUsd: {
      bigIntValue: sharesToReceiveInUsd || 0n,
      decimals: 8,
      symbol: "$",
    },
    costInUnderlyingAsset: {
      bigIntValue: costInUnderlyingAsset || 0n,
      decimals: 18,
      symbol: strategyConfig.underlyingAsset.symbol,
    },
    costInUsd: {
      bigIntValue: costInUsd || 0n,
      decimals: 8,
      symbol: "$",
    },
  };
};

export const useFetchViewPreviewDeposit = (
  id: number,
  amount: string
): Displayable<ViewPreviewDeposit> => {
  const {
    isLoading,
    isFetched,
    sharesToReceive,
    sharesToReceiveInUsd,
    costInUnderlyingAsset,
    costInUsd,
  } = useFetchPreviewDeposit(ilmStrategies[id], amount);

  return {
    isLoading: isLoading,
    isFetched: isFetched,
    data: {
      sharesToReceive: {
        tokenAmount: formatFetchBigIntToViewBigInt(
          sharesToReceive,
          walletBalanceDecimalsOptions
        ),
        dollarAmount: formatFetchBigIntToViewBigInt(
          sharesToReceiveInUsd,
          walletBalanceDecimalsOptions
        ),
      },
      cost: {
        tokenAmount: formatFetchBigIntToViewBigInt(
          costInUnderlyingAsset,
          walletBalanceDecimalsOptions
        ),
        dollarAmount: formatFetchBigIntToViewBigInt(
          costInUsd,
          walletBalanceDecimalsOptions
        ),
      },
    },
  };
};
