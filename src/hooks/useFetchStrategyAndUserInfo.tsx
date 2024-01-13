import { useAccount, useReadContracts } from "wagmi";
import {
  convertRatioToMultiple,
  formatBigIntOnTwoDecimals,
} from "../utils/helpers";
import {
  aaveOracleAbi,
  aaveOracleAddress,
  cbEthAbi,
  cbEthAddress,
  loopStrategyAbi,
  loopStrategyAddress,
} from "../generated";
import { ONE_ETHER } from "../utils/constants";

function useFetchStrategyInfoForAccount(account: any) {
  let targetMultiple, userEquity, userEquityUSD, userBalance, userBalanceUSD;
  // if (account) {
  const { data: results, isLoading } = useReadContracts({
    contracts: [
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "getCollateralRatioTargets",
      },
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "balanceOf",
        args: [account.address],
      },
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "totalSupply",
      },
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "equity",
      },
      {
        address: loopStrategyAddress,
        abi: loopStrategyAbi,
        functionName: "equityUSD",
      },
      {
        address: cbEthAddress,
        abi: cbEthAbi,
        functionName: "balanceOf",
        args: [account.address],
      },
      {
        address: aaveOracleAddress,
        abi: aaveOracleAbi,
        functionName: "getAssetPrice",
        args: [cbEthAddress],
      },
    ],
  });
  console.log("isLoading", isLoading);

  if (results) {
    const collateralRatioTargets = results[0].result;
    const targetRatio = BigInt(collateralRatioTargets?.target || 0);
    targetMultiple = convertRatioToMultiple(targetRatio);

    const userShares = BigInt(results[1].result || 0);
    const totalShares = BigInt(results[2].result || 0);

    const equity = BigInt(results[3].result || 0);
    const equityUSD = BigInt(results[4].result || 0);

    userEquity = (equity * userShares) / totalShares;
    userEquityUSD = (equityUSD * userShares) / totalShares;

    userBalance = BigInt(results[5].result || 0);
    userBalanceUSD = (userBalance * BigInt(results[6].result || 0)) / ONE_ETHER;
    // }
  }

  return {
    isLoading,
    targetMultiple,
    userEquity,
    userEquityUSD,
    userBalance,
    userBalanceUSD,
  };
}

export const useFetchStrategyAndUserInfo = () => {
  const account = useAccount();
  const {
    isLoading,
    targetMultiple,
    userEquity,
    userEquityUSD,
    userBalance,
    userBalanceUSD,
  } = useFetchStrategyInfoForAccount(account);
  console.log("isLoading", isLoading);

  return {
    isLoading,
    targetMultiple: formatBigIntOnTwoDecimals(targetMultiple, 8),
    userEquity: formatBigIntOnTwoDecimals(userEquity, 18),
    userEquityUSD: formatBigIntOnTwoDecimals(userEquityUSD, 8),
    userBalance: formatBigIntOnTwoDecimals(userBalance, 18),
    userBalanceUSD: formatBigIntOnTwoDecimals(userBalanceUSD, 8),
  };
};
