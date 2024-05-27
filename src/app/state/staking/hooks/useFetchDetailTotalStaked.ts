import { Address } from "viem";
import { useFetchTotalStaked } from "../queries/useFetchViewTotalStaked";
import { useFetchAssetPrice } from "../../common/queries/useFetchViewAssetPrice";
import {
  Displayable,
  FetchBigInt,
  FetchData,
  fFetchBigIntStructured,
  formatFetchBigIntToViewBigInt,
  mergeQueryStates,
} from "../../../../shared";
import { ViewDetailTotalStaked } from "../types/ViewDetailTotalStaked";

const cTotalStakedUsd = (totalStaked?: bigint, price?: bigint, tokenDecimals?: number): bigint | undefined => {
  if (totalStaked == null || price == null || tokenDecimals == null) return undefined;

  return (totalStaked * price) / BigInt(10 ** tokenDecimals);
};

interface FetchDetailTotalStaked {
  totalStaked: FetchBigInt | undefined;
  totalStakedUsd: FetchBigInt | undefined;
}

export const useFetchDetailTotalStaked = (stakingToken?: Address): FetchData<FetchDetailTotalStaked> => {
  const { data: totalStaked, ...restTotalStaked } = useFetchTotalStaked(stakingToken);

  const { data: price, ...restPrice } = useFetchAssetPrice({ asset: stakingToken });

  const totalStakedUsd = cTotalStakedUsd(totalStaked?.bigIntValue, price?.bigIntValue, totalStaked?.decimals);

  return {
    ...mergeQueryStates([restTotalStaked, restPrice]),
    data: {
      totalStaked,
      totalStakedUsd: fFetchBigIntStructured(totalStakedUsd, 8, "$"),
    },
  };
};

export const useFetchViewDetailTotalStaked = (stakingToken: Address): Displayable<ViewDetailTotalStaked> => {
  const { data, ...rest } = useFetchDetailTotalStaked(stakingToken);

  return {
    ...rest,
    data: {
      tokenAmount: formatFetchBigIntToViewBigInt(data.totalStaked),
      dollarAmount: formatFetchBigIntToViewBigInt(data.totalStakedUsd),
    },
  };
};
