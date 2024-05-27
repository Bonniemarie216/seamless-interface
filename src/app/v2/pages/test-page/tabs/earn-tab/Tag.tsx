import { Typography } from "@shared";
import { MarketType } from "../../../../../state/common/hooks/useFetchAllMarkets";

export type TagType = "LEND" | "ILM";

const getColorByType = (type?: MarketType) => {
  switch (type) {
    case MarketType.Lending:
      return "bg-smallElements-lend border-green-1000";
    case MarketType.Strategy:
      return "bg-smallElements-ilm border-metallicBorder";
    case MarketType.Staking:
      return "bg-smallElements-ilm border-metallicBorder";
  }
};

export function getMarketTag(market?: MarketType): string {
  if (market == undefined) return "";

  switch (market) {
    case MarketType.Lending:
      return "LEND";
    case MarketType.Strategy:
      return "ILM";
    case MarketType.Staking:
      return "FARM";
  }
}

export const Tag: React.FC<{ marketType?: MarketType }> = ({ marketType }) => {
  return (
    <div className={`py-1 px-2 rounded-lg border border-solid ${getColorByType(marketType)}`}>
      <Typography type="bold">{getMarketTag(marketType)}</Typography>
    </div>
  );
};
