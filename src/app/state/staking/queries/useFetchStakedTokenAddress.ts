import { Address } from "viem";
import { useSeamlessContractRead } from "../../../../shared";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";

export const useFetchStakedTokenAddress = (stakingToken?: Address) => {
  return useSeamlessContractRead({
    address: stakingManagerAddress,
    abi: stakingManagerAbi,
    functionName: "getStakedToken",
    args: [stakingToken!],
    query: {
      enabled: !!stakingToken,
    },
  });
};
