import { FlexRow, Typography, TableRow, TableCell } from '../../../../../../shared'
import { useFetchAllStrategies } from '../../../../../state/common/hooks/useFetchAllStrategies'
import { MyStrategiesDesktopTableRow } from './table/MyStrategiesDesktopTableRow';
import { MyStrategiesMobileTableRow } from './table/MyStrategiesMobileTableRow';

export const ILMsTab = () => {
  const { state } = useFetchAllStrategies();

  return (
    <div>
      <div className="bg-neutral-0 shadow-card rounded-2xl">
        <div className="flex h-20 px-6 items-center">
          <FlexRow className="justify-between items-center w-full">
            <Typography type="bold4">My Earn Positions</Typography>
          </FlexRow>
        </div>
        <TableRow className="hidden md:grid grid-cols-12 bg-neutral-100 border-solid border-b border-b-navy-100 mt-0 py-0.5 max-h-7 justify-center">
          <TableCell className="col-span-4 justify-center" alignItems="items-start">
            <Typography type="bold2">Strategy</Typography>
          </TableCell>
          <TableCell className="col-span-2">
            <Typography type="bold2">Current balance</Typography>
          </TableCell>
          <TableCell className="col-span-3">
            <Typography type="bold2">APY</Typography>
          </TableCell>
          <TableCell className="text-sm font-medium text-gray-500 col-span-3 h-1" />
        </TableRow>

        {state.data?.map((strategy, index) => (
          <div key={index}>
            <MyStrategiesDesktopTableRow strategy={strategy.address} hideBorder={index !== state.data.length} />
            <MyStrategiesMobileTableRow {...strategy} />
          </div>
        ))}
      </div>
    </div>
  )
}
