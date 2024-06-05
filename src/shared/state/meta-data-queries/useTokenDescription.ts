import { Address } from "viem";
import {
  AERO_ADDRESS,
  BRETT_ADDRESS,
  CBETH_ADDRESS,
  DAI_ADDRESS,
  DEGEN_ADDRESS,
  SEAM_ADDRESS,
  USDBC_ADDRESS,
  USDC_ADDRESS,
  WETH_ADDRESS,
  WSTETH_ADDRESS,
} from "@meta";
import { MarketType } from "../../../app/state/common/hooks/useFetchAllMarkets";

export interface FullTokenData {
  description?: string;
}

interface ITokenDescriptionDict {
  [address: Address]: {
    lendingTitle: string;
    strategyTitle: string;
    strategyDescription?: string;
    description: string;
    secondaryStrategyTitle?: string;
    stakingTitle?: string;
    secondaryStakingTitle?: string;
    stakingDescription?: string;
  };
}

export const TokenDescriptionDict: ITokenDescriptionDict = {
  [WETH_ADDRESS]: {
    lendingTitle: "Supply WETH",
    strategyTitle: "Multiply ETH Long",
    secondaryStrategyTitle: "Increase ETH price exposure",
    strategyDescription:
      "This Integrated Liquidity Market (ILM) uses ETH deposits to borrow USDC, which is used to purchase more ETH to achieve the targeted multiple",
    description: "Wrapped Ethereum (WETH) allows Ethereum to be traded & used directly in smart contracts.",
  },
  [WSTETH_ADDRESS]: {
    lendingTitle: "Supply wstETH",
    strategyTitle: "Boost wstETH",
    secondaryStrategyTitle: "Increase ETH staking rewards automatically",
    strategyDescription:
      "This Integrated Liquidity Market (ILM) uses wstETH deposits to borrow ETH, which is used to purchase more wstETH to achieve the targeted multiple.",
    description:
      "wstETH is a wrapped version of stETH. Due to the nature of Lido, the amount of stETH on your balance is not constant - it changes daily as staking rewards come in.",
  },
  [CBETH_ADDRESS]: {
    lendingTitle: "Supply cbETH",
    strategyTitle: "Multiply cbETH staking rewards",
    description: "Coinbase ETH (cbETH) represents Ethereum staked through Coinbase, earning interest over time.",
  },
  [USDBC_ADDRESS]: {
    lendingTitle: "Supply USDbC",
    strategyTitle: "Multiply USDbC staking rewards",
    description: "USD Base Coin (USDbC) is a stablecoin pegged to the USD, providing a stable value for transactions.",
  },
  [DAI_ADDRESS]: {
    lendingTitle: "Supply DAI",
    strategyTitle: "Multiply DAI staking rewards",
    description: "Dai is a decentralized, unbiased, collateral-backed cryptocurrency soft-pegged to the US Dollar.",
  },
  [USDC_ADDRESS]: {
    lendingTitle: "Supply USDC",
    strategyTitle: "Multiply USDC staking rewards",
    description: "USD Coin (USDC) is a digital stablecoin that is pegged to the United States dollar.",
  },
  [SEAM_ADDRESS]: {
    lendingTitle: "Supply SEAM",
    strategyTitle: "Multiply SEAM staking rewards",
    description: "SEAM is the fair launch utility governance token of Seamless Protocol.",
    stakingTitle: "Convert SEAM into esSEAM",
    secondaryStakingTitle:
      "Lock your SEAM into escrowed SEAM for additional rewards. esSEAM unlocks back into SEAM linearly over 12 months",
    stakingDescription:
      "Lock your SEAM into escrowed SEAM for additional rewards. esSEAM unlocks back into SEAM linearly over 12 months",
  },
  [DEGEN_ADDRESS]: {
    lendingTitle: "Supply DEGEN",
    strategyTitle: "Multiply Degen staking rewards",
    description:
      "DEGEN is dubbed as the unofficial token created for the Farcaster community, a decentralized social network.",
  },
  [AERO_ADDRESS]: {
    lendingTitle: "Supply AERO",
    strategyTitle: "Multiply AERO staking rewards",
    description: "AERO is a central trading and liquidity marketplace on Base.",
  },
  [BRETT_ADDRESS]: {
    lendingTitle: "Supply BRETT",
    strategyTitle: "Multiply BRETT staking rewards",
    description: "BRETT is PEPE's best friend on Base.",
  },
};

export const getTokenDescription = (
  token: Address | undefined,
  marketType: MarketType | undefined
): string | undefined => {
  if (!token || !marketType) return undefined;

  switch (marketType) {
    case MarketType.Lending:
      return TokenDescriptionDict[token]?.description;
    case MarketType.Strategy:
      return TokenDescriptionDict[token]?.strategyDescription;
    case MarketType.Staking:
      return TokenDescriptionDict[token]?.stakingDescription;
    default:
      return undefined;
  }
};

export const getTokenTitle = (token: Address, marketType?: MarketType): string | undefined => {
  const dictElem = TokenDescriptionDict[token];

  switch (marketType) {
    case MarketType.Lending:
      return dictElem?.lendingTitle;
    case MarketType.Strategy:
      return dictElem?.strategyTitle;
    case MarketType.Staking:
      return dictElem?.stakingTitle;
    default:
      return undefined;
  }
};

export const getSecondaryTitle = (token?: Address, tokenName?: string, marketType?: MarketType): string | undefined => {
  if (!token) return tokenName;

  const dictElem = TokenDescriptionDict[token];

  switch (marketType) {
    case MarketType.Lending:
      return tokenName;
    case MarketType.Strategy:
      return dictElem?.secondaryStrategyTitle;
    case MarketType.Staking:
      return dictElem?.secondaryStakingTitle;
    default:
      return undefined;
  }
};

export const getOverridenName = (token: Address, name?: string, marketType?: MarketType) => {
  switch (marketType) {
    case MarketType.Lending:
      return name;
    case MarketType.Strategy:
      return TokenDescriptionDict[token]?.secondaryStrategyTitle;
    case MarketType.Staking:
      return TokenDescriptionDict[token]?.stakingTitle;
    default:
      return undefined;
  }
};

export const getHeaderTitle = (token: Address, tokenName?: string, marketType?: MarketType) => {
  const dictElem = TokenDescriptionDict[token];

  switch (marketType) {
    case MarketType.Lending:
      return tokenName;
    case MarketType.Strategy:
      return dictElem?.strategyTitle;
    case MarketType.Staking:
      return dictElem?.stakingTitle;
    default:
      return undefined;
  }
};
