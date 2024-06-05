import { Address } from "viem";
import {
  DecimalsOptions,
  FetchBigInt,
  FetchData,
  ViewBigInt,
  fFetchBigIntStructured,
  formatFetchBigIntToViewBigInt,
  mergeQueryStates,
  useSeamlessContractRead,
  useToken,
} from "../../../../shared";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";
import { useAccount } from "wagmi";

export const useFetchUserStakedBalance = (stakingToken?: Address): FetchData<FetchBigInt | undefined> => {
  const account = useAccount();

  const { data: tokenData, ...tokenRest } = useToken(stakingToken);

  const { data: stakedBalance, ...rest } = useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getUserStakedBalance",
    args: [account.address!, stakingToken!],
    query: {
      enabled: !!account?.address && !!stakingToken,
    },
  });

  return {
    ...mergeQueryStates([tokenRest, rest]),
    data: fFetchBigIntStructured(stakedBalance, tokenData?.decimals, tokenData?.symbol),
  };
};

export const useFetchViewUserStakedBalance = (
  stakingToken: Address | undefined,
  decimalsOptions?: Partial<DecimalsOptions>
): FetchData<ViewBigInt | undefined> => {
  const { data, ...rest } = useFetchUserStakedBalance(stakingToken);

  return {
    ...rest,
    data: formatFetchBigIntToViewBigInt(data, decimalsOptions),
  };
};
