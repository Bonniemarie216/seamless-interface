import { Config, useAccount, useConfig } from "wagmi";
import { useFetchAllStakingTokens } from "../queries/useFetchAllStakingTokens";
import { Address } from "viem";
import { readContract } from "wagmi/actions";
import { stakingManagerAbi, stakingManagerAddress } from "../../../generated";
import { useQuery } from "@tanstack/react-query";
import { mergeQueryStates } from "../../../../shared";

const fetchUserStakingTokensBalances = async (
  config: Config,
  user: Address,
  allStakingTokens: readonly Address[]
): Promise<Address[]> => {
  const stakingTokens: Address[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const stakingToken of allStakingTokens) {
    // eslint-disable-next-line no-await-in-loop
    const balance = await readContract(config, {
      address: stakingManagerAddress,
      abi: stakingManagerAbi,
      functionName: "getUserStakedBalance",
      args: [user, stakingToken],
    });

    if (balance > 0n) {
      stakingTokens.push(stakingToken);
    }
  }

  return stakingTokens;
};

export const useFetchUserStakingTokens = () => {
  const config = useConfig();

  const account = useAccount();

  const { data: allStakingTokens, ...allStakingTokensRest } = useFetchAllStakingTokens();

  const { data, ...stakingTokensRest } = useQuery({
    queryKey: ["user-staking-tokens", account.address],
    queryFn: () => fetchUserStakingTokensBalances(config, account?.address!, allStakingTokens!),
    enabled: !!allStakingTokens && !!account && !!config,
  });

  return {
    ...mergeQueryStates([stakingTokensRest, allStakingTokensRest]),
    data,
  };
};
