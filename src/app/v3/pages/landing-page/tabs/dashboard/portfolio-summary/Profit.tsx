import { DisplayText, FlexRow, Icon, ViewBigInt } from "../../../../../../../shared";
import { useFetchFormattedUserProfit } from "../../../../../../statev3/hooks/user-profit/UserProfit.hook";
import { getApyColor, getApyIndicatorSvg, getRealizedGainBackGroundColor } from "../../../../../utils/uiUtils";

function getProfitText(unrealizedGain: ViewBigInt, unrealizedGainPercentage: ViewBigInt): string | undefined {
  return `${unrealizedGain.symbol}${unrealizedGain.viewValue} (${unrealizedGainPercentage.viewValue}${unrealizedGainPercentage.symbol})`;
}

export const Profit = () => {
  const { data: userProfit, isLoading, isFetched } = useFetchFormattedUserProfit();

  if (isLoading || !isFetched) {
    return <span className="skeleton mt-[0.2px] flex w-20 h-8" />;
  }

  if (!userProfit.unrealizedProfit?.viewValue) {
    return null;
  }

  return (
    <FlexRow
      className={`flex bg-green-100 rounded-tag p-1 justify-center gap-1 max-w-max px-2 ${getRealizedGainBackGroundColor(userProfit.unrealizedProfitPercentage)}`}
    >
      <Icon
        src={getApyIndicatorSvg(userProfit.unrealizedProfitPercentage)}
        alt="polygon"
        width={16}
        height={16}
        hidden={!userProfit.unrealizedProfitPercentage.bigIntValue}
      />
      <DisplayText
        viewValue={getProfitText(userProfit.unrealizedProfit, userProfit.unrealizedProfitPercentage)}
        className={getApyColor(userProfit.unrealizedProfit)}
        typography="bold4"
      />
    </FlexRow>
  );
};
