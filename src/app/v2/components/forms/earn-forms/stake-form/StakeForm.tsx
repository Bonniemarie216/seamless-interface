import { useForm } from "react-hook-form";
import {
  useFullTokenData,
  MyFormProvider,
  FlexCol,
  Typography,
  WatchAssetComponentv2,
  useNotificationContext,
  useToken,
  FlexRow,
} from "../../../../../../shared";
import { FormButtons } from "./FormButtons";
import { DepositModalFormData } from "../../../../../v1/pages/ilm-details-page/components/your-info/deposit/DepositModal";
import { Tag } from "../../../../pages/test-page/tabs/earn-tab/Tag";
import { useFormSettingsContext } from "../../contexts/useFormSettingsContext";
import { RHFSupplyAmountField } from "./RHFSupplyAmountField";
import { useFetchViewMaxUserReserveDeposit } from "../../../../../state/lending-borrowing/hooks/useFetchViewMaxReserveDeposit";
import { getOverridenName } from "../../../../../../shared/state/meta-data-queries/useTokenDescription";
import { GauntletOptimized } from "../../../specific-components/GauntletOptimized";
import { getBaseAssetConfig } from "../../../../../state/lending-borrowing/config/BaseAssetsConfig";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";
import { Summary } from "./Summary";
import { Notice } from "./Notice";
import { useMutateStake } from "../../../../../state/staking/mutations/useMutateStake";
import { useFetchStakedTokenAddress } from "../../../../../state/staking/queries/useFetchStakedTokenAddress";

export const StakeForm = () => {
  const { asset, onTransaction, hideTag, overrideUrlSlug, disableAssetPicker } = useFormSettingsContext();

  const { data: tokenData } = useFullTokenData(asset);
  const assetConfig = getBaseAssetConfig(asset);

  const { data: stakedTokenAddress } = useFetchStakedTokenAddress(asset);
  const { data: stakedTokenData } = useToken(stakedTokenAddress);

  const methods = useForm({
    defaultValues: {
      amount: "",
    },
  });
  const { handleSubmit, reset } = methods;

  const { showNotification } = useNotificationContext();

  const { stakeAsync } = useMutateStake(asset);

  const maxUserDepositData = useFetchViewMaxUserReserveDeposit(asset);

  const onSubmitAsync = async (data: DepositModalFormData) => {
    await stakeAsync(
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
                  You Staked {data.amount} {tokenData.symbol}
                </Typography>
                {stakedTokenAddress && (
                  <WatchAssetComponentv2
                    {...stakedTokenData}
                    logo={tokenData.logo}
                    symbol={stakedTokenData.symbol || ""}
                    address={stakedTokenAddress}
                  />
                )}
              </FlexCol>
            ),
          });
        },
        onSettled: () => {
          onTransaction?.();
          reset();
        },
      }
    );
  };

  return (
    <MyFormProvider methods={methods} onSubmit={handleSubmit(onSubmitAsync)}>
      <FlexCol className="gap-8">
        <FlexCol className="gap-6">
          <FlexRow className="justify-between items-start">
            <FlexCol className="gap-1 min-h-14 w-full">
              <Typography type="bold4">
                {asset
                  ? getOverridenName(asset, tokenData?.name, MarketType.Staking)
                  : "Select strategy to get started"}
              </Typography>
              <Typography type="regular3">{tokenData?.name}</Typography>
            </FlexCol>

            <FlexRow className="gap-1 items-center">
              {asset != null && !hideTag && <Tag marketType={MarketType.Staking} />}

              {assetConfig?.isGauntletOptimized && <GauntletOptimized className="pr-4" />}
            </FlexRow>
          </FlexRow>
          <RHFSupplyAmountField
            overrideUrlSlug={disableAssetPicker ? undefined : overrideUrlSlug}
            assetAddress={disableAssetPicker ? asset : undefined}
            protocolMaxValue={maxUserDepositData ? { ...maxUserDepositData } : undefined}
            name="amount"
          />
        </FlexCol>

        {asset && <Summary />}
        {asset && <Notice />}
        {asset && <FormButtons />}
      </FlexCol>
    </MyFormProvider>
  );
};
