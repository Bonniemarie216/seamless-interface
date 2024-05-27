import { FlexCol, Typography } from "@shared";

export const Notice = () => {
  return (
    <FlexCol className="rounded-card bg-background-notice p-6 gap-4">
      <Typography type="bold3">Notice: Please read carefully</Typography>
      <Typography type="regular1">
        All SEAM is converted to esSEAM, which is an escrowed version of SEAM that linearly unlocks over 12 months.
      </Typography>
      <Typography type="regular1">
        esSEAM cannot be transferred, but once esSEAM unlocks, it can be claimable as SEAM. 1 esSEAM = 1 SEAM.
      </Typography>
      <Typography type="regular1">
        To delegate your esSEAM voting power and claim your unlocked SEAM, go to the Governance tab. (hyperlink)
      </Typography>
    </FlexCol>
  );
};
