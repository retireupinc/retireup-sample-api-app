import React, { useMemo } from "react";
import styled from "styled-components";
import { font, spacing, screen } from "../../../utils/styles";
import EachLegend from "./EachLegend";
import { legendColors } from "./variables";

export const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  font-size: ${font.sizes.sm};
  padding: ${spacing.s2};
  justify-content: space-between;
  ${screen.sm} {
    height: 50px;
    justify-content: space-around;
    padding-left: 50px;
  }
`;

function Legend(props) {
  const { rows } = props;
  const {
    hasIncome,
    hasOther,
    hasSS,
    hasPension,
    hasAnnuity,
    hasAssets,
  } = useMemo(
    () =>
      rows.reduce((memo, row) => {
        if (row.income > 0) {
          memo.hasIncome = true;
        }

        if (row.other > 0) {
          memo.hasOther = true;
        }

        if (row.annuity > 0) {
          memo.hasAnnuity = true;
        }

        if (row.ss > 0) {
          memo.hasSS = true;
        }

        if (row.pension > 0) {
          memo.hasPension = true;
        }

        if (row.reload > 0) {
          memo.hasReload = true;
        }

        if (row.assets > 0) {
          memo.hasAssets = true;
        }

        return memo;
      }, {}),
    [rows]
  );

  return (
    <LegendContainer>
      {hasIncome && <EachLegend fill={legendColors.income} label="Salary" />}
      {hasSS && <EachLegend fill={legendColors.ss} label="Social Security" />}
      {hasPension && <EachLegend fill={legendColors.pension} label="Pension" />}
      {hasAnnuity && <EachLegend fill={legendColors.annuity} label="Annuity" />}
      {hasOther && <EachLegend fill={legendColors.other} label="Other" />}
      {hasAssets && <EachLegend fill={legendColors.assets} label="Assets" />}
    </LegendContainer>
  );
}

export default Legend;
