import { Address, erc20Abi } from "viem";
import { useFetchAllRewardTokens } from "../queries/useFetchAllRewardTokens";
import { readContract } from "wagmi/actions";
import { Config, useConfig } from "wagmi";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";
import { useQuery } from "@tanstack/react-query";
import { mergeQueryStates } from "../../../../shared";

interface Token {
  address: Address;
  symbol: string;
  decimals: number;
}

export interface Emission {
  rewardToken: Token;
  emissionPerSecond: bigint;
}

const fetchRewardTokensEmissions = async (
  config: Config,
  stakingToken?: Address,
  rewardTokens?: Address[]
): Promise<Emission[] | undefined> => {
  if (!stakingToken || !rewardTokens) return undefined;

  const emissions: Emission[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const rewardToken of rewardTokens) {
    // eslint-disable-next-line no-await-in-loop
    const rewardTokenConfig = await readContract(config, {
      address: stakingManagerAddress,
      abi: stakingManagerAbi,
      functionName: "getRewardTokenConfig",
      args: [stakingToken, rewardToken],
    });

    // eslint-disable-next-line no-await-in-loop
    const symbol = await readContract(config, {
      address: rewardToken,
      abi: erc20Abi,
      functionName: "symbol",
    });

    // eslint-disable-next-line no-await-in-loop
    const decimals = await readContract(config, {
      address: rewardToken,
      abi: erc20Abi,
      functionName: "decimals",
    });

    // TODO: Filter if emission is 0, emission is not started or emission has ended
    emissions.push({
      rewardToken: {
        address: rewardToken,
        symbol,
        decimals,
      },
      emissionPerSecond: rewardTokenConfig.emissionPerSecond,
    });
  }

  return emissions;
};

export const useFetchRewardTokensEmissions = (stakingToken?: Address) => {
  const config = useConfig();

  const { data: rewardTokens, ...rewardTokensRest } = useFetchAllRewardTokens(stakingToken);

  const { data: emissions, ...emissionsRest } = useQuery({
    queryFn: () => fetchRewardTokensEmissions(config, stakingToken, rewardTokens as Address[]),
    queryKey: ["fetchRewardTokensEmissions", stakingToken, rewardTokens],
    enabled: !!rewardTokens,
  });

  return {
    ...mergeQueryStates([rewardTokensRest, emissionsRest]),
    data: emissions,
  };
};
