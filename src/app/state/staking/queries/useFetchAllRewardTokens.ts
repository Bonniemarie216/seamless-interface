import { Address } from "viem";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";
import { useSeamlessContractRead } from "../../../../shared";

export const useFetchAllRewardTokens = (stakingToken?: Address) => {
  return useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getRewardTokens",
    args: [stakingToken!],
    query: {
      enabled: !!stakingToken,
    },
  });
};
