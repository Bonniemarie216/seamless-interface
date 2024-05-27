import { SeamlessWriteAsyncParams, useSeamlessContractWrite, useToken } from "@shared";
import { stakingManagerConfig } from "@generated";
import { Address, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { useFetchUserStakedBalance } from "../queries/useFetchViewUserStakedBalance";

export const useMutateUnstake = (asset?: Address) => {
  // meta data
  const { address } = useAccount();

  const {
    data: { decimals },
  } = useToken(asset);

  // cache data
  const { queryKey: userStakedBalanceQK } = useFetchUserStakedBalance(asset);

  // hook call
  const { writeContractAsync, ...rest } = useSeamlessContractWrite({
    queriesToInvalidate: [userStakedBalanceQK],
  });

  // mutation wrapper
  const unstakeAsync = async (
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
        functionName: "unstake",
        args: [asset, parseUnits(args.amount, decimals), address as Address],
      },
      { ...settings }
    );
  };

  return { ...rest, isSupplyPending: rest.isPending, unstakeAsync };
};
