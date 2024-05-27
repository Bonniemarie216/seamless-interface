import { FlexCol, Typography } from "@shared";

export const Notice = () => {
  return (
    <FlexCol className="rounded-card bg-background-notice p-6 gap-4">
      <Typography type="bold3">Notice: Please read carefully</Typography>
      <Typography type="regular1">
        Notice: Please read carefully You will no longer be earning Rewards APR if you withdraw your esSEAM.
      </Typography>
      <Typography type="regular1">
        Withdrawn esSEAM cannot be restaked or transferred, but esSEAM is claimable as SEAM while it linearly unlocks
        over 12 months. 1 esSEAM = 1 SEAM.
      </Typography>
      <Typography type="regular1">
        To delegate your esSEAM voting power and claim your unlocked SEAM, go to the Governance tab. (hyperlink)
      </Typography>
    </FlexCol>
  );
};
