import { readContract } from "wagmi/actions";
import { aaveOracleAbi, aaveOracleAddress, loopStrategyAbi } from "../../../generated";
import { Address, erc20Abi } from "viem";
import { ONE_ETHER, ONE_USD } from "@meta";
import { Config, useConfig } from "wagmi";
import { FetchBigInt } from "../../../../shared/types/Fetch";
import { formatFetchBigIntToViewBigInt } from "../../../../shared/utils/helpers";
import { Displayable, ViewBigInt } from "../../../../shared";
import { useQuery } from "@tanstack/react-query";
import { useFullTokenData } from "../meta-data-queries/useFullTokenData";
import { useFetchCoinGeckoPriceByAddress } from "../hooks/useFetchCoinGeckoPrice";
import { useStateStrategyByAddress } from "../hooks/useFetchAllAssets";

export interface AssetPrice {
  price: FetchBigInt;
}

export const fetchAssetPriceInBlock = async (
  forStrategy: boolean,
  config: Config,
  asset?: Address,
  blockNumber?: bigint,
  underlyingAsset?: Address,
): Promise<bigint | undefined> => {
  if (!asset) return undefined;

  let price = 0n;
  if (forStrategy) {
    const equityUsd = await readContract(config, {
      address: asset,
      abi: loopStrategyAbi,
      functionName: "equityUSD",
      blockNumber,
    });

    const totalSupply = await readContract(config, {
      address: asset,
      abi: erc20Abi,
      functionName: "totalSupply",
      blockNumber,
    });

    if (totalSupply !== 0n) {
      price = (equityUsd * ONE_ETHER) / totalSupply;
    }
  } else {
    price = await readContract(config, {
      address: aaveOracleAddress,
      abi: aaveOracleAbi,
      functionName: "getAssetPrice",
      args: [asset],
      blockNumber,
    });
  }

  if (underlyingAsset) {
    const underlyingPrice = await fetchAssetPriceInBlock(forStrategy, config, underlyingAsset, blockNumber);

    if (!underlyingPrice) return undefined;

    price = (price * ONE_USD) / underlyingPrice;
  }

  return price;
};

export const useFetchAssetPriceInBlock = (asset?: Address, blockNumber?: bigint, underlyingAsset?: Address) => {
  const config = useConfig();
  const { data: strategy } = useStateStrategyByAddress(asset);
  // todo is logic good here ? -> fetchAssetPriceInBlock(!!strategy
  // const strategy = ilmStrategies.find((strategy) => strategy.address === asset);

  const { data: price, ...rest } = useQuery({
    queryFn: () => fetchAssetPriceInBlock(!!strategy, config, asset, blockNumber, underlyingAsset),
    queryKey: ["fetchAssetPriceInBlock", asset, underlyingAsset, { blockNumber: blockNumber?.toString() }],
    staleTime: blockNumber ? 60 * 1000 : undefined,
    enabled: !!asset,
  });

  return {
    ...rest,
    data: {
      bigIntValue: price || 0n,
      decimals: 8,
      symbol: "$",
    },
  };
};

interface useFetchAssetPriceParams {
  asset?: Address;
  underlyingAsset?: Address;
}

export const useFetchAssetPrice = ({ asset, underlyingAsset }: useFetchAssetPriceParams) => {
  const { data: { useCoinGeckoPrice } } = useFullTokenData(asset);
  const coingeckoPrice = useFetchCoinGeckoPriceByAddress({
    address: asset,
    precision: 8,
    enabled: !!useCoinGeckoPrice,
  });

  const assetPriceInBlock = useFetchAssetPriceInBlock(
    useCoinGeckoPrice ? undefined : asset,
    undefined,
    underlyingAsset
  );

  if (useCoinGeckoPrice) {
    const { data: price, ...rest } = coingeckoPrice;

    return {
      ...rest,
      data: {
        bigIntValue: price,
        decimals: 8,
        symbol: "$",
      },
    };
  }

  return assetPriceInBlock;
};

type useFetchViewAssetPriceParams = useFetchAssetPriceParams;

export const useFetchViewAssetPrice = ({
  asset,
  underlyingAsset,
}: useFetchViewAssetPriceParams): Displayable<ViewBigInt> => {
  const { data: price, ...rest } = useFetchAssetPrice({ asset, underlyingAsset });

  return {
    ...rest,
    data: formatFetchBigIntToViewBigInt(price),
  };
};
