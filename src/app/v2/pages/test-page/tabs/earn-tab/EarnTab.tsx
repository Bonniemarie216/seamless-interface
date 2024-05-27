import { Heading } from "./Heading";
import { AssetPicker } from "../../../../components/AssetPicker";
import { assetSlugConfig } from "./config/SlugConfig";
import { useAssetPickerState } from "../../../../hooks/useAssetPickerState";
import { StrategyForm } from "../../../../components/forms/earn-forms/deposit-strategy-form/StrategyForm";
import { SupplyForm } from "../../../../components/forms/earn-forms/supply-form/SupplyForm";
import { FormSettingsProvider } from "../../../../components/forms/contexts/FormSettingsContext";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";
import { StakeForm } from "../../../../components/forms/earn-forms/stake-form/StakeForm";

export const EarnTab = () => {
  const { asset, marketType } = useAssetPickerState({ overrideUrlSlug: assetSlugConfig });

  return (
    <div className="px-4 md:px-0">
      <Heading />
      <div className="flex flex-row gap-6">
        <div className="flex-1 overflow-auto pt-6 hidden md:block">
          <AssetPicker overrideUrlSlug={assetSlugConfig} />
        </div>
        <div className="flex-1 sticky top-0 h-screen overflow-auto pt-6">
          <div className="bg-white shadow-card px-8 rounded-card py-6">
            <FormSettingsProvider defaultAsset={asset} overrideUrlSlug={assetSlugConfig}>
              {marketType == MarketType.Lending && <SupplyForm />}
              {marketType == MarketType.Strategy && <StrategyForm />}
              {marketType == MarketType.Staking && <StakeForm />}
            </FormSettingsProvider>
          </div>
        </div>
      </div>
    </div>
  );
};
