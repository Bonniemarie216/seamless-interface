import React from "react";
import { Typography } from "../../../text/Typography/Typography";

export const ChainName: React.FC<{
  chainName?: string;
}> = ({ chainName }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="2em"
        height="2em"
        viewBox="0 0 24 24"
      >
        <path
          fill="#2bff00"
          d="M12 10a2 2 0 0 0-2 2a2 2 0 0 0 2 2c1.11 0 2-.89 2-2a2 2 0 0 0-2-2"
        />
      </svg>
      <Typography type="subheader1">{chainName}</Typography>
    </>
  );
};
