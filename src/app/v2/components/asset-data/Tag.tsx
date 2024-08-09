import { Typography } from "@shared";
import { TagType } from "../../../state/common/types/StateTypes";

import React from "react";

// eslint-disable-next-line no-unused-vars
const ColorByTypeDict: { [key in TagType]: string } = {
  Long: "bg-tags-blue text-neutral-0",
  Staking: "bg-tags-red text-neutral-0",
};

export const Tag: React.FC<{ tag?: TagType }> = ({ tag }) => {
  if (!tag) return null;
  return (
    <div className={`inline-flex justify-center items-center gap-2 py-1 px-2 rounded-[100px] ${ColorByTypeDict[tag]}`}>
      <Typography type="bold">{tag}</Typography>
    </div>
  );
};
