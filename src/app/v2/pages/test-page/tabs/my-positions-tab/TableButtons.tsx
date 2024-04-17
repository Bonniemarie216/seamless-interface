import { FlexRow, Modal, ModalHandles } from '../../../../../../shared'
import { Address } from 'viem'
import { StrategyForm } from '../../../../components/forms/earn-forms/deposit-strategy-form/StrategyForm'
import { SupplyForm } from '../../../../components/forms/earn-forms/supply-form/SupplyForm'
import { useRef } from 'react'
import { EarnFormProvider } from '../../../../components/forms/earn-forms/contexts/EarnFormContext'

export const TableButtons: React.FC<{
  asset: Address;
  isStrategy: boolean;
}> = ({
  asset,
  isStrategy
}) => {
    const addModal = useRef<ModalHandles>(null);

    return (
      <FlexRow className="gap-2 text-start">
        <Modal
          ref={addModal}
          size="normal"
          buttonProps={{
            children: "Add",
            className: "text-bold3 bg-metalic text-neutral-0 rounded-[100px] p-2 px-8 items-center",
          }}
        >
          <div className='mt-[-60px]'>
            <EarnFormProvider
              defaultAsset={asset}
              onTransaction={() => { addModal.current?.close(); }}
              disableAssetPicker
              hideTag>
              {isStrategy ? <StrategyForm /> : <SupplyForm />}
            </EarnFormProvider>
          </div>
        </Modal>
        <Modal
          size="normal"
          buttonProps={{
            children: "Remove",
            className: "text-bold3 bg-transparent hover:bg-gray-100 text-metalic border border-metalic text-metalic rounded-[100px] p-2 px-8 items-center text-center",
          }}
        >
          todo: withdraw forms
        </Modal>
      </FlexRow>
    )
  }
