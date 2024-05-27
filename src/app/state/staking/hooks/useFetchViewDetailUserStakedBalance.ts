import { Address } from "viem";
import {
  FetchBigInt,
  FetchData,
  fFetchBigIntStructured,
  formatFetchBigIntToViewBigInt,
  mergeQueryStates,
} from "../../../../shared";
import { useFetchUserStakedBalance } from "../queries/useFetchViewUserStakedBalance";
import { useFetchAssetPrice } from "../../common/queries/useFetchViewAssetPrice";
import { cValueInUsd } from "../../common/math/cValueInUsd";
import { ViewDetailUserStakedBalance } from "../types/ViewDetailUserStakedBalance";

export interface DetailUserStakedBalance {
  balance: FetchBigInt | undefined;
  balanceUsd: FetchBigInt | undefined;
}

export const useFetchDetailUserStakedBalance = (
  stakingToken?: Address
): FetchData<DetailUserStakedBalance | undefined> => {
  const { data: stakedBalance, ...stakedBalanceRest } = useFetchUserStakedBalance(stakingToken);

  const { data: tokenPrice, ...priceRest } = useFetchAssetPrice({ asset: stakingToken });

  const stakedBalanceUsd = cValueInUsd(stakedBalance?.bigIntValue, tokenPrice?.bigIntValue, stakedBalance?.decimals);

  return {
    ...mergeQueryStates([stakedBalanceRest, priceRest]),
    data: {
      balance: fFetchBigIntStructured(stakedBalance?.bigIntValue, stakedBalance?.decimals, stakedBalance?.symbol),
      balanceUsd: fFetchBigIntStructured(stakedBalanceUsd, tokenPrice?.decimals, tokenPrice?.symbol),
    },
  };
};

export const useFetchViewDetailUserStakedBalance = (
  stakingToken?: Address
): FetchData<ViewDetailUserStakedBalance | undefined> => {
  const { data, ...rest } = useFetchDetailUserStakedBalance(stakingToken);

  return {
    ...rest,
    data: {
      tokenAmount: formatFetchBigIntToViewBigInt(data?.balance),
      dollarAmount: formatFetchBigIntToViewBigInt(data?.balanceUsd),
    },
  };
};
