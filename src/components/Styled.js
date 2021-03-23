import { Popover } from "react-bootstrap";
import styled from "styled-components";
import { colors, font, spacing, screen } from "../utils/styles";

export const StyledPopover = styled(Popover)`
  font-size: ${font.sizes.sm};
`;

export const PopupTitle = styled.div`
  font-weight: bold;
  color: ${colors.black};
  margin-bottom: ${spacing.s2};
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: -${spacing.s3};
  right: 0;
  bottom: -${spacing.s3};
  left: 0;
  background: rgba(100, 100, 100, 0.2);
  display: flex;
  align-items: center;
  z-index: 10;
  ${(props) => {
    const roundbottom = `
      border-bottom-right-radius: ${spacing.s2};
      border-bottom-left-radius: ${spacing.s2};
    `;
    return props.roundBottom ? roundbottom : "";
  }}

  ${screen.sm} {
    right: -${spacing.s3};
    left: -${spacing.s3};
  }
`;
