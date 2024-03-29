import { IS_STYLE_VERSION_2 } from "../../../../globals";
import { TypographyPropsV2, TypographyV2 } from "../TypographyV2/TypographyV2";
import { TypographyTypeV2 } from "../TypographyV2/mappers";
import { TypographyV1Props } from "../TypographyV1/TypographyV1";
import { TypographyTypeV1 } from "../TypographyV1/mappers";

export type CombinedTypographyType = TypographyTypeV1 | TypographyTypeV2;

export interface TypographyProps extends Omit<TypographyV1Props & TypographyPropsV2, "type"> {
  type?: CombinedTypographyType;
}

// todo rename to main Typography and use it everywhare (next PR)
export const Typography: React.FC<TypographyProps> = (props) => {
  if (IS_STYLE_VERSION_2) return <TypographyV2 {...props} type={props.type as any} />;
  return <Typography {...props} type={props.type as any} />;
};
