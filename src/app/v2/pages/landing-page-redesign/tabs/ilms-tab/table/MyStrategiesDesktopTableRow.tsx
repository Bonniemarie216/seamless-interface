import { Address } from "viem";
import { TableRow, TableCell, FlexRow, Icon, FlexCol, Typography } from "../../../../../../../shared";
import { useFullTokenData } from "../../../../../../state/common/meta-data-queries/useFullTokenData";
import { CurrentBalanceStrategy } from "../../../../test-page/tabs/my-positions-tab/CurrentBalance";
import { Tag } from "../../../../../components/asset-data/Tag";

export const MyStrategiesDesktopTableRow: React.FC<{
  strategy: Address;
  hideBorder?: boolean;
}> = ({ strategy, hideBorder }) => {

  const {
    data: { logo: icon, name, subTitle },
  } = useFullTokenData(strategy);

  return (
    <div className="hidden md:block py-4 border-solid border-b border-b-navy-100">
      <TableRow className="md:grid grid-cols-12" hideBorder={hideBorder}>
        <TableCell alignItems="items-start col-span-4">
          <FlexRow className="gap-4 items-start">
            <Icon width={40} src={icon} alt="logo" />
            <FlexCol className="gap-2 text-start">
              <FlexCol className="gap-[2px]">
                <Typography type="bold3">{name}</Typography>
                <Typography type="regular1">{subTitle}</Typography>
              </FlexCol>
              <FlexRow>
                <Tag tag="ILM" />
              </FlexRow>
            </FlexCol>
          </FlexRow>
        </TableCell>

        <TableCell className="col-span-2">
          <CurrentBalanceStrategy asset={strategy} />
        </TableCell>

        <TableCell className="col-span-3">
          {/* <AssetApy
            multiplier={
              `${subStrategyData?.targetMultiple.value}${subStrategyData?.targetMultiple.symbol}` || undefined
            }
            asset={asset}
            subStrategy={strategy}
            isStrategy={isStrategy}
            typography="bold3"
          />
          <AprTooltip asset={isStrategy ? strategy : asset} isStrategy={isStrategy} /> */}
        </TableCell>

        <TableCell className="col-span-3" alignItems="items-center">
          {/* <TableButtons asset={asset} subStrategy={strategy} isStrategy={isStrategy} /> */}
        </TableCell>
      </TableRow>
    </div>
  );
};
