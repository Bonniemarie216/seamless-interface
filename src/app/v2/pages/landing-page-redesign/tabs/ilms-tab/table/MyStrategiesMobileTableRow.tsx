import { Address } from "viem";
import { FlexRow, FlexCol, Icon, Typography } from "@shared";
import { Tag } from "../../../../../components/asset-data/Tag";
import { RandomNumber } from "../../../../../components/specific-components/RandomNumber";
import polygonSvg from "@assets/common/polygon.svg";
import { AprTooltipForMaxApy } from "../../../../../components/incentives/AprTooltipForMaxApy";
import { StrategyTvl } from "../../../../../components/asset-data/AssetTvl";
import { useFullTokenData } from "../../../../../../state/common/meta-data-queries/useFullTokenData";

export const MyStrategiesMobileTableRow: React.FC<{
  strategy: Address;
  hideBorder?: boolean;
}> = ({ strategy }) => {
  const {
    data: { logo: icon, name, description, tags },
  } = useFullTokenData(strategy);

  return (
    <div className="flex md:hidden flex-col bg-white shadow rounded-lg p-4 m-2">
      <FlexCol className="items-end mb-[-10px]">
        <FlexRow>{tags?.map((tag) => <Tag key={tag} tag={tag} />)}</FlexRow>
      </FlexCol>
      <FlexRow className="items-center mb-4">
        <FlexRow className="gap-4 items-center">
          <Icon width={40} src={icon} alt="logo" />
          <FlexCol className="gap-1 text-start">
            <Typography type="bold3">{name}</Typography>
            <Typography type="regular1">{description}</Typography>
          </FlexCol>
        </FlexRow>
      </FlexRow>

      <FlexRow className="justify-between">
        <FlexCol className="gap-2">
          <AprTooltipForMaxApy asset={strategy} isStrategy />
        </FlexCol>

        <FlexCol className="items-end text-end gap-2">
          <FlexRow className="items-center gap-1">
            <Typography type="regular1">30d historical return: </Typography>
            <FlexRow className="items-center gap-1">
              <Icon src={polygonSvg} alt="polygon" width={12} height={12} />
              <RandomNumber typography="bold3" className="text-successv2-900" symbol="%" symbolPosition="after" />
            </FlexRow>
          </FlexRow>
          <FlexRow className="items-center gap-1">
            <Typography type="regular1">TVL: </Typography>
            <StrategyTvl subStrategy={strategy} />
          </FlexRow>
        </FlexCol>
      </FlexRow>
    </div>
  );
};
