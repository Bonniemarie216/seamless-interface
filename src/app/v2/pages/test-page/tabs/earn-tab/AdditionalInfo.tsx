import { HistoricalPerformance } from "./HistoricalPerformance";
import { FAQ } from "./FAQ";
import { ExternalLink, FlexCol, FlexRow, Typography } from "@shared";
import { gitBookUrl } from "@router";
import { VaultsLink } from "../../../../components/specific-components/VaultsLink";
import { Address } from "viem";

export const AdditionalInfo: React.FC<{
  asset?: Address;
  isStrategy?: boolean;
}> = ({ asset, isStrategy }) => {
  return (
    <div className="join join-vertical w-full bg-white shadow-card rounded-card">
      <div className="collapse collapse-arrow join-item border-b">
        <input type="radio" name="my-accordion-4" defaultChecked />
        <div className="collapse-title">
          <Typography type="medium4">Historical Performance</Typography>
        </div>
        <div className="collapse-content">
          <HistoricalPerformance />
        </div>
      </div>
      {isStrategy && (
        <div className="collapse collapse-arrow join-item border-b">
          <input type="radio" name="my-accordion-4" />
          <div className="collapse-title">
            <Typography type="medium4">FAQ</Typography>
          </div>
          <div className="collapse-content">
            <FAQ asset={asset} isStrategy={isStrategy} />
          </div>
        </div>
      )}
      <div className="collapse collapse-arrow join-item">
        <input type="radio" name="my-accordion-4" />
        <div className="collapse-title">
          <Typography type="medium4">Resource Links</Typography>
        </div>
        <div className="collapse-content">
          <FlexCol className="gap-2">
            <FlexRow className="gap-3 items-center">
              <ExternalLink url={gitBookUrl} className="text-regular3">
                Gitbook
              </ExternalLink>
              <VaultsLink asset={asset} isStrategy={isStrategy} />
            </FlexRow>
          </FlexCol>
        </div>
      </div>
    </div>
  );
};
