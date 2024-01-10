import { useAccount } from "wagmi";
import { formatOnTwoDecimals, formatToNumber } from "../utils/helpers";
import { useSeamlessContractReads } from "./useSeamlessContractReads";

interface CollateralRatioTargets {
  target: string;
  maxForRebalance: string;
}

export const useFetchStrategyInfo = () => {
  const account = useAccount();
  const { data: results } = useSeamlessContractReads([
    {
      contractName: "LoopStrategy",
      functionName: "getCollateralRatioTargets",
      args: [] as never[],
    },
    {
      contractName: "LoopStrategy",
      functionName: "balanceOf",
      args: [account.address] as never[],
    },
    {
      contractName: "LoopStrategy",
      functionName: "totalSupply",
      args: [] as never[],
    },
    {
      contractName: "LoopStrategy",
      functionName: "equity",
      args: [] as never[],
    },
    {
      contractName: "LoopStrategy",
      functionName: "equityUSD",
      args: [] as never[],
    },
  ]);

  let targetMultiple, maxMultiple, userEquity, userEquityUSD;
  if (results) {
    const collateralRatioTargets = results![0]
      .result as unknown as CollateralRatioTargets;
    const targetRatio = formatToNumber(collateralRatioTargets.target, 8);
    targetMultiple = targetRatio / (targetRatio - 1);

    const maxRatio = formatToNumber(collateralRatioTargets.maxForRebalance, 8);
    maxMultiple = maxRatio / (maxRatio - 1);

    const userShares = formatToNumber(results![1].result as any as string, 18);
    const totalShares = formatToNumber(results![2].result as any as string, 18);

    const equity = formatToNumber(results![3].result as any as string, 18);
    const equityUSD = formatToNumber(results![4].result as any as string, 8);

    userEquity = equity * (userShares / totalShares);
    userEquityUSD = equityUSD * (userShares / totalShares);
  }

  return {
    targetMultiple: targetMultiple?.toString(),
    maxMultiple: maxMultiple?.toString(),
    userEquity: formatOnTwoDecimals(userEquity as number),
    userEquityUSD: formatOnTwoDecimals(userEquityUSD as number),
  };
};
