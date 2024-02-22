import { useWriteContract } from "wagmi";
import { ilmStrategies } from "../config/StrategyConfig";
import { Address, BaseError, ContractFunctionRevertedError } from "viem";
import { loopStrategyAbi } from "../../../generated/generated";
import { simulateContract } from "@wagmi/core";
import { rainbowConfig } from "../../../../rainbow-config";
import { err } from "pino-std-serializers";

export const useWriteStrategyDeposit = (id: number) => {
  const strategyConfig = ilmStrategies[id];
  const { isPending, isSuccess, writeContractAsync } = useWriteContract();
  // const {  } = useSimulateLendingPoolBackUnbacked({
  //   address: strategyConfig.address,
  //   abi: loopStrategyAbi,
  //   functionName: "deposit",
  //   args: [amount, address, shares],
  // });

  return {
    isPending,
    isSuccess,
    depositAsync: async (amount: bigint, address: Address, shares: bigint) => {
      try {
        await simulateContract(rainbowConfig, {
          address: strategyConfig.address,
          abi: loopStrategyAbi,
          functionName: "deposit",
          args: [amount, address, shares],
        });
      } catch (e) {
        console.log("SIMULATE ERROR--------");
        console.log({ e });
        if (err instanceof BaseError) {
          console.log({ err });
          const revertError = err.walk(
            (err) => err instanceof ContractFunctionRevertedError
          );
          if (revertError instanceof ContractFunctionRevertedError) {
            const errorName = revertError.data?.errorName ?? "";
            console.log({ errorName });
          }
        }
      }

      const result = await writeContractAsync({
        address: strategyConfig.address,
        abi: loopStrategyAbi,
        functionName: "deposit",
        args: [amount, address, shares],
      });

      return result;
    },
  };
};
