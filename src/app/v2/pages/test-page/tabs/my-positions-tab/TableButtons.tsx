import { FlexRow, Modal, ModalHandles } from "../../../../../../shared";
import { Address } from "viem";
import { StrategyForm } from "../../../../components/forms/earn-forms/deposit-strategy-form/StrategyForm";
import { SupplyForm } from "../../../../components/forms/earn-forms/supply-form/SupplyForm";
import { useRef } from "react";
import { FormSettingsProvider } from "../../../../components/forms/contexts/FormSettingsContext";
import { WithdrawStrategyForm } from "../../../../components/forms/withdraw-forms/withdraw-strategy-form/WithdrawStrategyForm";
import { WithdrawForm } from "../../../../components/forms/withdraw-forms/withdraw-form/WithdrawForm";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";
import { StakeForm } from "../../../../components/forms/earn-forms/stake-form/StakeForm";
import { UnstakeForm } from "../../../../components/forms/withdraw-forms/unstake-form/UnstakeForm";

export const TableButtons: React.FC<{
  asset: Address;
  marketType: MarketType;
}> = ({ asset, marketType }) => {
  const addModal = useRef<ModalHandles>(null);
  const removeModal = useRef<ModalHandles>(null);

  return (
    <FlexRow className="gap-2 text-start cursor-default">
      <Modal
        ref={addModal}
        size="normal"
        buttonProps={{
          children: "Add",
          className: "text-bold3 bg-metalic text-neutral-0 rounded-[100px] p-2 px-8 items-center",
        }}
      >
        <div className="mt-[-60px]">
          <FormSettingsProvider
            defaultAsset={asset}
            onTransaction={() => {
              addModal.current?.close();
            }}
            disableAssetPicker
            hideTag
          >
            {marketType == MarketType.Lending && <SupplyForm />}
            {marketType == MarketType.Strategy && <StrategyForm />}
            {marketType == MarketType.Staking && <StakeForm />}
          </FormSettingsProvider>
        </div>
      </Modal>
      <Modal
        ref={removeModal}
        size="normal"
        buttonProps={{
          children: "Remove",
          className:
            "text-bold3 bg-transparent hover:bg-gray-100 text-metalic border border-metalic text-metalic rounded-[100px] p-2 px-8 items-center text-center",
        }}
      >
        <div className="mt-[-60px]">
          <FormSettingsProvider
            defaultAsset={asset}
            onTransaction={() => {
              removeModal.current?.close();
            }}
            disableAssetPicker
            hideTag
          >
            {marketType == MarketType.Lending && <WithdrawForm />}
            {marketType == MarketType.Strategy && <WithdrawStrategyForm />}
            {marketType == MarketType.Staking && <UnstakeForm />}
          </FormSettingsProvider>
        </div>
      </Modal>
    </FlexRow>
  );
};
