import { Address } from "viem";
import {
  Displayable,
  FetchBigInt,
  FetchData,
  ViewBigInt,
  formatFetchBigIntToViewBigInt,
  mergeQueryStates,
  useSeamlessContractRead,
  useToken,
} from "../../../../shared";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";

export const useFetchTotalStaked = (stakingToken?: Address): FetchData<FetchBigInt> => {
  const { data: totalStaked, ...restTotalStaked } = useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getTotalStaked",
    args: [stakingToken!],
    query: {
      enabled: !!stakingToken,
    },
  });

  const { data: tokenData, ...restTokenData } = useToken(stakingToken);

  return {
    ...mergeQueryStates([restTotalStaked, restTokenData]),
    data: {
      bigIntValue: totalStaked,
      decimals: tokenData.decimals,
      symbol: tokenData.symbol,
    },
  };
};

export const useFetchViewTotalStaked = (stakingToken: Address): Displayable<ViewBigInt | undefined> => {
  const { data, ...rest } = useFetchTotalStaked(stakingToken);

  return {
    ...rest,
    data: data ? formatFetchBigIntToViewBigInt(data) : undefined,
  };
};
