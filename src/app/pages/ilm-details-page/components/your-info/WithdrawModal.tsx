import { useEffect } from "react";
import { Address, parseUnits } from "viem";
import { useAccount } from "wagmi";
import {
  Button,
  DisplayMoney,
  DisplayTokenAmount,
  FlexCol,
  FlexRow,
  Modal,
  MyFormProvider,
  Typography,
} from "../../../../../shared";
import { useForm } from "react-hook-form";
import AmountInputWrapper from "./amount-input/AmountInputWrapper";
import { ilmStrategies } from "../../../../state/loop-strategy/config/StrategyConfig";
import { useWriteStrategyWithdraw } from "../../../../state/loop-strategy/hooks/useWriteStrategyWithdraw";
import { useFetchViewPreviewWithdraw } from "../../../../state/loop-strategy/hooks/useViewFetchPreviewWithdraw";
import { useFetchShareValue } from "../../../../state/common/hooks/useFetchShareValue";
import { useWrappedDebounce } from "../../../../state/common/hooks/useWrappedDebounce";

export interface WithdrawModalFormData {
  amount: string;
}

interface WithdrawModalProps {
  id: number;
}

export const WithdrawModal = ({ id }: WithdrawModalProps) => {
  const strategyConfig = ilmStrategies[id];
  const account = useAccount();

  const { shareValueInUsd } = useFetchShareValue(strategyConfig);
  const {
    isPending: isWithdrawPending,
    isSuccess: isWithdrawSuccessful,
    withdrawAsync,
  } = useWriteStrategyWithdraw(id);

  // FORM //
  const methods = useForm<WithdrawModalFormData>({
    defaultValues: {
      amount: "",
    },
  });
  const { handleSubmit, watch, reset } = methods;
  const amount = watch("amount");
  const { debouncedAmount, debouncedAmountInUsd } = useWrappedDebounce(
    amount,
    shareValueInUsd,
    500
  );

  const { data: previewWithdrawData } = useFetchViewPreviewWithdraw(
    id,
    debouncedAmount
  );

  const onSubmitAsync = async (data: WithdrawModalFormData) => {
    if (previewWithdrawData) {
      await withdrawAsync(
        parseUnits(data.amount, 18),
        account.address as Address,
        account.address as Address,
        previewWithdrawData?.minReceivingAmount
      );
    }
  };

  useEffect(() => {
    if (isWithdrawSuccessful) {
      reset();
    }
  }, [isWithdrawSuccessful, reset]);

  return (
    <MyFormProvider methods={methods} onSubmit={handleSubmit(onSubmitAsync)}>
      <Modal header="Withdraw cbETH" buttonText="Withdraw" onClose={reset}>
        <div className="flex flex-col gap-4">
          <FlexCol>
            <Typography type="description">Amount</Typography>
            <AmountInputWrapper
              assetAddress={strategyConfig.address}
              assetSymbol={strategyConfig.symbol}
              assetLogo={strategyConfig.logo}
              debouncedAmountInUsd={debouncedAmountInUsd}
              isDepositSuccessful={isWithdrawSuccessful}
            />
          </FlexCol>

          <FlexCol>
            <Typography type="description">Transaction overview</Typography>
            <FlexCol className="border-divider border-[0.667px] rounded-md  p-3 gap-1">
              <FlexRow className="justify-between">
                <Typography type="description">Assets to receive</Typography>
                <DisplayTokenAmount
                  {...previewWithdrawData?.assetsToReceive.tokenAmount}
                  typography="description"
                />
              </FlexRow>
              <FlexRow className="justify-between">
                <Typography type="description">Value to receive</Typography>
                <DisplayMoney
                  {...previewWithdrawData?.assetsToReceive.dollarAmount}
                  typography="description"
                />
              </FlexRow>
              <FlexRow className="justify-between">
                <Typography type="description">Transaction cost</Typography>
                <DisplayMoney
                  {...previewWithdrawData?.cost.dollarAmount}
                  typography="description"
                />
              </FlexRow>
            </FlexCol>
          </FlexCol>
          <Button
            type="submit"
            loading={isWithdrawPending}
            disabled={Number(amount) <= 0}
          >
            Withdraw
          </Button>
        </div>
      </Modal>
    </MyFormProvider>
  );
};
