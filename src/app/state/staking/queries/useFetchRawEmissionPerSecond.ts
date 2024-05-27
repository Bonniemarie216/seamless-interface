import { Address } from "viem";
import { useSeamlessContractRead } from "../../../../shared";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";

export const useFetchRawEmissionPerSecond = (stakingToken?: Address, rewardToken?: Address) => {
  return useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getRewardTokenConfig",
    args: [stakingToken!, rewardToken!],
    query: {
      enabled: !!stakingToken && !!rewardToken,
    },
  });
};
