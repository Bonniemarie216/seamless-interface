import {
  Buttonv2,
  FlexCol,
  FlexRow,
  Icon,
  Modal,
  ModalHandles,
  Typography,
  WatchAssetComponent,
  useERC20Approve,
  useFullTokenData,
  useNotificationContext,
} from "@shared";

import { useAssetPickerState } from "../../../../../hooks/useAssetPickerState";
import { assetSlugConfig, earnInputConfig } from "../config/SlugConfig";
import { useFormContext } from "react-hook-form";
import { parseUnits, etherUnits } from "viem";
import { lendingPoolAddress, useReadAaveOracleGetAssetPrice } from "../../../../../../generated";
import { useWrappedDebounce } from "../../../../../../state/common/hooks/useWrappedDebounce";
import { DepositModalFormData } from "../../../../../../v1/pages/ilm-details-page/components/your-info/deposit/DepositModal";
import { useRef } from "react";
import { useMutateSupplyLending } from "../../../../../../state/lending-borrowing/mutations/useMutateSupplyLending";
import { TokenDescriptionDict } from "../../../../../../../shared/state/meta-data-queries/useTokenDescription";
import { useFetchReserveTokenAddresses } from "../../../../../../state/lending-borrowing/queries/useFetchReserveTokenAddresses";

export const SupplyModal = () => {
  const modalRef = useRef<ModalHandles>(null);

  const { asset } = useAssetPickerState({ overrideUrlSlug: assetSlugConfig });
  const { data: tokenData } = useFullTokenData(asset);
  const {
    data: { aTokenAddress },
  } = useFetchReserveTokenAddresses(asset);

  const { data: aTokenData } = useFullTokenData(aTokenAddress);

  const { showNotification } = useNotificationContext();

  const { watch } = useFormContext();
  const amount = watch(earnInputConfig.name);

  const { isApproved, isApproving, approveAsync } = useERC20Approve(
    asset,
    lendingPoolAddress,
    parseUnits(amount || "0", etherUnits.wei)
  );

  const { supplyAsync, isSupplyPending } = useMutateSupplyLending(asset);

  const { data: assetPrice } = useReadAaveOracleGetAssetPrice({
    args: [asset],
  });
  const { debouncedAmount } = useWrappedDebounce(amount, assetPrice, 500);
  console.log({ debouncedAmount });

  const onSubmitAsync = async (data: DepositModalFormData) => {
    await supplyAsync(
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
                  You Supplied {data.amount} {tokenData.symbol}
                </Typography>
                {tokenData && <WatchAssetComponent {...tokenData} symbol={tokenData.symbol || ""} address={asset} />}
              </FlexCol>
            ),
          });
        },
        onSettled: () => {
          modalRef.current?.close();
        },
      }
    );
  };

  return (
    <Modal
      ref={modalRef}
      size="normal"
      buttonProps={{
        children: "Add to strategy",
        className: "text-bold3 bg-metalic text-neutral-0 rounded-[100px] py-4 px-32 items-center text-center",
      }}
      headerComponent={
        <FlexCol className="gap-1">
          <Typography type="bold4">Add to strategy</Typography>
          <Typography type="regular3">{TokenDescriptionDict[asset].lendingTitle}</Typography>
        </FlexCol>
      }
    >
      <FlexCol className="gap-8">
        <FlexCol className="rounded-card bg-neutral-100 p-6 gap-4">
          <Typography type="bold3">Overview</Typography>

          <LocalRow label="Action">Deposit</LocalRow>
          <LocalRow label="Strategy">{TokenDescriptionDict[asset].lendingTitle}</LocalRow>
          <LocalRow label="Starting Asset">{tokenData.symbol}</LocalRow>
          <LocalRow label="Deposit Size">
            <FlexRow className="gap-1">
              {`${amount} ${tokenData.symbol}`} <Icon width={18} src={tokenData.logo} alt={tokenData.logo || ""} />
            </FlexRow>
          </LocalRow>
          <LocalRow label="Ending Asset">{aTokenData.symbol}</LocalRow>
        </FlexCol>

        <FlexCol className="gap-2">
          <Buttonv2 className="text-bold3" disabled={isApproved} loading={isApproving} onClick={approveAsync}>
            Approve
          </Buttonv2>
          <Buttonv2
            className="text-bold3"
            type="submit"
            disabled={!isApproved}
            loading={isSupplyPending}
            onClick={() =>
              onSubmitAsync({
                amount,
              })
            }
          >
            Submit
          </Buttonv2>
        </FlexCol>
      </FlexCol>
    </Modal>
  );
};

const LocalRow: React.FC<{
  label: string;
  children?: React.ReactNode;
}> = ({ label, children }) => {
  return (
    <FlexRow className="text-navy-600 justify-between">
      <Typography type="bold2">{label}</Typography>
      <Typography type="medium2" className="text-navy-1000">
        {children}
      </Typography>
    </FlexRow>
  );
};
