import { Typography } from "@shared";
import { TagType } from "../../../state/common/types/StateTypes";

import React from "react";

// eslint-disable-next-line no-unused-vars
const ColorByTypeDict: { [key in TagType]: string } = {
  LEND: "bg-smallElements-lend border-green-1000",
  ILM: "bg-smallElements-ilm border-metallicBorder",
};


export const Tag: React.FC<{ tag?: TagType }> = ({ tag }) => {
  if (!tag) return null;
  return (
    <div
      className={`flex flex-row gap-1 items-center py-1 px-2 rounded-lg border border-solid ${ColorByTypeDict[tag]}`}
    >
      <Typography type="bold">{tag}</Typography>
    </div>
  );
};
