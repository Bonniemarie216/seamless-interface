import { Address } from "viem";
import { loopStrategyAbi } from "../../../generated";
import { useSeamlessContractRead } from "@shared";
import { metadataQueryConfig } from "../../settings/config";
import { readContractAsync } from "@wagmi-wrappers";

export const useFetchStrategyAssets = (strategy: Address) => {
  return useSeamlessContractRead({
    address: strategy,
    abi: loopStrategyAbi,
    functionName: "getAssets",
    query: metadataQueryConfig,
  });
};

export const fetchStrategyAssets = async (strategy: Address) => {
  return readContractAsync({
    address: strategy,
    abi: loopStrategyAbi,
    functionName: "getAssets",
  })
};

export const fetchStrategyName = async (strategy: Address) => {
  return readContractAsync({
    address: strategy,
    abi: loopStrategyAbi,
    functionName: "name",
  })
};

export const fetchStrategyAsset = async (strategy: Address) => {
  return readContractAsync({
    address: strategy,
    abi: loopStrategyAbi,
    functionName: "asset",
  })
};
