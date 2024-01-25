import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useFetchStrategyAndUserInfo } from "../../../hooks/useFetchStrategyAndUserInfo";
import CommonColumnHeader from "./CommonColumnHeader";
import AssetCell from "./table-cells/AssetCell";
import TextCell from "./table-cells/TextCell";
import NumericCell from "./table-cells/NumericCell/NumericCell";
import ButtonLinkCell from "./table-cells/ButtonLinkCell";
import { useFetchApy } from "../../../hooks/useFetchApy";

function StrategiesTable() {
  const {
    isLoading,
    targetMultiple,
    userEquity,
    userEquityUSD,
    userBalance,
    userBalanceUSD,
  } = useFetchStrategyAndUserInfo();

  useFetchApy();

  return (
    <TableContainer
      sx={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: "lg",
        backgroundColor: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        borderRadius: "5px",
        marginTop: "-20px",
        position: "relative",
        containerSize: "100%",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <CommonColumnHeader label="Strategy name" sx={{ width: "140px" }} />
            <CommonColumnHeader label="Deposit asset" sx={{ width: "250px" }} />
            <CommonColumnHeader label="Target multiple" />
            <CommonColumnHeader label="Loop APY" />
            <CommonColumnHeader label="Available to deposit" />
            <CommonColumnHeader label="Your position" />
            <CommonColumnHeader label="" />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TextCell text="cbETH Booster" />
            <AssetCell
              name="Coinbase Staked Ether"
              symbol="cbETH"
              image="cbeth.svg"
            />
            <NumericCell
              isLoading={isLoading}
              primaryNumber={`${targetMultiple}x`}
            />
            <NumericCell isLoading={false} primaryNumber="6.57%" />
            <NumericCell
              isLoading={isLoading}
              primaryNumber={userBalance}
              secondaryNumber={`$${userBalanceUSD}`}
            />
            <NumericCell
              isLoading={isLoading}
              primaryNumber={userEquity}
              secondaryNumber={`$${userEquityUSD}`}
            />
            <ButtonLinkCell label="Details" route="/details" />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default StrategiesTable;
