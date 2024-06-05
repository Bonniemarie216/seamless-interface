import { Address } from "viem";
import { useFetchDetailTotalStaked } from "./useFetchDetailTotalStaked";
import { Emission, useFetchRewardTokensEmissions } from "./useFetchRewardTokensEmissions";
import { RewardToken } from "../../../../shared/utils/aaveIncentivesHelpers";
import {
  Displayable,
  ViewNumber,
  formatFetchNumberToViewNumber,
  formatIncentiveAprToViewNumber,
  formatUnitsToNumber,
  mergeQueryStates,
  normalizeDecimals,
} from "../../../../shared";
import { SECONDS_PER_YEAR, assetLogos } from "../../../../meta";
import { fetchAssetPriceInBlock } from "../../common/queries/useFetchViewAssetPrice";
import { Config, useConfig } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { ViewIncentives } from "../../lending-borrowing/types/ViewIncentives";

interface RewardTokenApr {
  symbol: string;
  logo: string;
  apr: ViewNumber;
}

interface StakingApr {
  totalApr: number;
  rewardTokensApr: RewardToken[];
}

const fetchStakingApr = async (
  config: Config,
  totalStakedUsd?: bigint,
  rewardTokensEmissions?: Emission[]
): Promise<StakingApr | undefined> => {
  if (totalStakedUsd == null || rewardTokensEmissions == null || totalStakedUsd === 0n) {
    return undefined;
  }

  let totalApr = 0;
  const rewardTokensApr: RewardTokenApr[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const rewardTokenEmission of rewardTokensEmissions) {
    // eslint-disable-next-line no-await-in-loop
    const rewardTokenPrice = await fetchAssetPriceInBlock(config, rewardTokenEmission.rewardToken.address);

    if (!rewardTokenPrice) {
      continue;
    }

    const emissionPerYear =
      normalizeDecimals(rewardTokenEmission.emissionPerSecond, BigInt(rewardTokenEmission.rewardToken.decimals), 18n) *
      BigInt(SECONDS_PER_YEAR);

    const rewardTokenApr = (emissionPerYear * rewardTokenPrice) / totalStakedUsd;
    const rewardTokenAprFormatted = formatUnitsToNumber(rewardTokenApr, 18);

    rewardTokensApr.push({
      symbol: rewardTokenEmission.rewardToken.symbol,
      logo: assetLogos.get(rewardTokenEmission.rewardToken.symbol) || "",
      apr: formatFetchNumberToViewNumber({
        value: rewardTokenAprFormatted * 100,
        symbol: "%",
      }),
    });

    totalApr += rewardTokenAprFormatted * 100;
  }

  return { totalApr, rewardTokensApr };
};

export const useFetchStakingApr = (stakingToken?: Address): Displayable<ViewIncentives | undefined> => {
  const config = useConfig();

  const { data: detailTotalStaked, ...restDetailTotalStaked } = useFetchDetailTotalStaked(stakingToken);

  const { data: rewardTokensEmissions, ...rewardTokensEmissionsRest } = useFetchRewardTokensEmissions(stakingToken);

  const { data: stakingApr, ...stakingAprRest } = useQuery({
    queryKey: ["fetchStakingApr", stakingToken || ""],
    queryFn: async () => fetchStakingApr(config, detailTotalStaked?.totalStakedUsd?.bigIntValue, rewardTokensEmissions),
    enabled: !!stakingToken && !!detailTotalStaked?.totalStakedUsd?.bigIntValue && !!rewardTokensEmissions,
  });

  return {
    ...mergeQueryStates([restDetailTotalStaked, rewardTokensEmissionsRest, stakingAprRest]),
    data: {
      rewardTokens: stakingApr?.rewardTokensApr || [],
      totalApr: formatIncentiveAprToViewNumber(stakingApr?.totalApr),
    },
  };
};
