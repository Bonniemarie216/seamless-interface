
import { Abi, ContractFunctionName, ContractFunctionArgs } from "viem";
import { rainbowConfig } from "../config/rainbow.config";
import { readContract, ReadContractParameters, ReadContractReturnType } from "wagmi/actions";

export async function readContractAsync<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
>(
  parameters: ReadContractParameters<abi, functionName, args>,
): Promise<ReadContractReturnType<abi, functionName, args>> {

  const result = readContract(rainbowConfig, { ...parameters });

  return {
    ...result,
  };
}