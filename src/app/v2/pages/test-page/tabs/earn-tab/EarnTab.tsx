import { useEffect, useState } from "react";
import { Heading } from "./heading/Heading";
import { assetSlugConfig } from "./config/SlugConfig";
import { useAssetPickerState } from "../../../../hooks/useAssetPickerState";
import { FormSettingsProvider } from "../../../../components/forms/contexts/FormSettingsContext";
import { AssetPickerWithFilter } from "../../../../components/asset-picker/AssetPickerWithFilter";
import { FlexCol, Typography } from "../../../../../../shared";
import { FormCont } from "./FormCont";
import { AdditionalInfoContainer } from "./additional-info/AdditionalInfoContainer";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { FAQ } from "./additional-info/FAQ";

export const EarnTab = () => {
  const { asset } = useAssetPickerState({ overrideUrlSlug: assetSlugConfig });
  const [previousAsset, setPreviousAsset] = useState(asset);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleUncollapse = () => setIsCollapsed(false);

  useEffect(() => {
    setIsCollapsed(asset !== previousAsset);
    setPreviousAsset(asset);
  }, [asset]);

  return (
    <FormSettingsProvider overrideUrlSlug={assetSlugConfig}>
      <div className="px-4 md:px-0">
        <div className="flex flex-row gap-6">
          <div
            className={`transition-width duration-300 ease-in-out ${isCollapsed ? "w-[5%]" : "w-[30%]"} overflow-auto hidden md:block`}
          >
            {isCollapsed ? (
              <button className="w-full h-full" onClick={handleUncollapse}>
                <ArrowRightCircleIcon width={60} height={60} />
              </button>
            ) : (
              <FlexCol className="gap-3">
                <FlexCol className="gap-2 min-h-24">
                  <Typography type="bold5">Earn</Typography>
                  <Typography type="regular1">
                    Choose your strategy to earn APY. Seamless offers a wide range of options, from simple lending to
                    advanced integrated strategies (ILM)
                  </Typography>
                </FlexCol>
                <AssetPickerWithFilter overrideUrlSlug={assetSlugConfig} />
              </FlexCol>
            )}
          </div>
          <div className={`${isCollapsed ? "w-[65%]" : "w-[40%]"} overflow-auto flex flex-col gap-4`}>
            <Heading />
            {isCollapsed && (
              <FlexCol className="gap-3">
                {asset && <FAQ asset={asset} />}
                <AdditionalInfoContainer />
              </FlexCol>
            )}
          </div>
          <div className="w-[30%] flex flex-col gap-4 overflow-auto">
            <FormCont asset={asset} />
          </div>
        </div>
      </div>
    </FormSettingsProvider>
  );
};
