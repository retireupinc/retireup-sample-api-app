import React, { useContext, useMemo } from "react";
import styled from "styled-components";
import _ from "lodash";
import useResizeObserver from "../../hooks/useResizeObserver";
import { calcIncomeRows } from "../../utils";
import { moneyFormatter } from "../../utils/formatters";
import { font, screen, colors, spacing } from "../../utils/styles";
import DashboardContext from "./DashboardContext";

const TableViewContainer = styled.div`
  flex-grow: 1;
  font-size: ${font.sizes.sm};
  position: relative;
`;

const TableContainer = styled.div`
  overflow: auto;
  min-height: 400px;
  .col-year {
    min-width: 45px;
    max-width: 45px;

    ${screen.sm} {
      min-width: 60px;
      max-width: 60px;
    }
  }
  .col-age {
    min-width: 60px;
    max-width: 60px;
    ${screen.sm} {
      min-width: 80px;
      max-width: 80px;
    }
  }

  .income {
    text-align: right;
  }
  .sticky-col-head {
    background-color: white;
    position: sticky;
    z-index: 4;
    ${screen.sm} {
      z-index: 2;
      box-shadow: 20px 0px 20px 0px rgba(0, 0, 0, 0.08);
    }
  }
  .sticky-col-1 {
    left: 0; /* Don't forget this, required for the stickiness */
  }
  .sticky-col-2 {
    left: 45px; /* Don't forget this, required for the stickiness */
  }
  .sticky-col {
    background-color: white;
    position: sticky;
    box-shadow: 20px 0px 20px -2px rgba(0, 0, 0, 0.08);
    z-index: 3;
    ${screen.sm} {
      position: static;
      box-shadow: none;
    }
  }
  table {
    width: 100%;
    border-collapse: collapse;
    position: relative;
  }
  tr {
    &:not(:last-of-type) {
      border-bottom: 1px solid ${colors.divider};
    }
  }

  th {
    background-color: white;
    position: sticky;
    top: 0; /* Don't forget this, required for the stickiness */
    box-shadow: 20px 0px 20px 0px rgba(0, 0, 0, 0.08);
    z-index: 2;
    padding: ${spacing.s2} ${spacing.s2};
    font-weight: 400;
  }
  td {
    padding: ${spacing.s2} ${spacing.s2};
  }
`;

function FixedHeaderTable(props) {
  const { size, rows } = props;
  const {
    hasIncome,
    hasSS,
    hasPension,
    hasOther,
    hasAnnuity,
    hasAssets,
  } = useMemo(() => {
    return rows.reduce((memo, row) => {
      if (row.income > 0) memo.hasIncome = true;
      if (row.ss > 0) memo.hasSS = true;
      if (row.pension > 0) memo.hasPension = true;
      if (row.other > 0) memo.hasOther = true;
      if (row.annuity > 0) memo.hasAnnuity = true;
      if (row.assets > 0) memo.hasAssets = true;
      return memo;
    }, {});
  }, [rows]);
  return (
    <TableContainer style={{ height: size.height }}>
      <table>
        <thead>
          <tr>
            <th className="col-year sticky-col-head sticky-col-1">Year</th>
            <th className="col-age">Age</th>
            {hasIncome && (
              <th className="text-right">
                Employment
                <br />
                Income
              </th>
            )}
            {hasSS && (
              <th className="text-right">
                Social
                <br />
                Security
              </th>
            )}
            {hasPension && <th className="text-right">Pension</th>}
            {(hasAnnuity || hasOther) && (
              <th className="text-right">
                Annuity /<br />
                Other
              </th>
            )}
            {hasAssets && (
              <th className="text-right">RMDs or Other Investment Income</th>
            )}
            <th className="text-right">
              Pre-Tax <br />
              Income
            </th>
            <th className="text-right">
              Post-Tax <br />
              Income
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => {
            let age = r.age.client;

            if (r.age.spouse) {
              age += " / " + r.age.spouse;
            }

            const income = moneyFormatter.format(_.round(r.income));
            const ss = moneyFormatter.format(_.round(r.ss));
            const pension = moneyFormatter.format(_.round(r.pension));
            const annuityOther = moneyFormatter.format(
              _.round(r.other + r.annuity)
            );
            const assets = moneyFormatter.format(_.round(r.assets));
            const preTax = moneyFormatter.format(_.round(r.tax + r.net));
            const postTax = moneyFormatter.format(_.round(r.net));

            return (
              <tr key={idx}>
                <td className="sticky-col sticky-col-1">{r.year}</td>
                <td className="">{age}</td>
                {hasIncome && <td className="text-right">{income}</td>}
                {hasSS && <td className="text-right">{ss}</td>}
                {hasPension && <td className="text-right">{pension}</td>}
                {(hasAnnuity || hasOther) && (
                  <td className="text-right">{annuityOther}</td>
                )}
                {hasAssets && <td className="text-right">{assets}</td>}
                <td className="text-right">{preTax}</td>
                <td className="text-right">{postTax}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableContainer>
  );
}

function IncomeTable(props) {
  const ref = React.useRef();
  const size = useResizeObserver(ref);
  const { toolbarOptions, household, plan } = useContext(DashboardContext);

  const rows = calcIncomeRows(household, plan, toolbarOptions.yearType);

  return (
    <TableViewContainer className="flex-grow-1" ref={ref}>
      {size && <FixedHeaderTable rows={rows} size={size} />}
    </TableViewContainer>
  );
}

export default IncomeTable;
