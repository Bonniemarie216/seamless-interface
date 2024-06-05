import { useForm } from "react-hook-form";
import {
  useNotificationContext,
  FlexCol,
  FlexRow,
  MyFormProvider,
  Typography,
  useFullTokenData,
  WatchAssetComponentv2,
} from "../../../../../../shared";
import { WithdrawModalFormData } from "../../../../../v1/pages/ilm-details-page/components/your-info/withdraw/WithdrawModal";
import { FormButtons } from "./FormButtons";
import { Tag } from "../../../../pages/test-page/tabs/earn-tab/Tag";
import { RHFWithdrawAmountField } from "./RHFWithdrawAmountField";
import { useFormSettingsContext } from "../../contexts/useFormSettingsContext";
import { useMutateUnstake } from "../../../../../state/staking/mutations/useMutateUnstake";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";
import { ESSEAM_ADDRESS, SEAM_ADDRESS } from "../../../../../../meta";
import { Summary } from "./Summary";
import { Notice } from "./Notice";

export const UnstakeForm = () => {
  const { asset, onTransaction, hideTag, disableAssetPicker, overrideUrlSlug } = useFormSettingsContext();
  const receiveToken = asset == SEAM_ADDRESS ? ESSEAM_ADDRESS : asset;

  const { data: tokenData } = useFullTokenData(receiveToken);

  const {
    data: { symbol },
  } = useFullTokenData(receiveToken);

  const {
    data: { symbol: receiveTokenSymbol, decimals: receiveTokenDecimals, logo: receiveTokenLogo },
  } = useFullTokenData(receiveToken);

  const { showNotification } = useNotificationContext();

  const { unstakeAsync } = useMutateUnstake(asset);

  // FORM //
  const methods = useForm<WithdrawModalFormData>({
    defaultValues: {
      amount: "",
    },
  });
  const { handleSubmit, reset } = methods;

  const onSubmitAsync = async (data: { amount: string }) => {
    await unstakeAsync(
      {
        amount: data.amount,
      },
      {
        onSuccess: (txHash) => {
          showNotification({
            txHash,
            content: (
              <FlexCol className="w-full items-center text-center justify-center">
                <Typography>
                  You Unstaked {data.amount} {symbol}
                </Typography>
                {asset && symbol && (
                  <WatchAssetComponentv2
                    address={receiveToken}
                    decimals={receiveTokenDecimals}
                    logo={receiveTokenLogo}
                    symbol={receiveTokenSymbol}
                  />
                )}
              </FlexCol>
            ),
          });
        },
        onSettled: () => {
          reset();
          onTransaction?.();
        },
      }
    );
  };

  return (
    <MyFormProvider methods={methods} onSubmit={handleSubmit(onSubmitAsync)}>
      <FlexCol className="gap-8">
        <FlexCol className="gap-6">
          <FlexRow className="justify-between items-start">
            <FlexCol className="gap-1 min-h-14">
              <Typography type="bold4">{asset ? "Unstake" : "Select strategy to get started"}</Typography>
              <Typography type="regular3">{tokenData.name}</Typography>
            </FlexCol>

            {asset != null && !hideTag && <Tag marketType={MarketType.Staking} />}
          </FlexRow>
          <RHFWithdrawAmountField
            overrideUrlSlug={disableAssetPicker ? undefined : overrideUrlSlug}
            assetAddress={disableAssetPicker ? asset : undefined}
            name="amount"
          />
        </FlexCol>

        {asset && <Summary asset={asset} />}
        {asset && <Notice />}

        <FormButtons />
      </FlexCol>
    </MyFormProvider>
  );
};
