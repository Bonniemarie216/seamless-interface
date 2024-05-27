import { SeamlessWriteAsyncParams, useSeamlessContractWrite, useToken } from "@shared";
import { stakingManagerConfig } from "@generated";
import { Address, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useFetchAssetBalance } from "../../common/queries/useFetchViewAssetBalance";
import { useFetchAssetAllowance } from "../../../../shared/state/queries/useFetchAssetAllowance";

export const useMutateStake = (asset?: Address) => {
  // meta data
  const { address } = useAccount();

  const {
    data: { decimals },
  } = useToken(asset);

  // cache data
  const { queryKey: accountAssetBalanceQK } = useFetchAssetBalance(asset);
  const { queryKey: assetAllowanceQK } = useFetchAssetAllowance({ asset, spender: stakingManagerConfig.address });

  // hook call
  const { writeContractAsync, ...rest } = useSeamlessContractWrite({
    queriesToInvalidate: [accountAssetBalanceQK, assetAllowanceQK],
  });

  // mutation wrapper
  const stakeAsync = async (
    args: {
      amount: string;
    },
    settings?: SeamlessWriteAsyncParams
  ) => {
    if (!asset) {
      // eslint-disable-next-line no-console
      console.warn("asset is undefined at useMutateSupplyLending!");
      return;
    }
    if (!decimals) {
      // eslint-disable-next-line no-console
      console.warn("decimals are undefined at useMutateSupplyLending!");
      return;
    }

    await writeContractAsync(
      {
        ...stakingManagerConfig,
        functionName: "stake",
        args: [asset, parseUnits(args.amount, decimals), address as Address],
      },
      { ...settings }
    );
  };

  return { ...rest, isSupplyPending: rest.isPending, stakeAsync };
};
