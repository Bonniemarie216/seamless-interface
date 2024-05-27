import { useSeamlessContractRead } from "../../../../shared";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";

export const useFetchAllStakingTokens = () => {
  return useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getStakingTokens",
  });
};
