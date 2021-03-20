import { Popover } from "react-bootstrap";
import styled from "styled-components";
import { colors, font, spacing } from "../utils/styles";

export const StyledPopover = styled(Popover)`
  font-size: ${font.sizes.sm};
`;

export const PopupTitle = styled.div`
  font-weight: bold;
  color: ${colors.black};
  margin-bottom: ${spacing.s2};
`;
