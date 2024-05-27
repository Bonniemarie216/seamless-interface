import { Address } from "viem";
import { useFetchViewDetailUserReserveData } from "../../../../../state/lending-borrowing/hooks/useFetchViewDetailUserReserveData";
import { DisplayMoney, DisplayTokenAmount, FlexCol, Tooltip, Typography } from "@shared";
import { useFetchViewDetailUserEquity } from "../../../../../state/loop-strategy/hooks/useFetchViewDetailUserEquity";
import { useFetchViewAssetBalance } from "../../../../../state/common/queries/useFetchViewAssetBalance";
import { walletBalanceDecimalsOptionsTemp } from "../../../../../../meta";
import { useFetchViewDetailUserStakedBalance } from "../../../../../state/staking/hooks/useFetchViewDetailUserStakedBalance";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

const CurrentBalanceStrategy: React.FC<{ asset: Address }> = ({ asset }) => {
  const {
    data: { tokenAmount, dollarAmount },
    isLoading: isEquityDataLoading,
    isFetched: isEquityDataFetched,
  } = useFetchViewDetailUserEquity(asset, walletBalanceDecimalsOptionsTemp);

  const {
    data: { balance },
    isFetched: isStrategyBalanceFetched,
    isLoading: isStrategyBalanceLoading,
  } = useFetchViewAssetBalance(asset, walletBalanceDecimalsOptionsTemp);

  return (
    <>
      <Tooltip
        tooltip={
          <FlexCol>
            <Typography type="secondary12">
              {balance.viewValue} {balance.symbol}
            </Typography>
            <Typography type="secondary12">
              {tokenAmount?.viewValue} {tokenAmount?.symbol}
            </Typography>
          </FlexCol>
        }
        size="small"
      >
        <DisplayTokenAmount
          {...balance}
          isLoading={isStrategyBalanceLoading}
          isFetched={isStrategyBalanceFetched}
          typography="bold3"
          className="md:max-w-32"
        />
      </Tooltip>
      <DisplayMoney
        {...dollarAmount}
        isLoading={isEquityDataLoading}
        isFetched={isEquityDataFetched}
        typography="secondary12"
      />
    </>
  );
};

const CurrentBalanceLending: React.FC<{ asset: Address }> = ({ asset }) => {
  const {
    data: { supplied },
    isLoading: isUserReservesDataLoading,
    isFetched: isUserReservesDataFetched,
  } = useFetchViewDetailUserReserveData(asset);

  return (
    <FlexCol>
      <DisplayTokenAmount
        {...supplied?.tokenAmount}
        isLoading={isUserReservesDataLoading}
        isFetched={isUserReservesDataFetched}
        typography="bold3"
      />
      <DisplayMoney
        {...supplied?.dollarAmount}
        isLoading={isUserReservesDataLoading}
        isFetched={isUserReservesDataFetched}
      />
    </FlexCol>
  );
};

const CurrentBalanceStaking: React.FC<{ asset?: Address }> = ({ asset }) => {
  const {
    data,
    isLoading: isUserReservesDataLoading,
    isFetched: isUserReservesDataFetched,
  } = useFetchViewDetailUserStakedBalance(asset);

  return (
    <FlexCol>
      <DisplayTokenAmount
        {...data?.tokenAmount}
        isLoading={isUserReservesDataLoading}
        isFetched={isUserReservesDataFetched}
        typography="bold3"
      />
      <DisplayMoney
        {...data?.dollarAmount}
        isLoading={isUserReservesDataLoading}
        isFetched={isUserReservesDataFetched}
      />
    </FlexCol>
  );
};

export const CurrentBalance: React.FC<{ asset: Address; marketType: MarketType }> = ({ asset, marketType }) => {
  if (marketType == MarketType.Lending) {
    return <CurrentBalanceLending asset={asset} />;
  }

  if (marketType == MarketType.Strategy) {
    return <CurrentBalanceStrategy asset={asset} />;
  }

  if (marketType == MarketType.Staking) {
    return <CurrentBalanceStaking asset={asset} />;
  }
};
