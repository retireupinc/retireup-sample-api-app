import React, { useState, useMemo } from "react";
import _ from "lodash";
import { ticks } from "d3-array";
import { scaleBand } from "d3-scale";
import { stack, stackOrderNone, stackOffsetNone } from "d3-shape";
import { motion } from "framer-motion";
import { colors } from "../../../utils/styles";
import StackedBar from "./StackedBar";
import {
  MIN_CHART_WIDTH,
  YAXIS_WIDTH,
  margin,
  list,
  legendColors,
} from "./variables";

const sortedRows = (rows) => {
  const noEventRows = [];
  const eventRows = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    row.index = i;
    if (row.event.length === 0) {
      noEventRows.push(row);
    } else {
      eventRows.push(row);
    }
  }

  return [...noEventRows, ...eventRows];
};

function Chart(props) {
  const { household, size, rows, min, yScale, yAxisTicks } = props;

  const fullWidth = Math.max(MIN_CHART_WIDTH, size.width - YAXIS_WIDTH - 0.5);
  const height = size.height - margin.top - margin.bottom;
  const width = fullWidth - margin.left - margin.right;

  const xs = rows.map((d) => d.year);
  const xAxisTicks = ticks(xs[0], _.last(xs), 7);
  const xScale = scaleBand()
    .domain(xs)
    .range([10, width - 10])
    .paddingInner(0.2)
    .round(true);

  const barWidth = xScale.bandwidth();

  const stk = stack()
    .keys([
      "other",
      "annuity",
      "pension",
      "ss",
      "income",
      "initial",
      "reload",
      "assets",
    ])
    .order(stackOrderNone)
    .offset(stackOffsetNone);

  const layers = stk(rows);

  const [styles, setStyles] = useState({
    all: { opacity: "1.0", transition: "opacity 0.3s" },
  });

  const hightlightBar = (year) => {
    setStyles({
      all: { opacity: "0.3", transition: "opacity 0.3s" },
      [year]: { opacity: "1.0", transition: "opacity 0.3s" },
    });
  };

  const unHightlightBar = () => {
    setStyles({ all: { opacity: "1.0", transition: "opacity 0.3s" } });
  };

  const transform = `translate(${margin.left + 0.5}, ${margin.top + 0.5})`;

  const memoizedRows = useMemo(() => sortedRows(rows), [rows]);

  return (
    <svg height={size.height} width={fullWidth}>
      <g transform={transform}>
        <g>
          {yAxisTicks.map((y, idx) => {
            const v = Math.round(yScale(y));
            return (
              <line
                key={idx}
                x1={0}
                x2={width}
                y1={v}
                y2={v}
                stroke={colors.divider}
              />
            );
          })}
        </g>
        <g>
          {xAxisTicks.map((xValue, idx) => {
            const x = Math.round(xScale(xValue) + barWidth / 2);
            return (
              <g key={idx}>
                <line
                  x1={x}
                  x2={x}
                  y1={height}
                  y2={height - 12}
                  stroke={colors.divider}
                />
                <text
                  x={x}
                  y={height + 12}
                  fontSize={13}
                  textAnchor="middle"
                  alignmentBaseline="center"
                >
                  {xValue}
                </text>
              </g>
            );
          })}
        </g>
        <motion.g initial="enter" animate="visible" variants={list}>
          {memoizedRows.map((r) => {
            const y0Value = min + layers[0][r.index][0];
            const y1Value = min + layers[0][r.index][1];
            const y2Value = min + layers[1][r.index][1];
            const y3Value = min + layers[2][r.index][1];
            const y4Value = min + layers[3][r.index][1];
            const y5Value = min + layers[4][r.index][1];
            const y6Value = min + layers[5][r.index][1];
            const y7Value = min + layers[6][r.index][1];
            const y8Value = min + layers[7][r.index][1];

            const y1 = Math.round(yScale(y1Value));
            const h1 = Math.round(yScale(y0Value)) - y1;

            const y2 = Math.round(yScale(y2Value));
            const h2 = y1 - y2;

            const y3 = Math.round(yScale(y3Value));
            const h3 = y2 - y3;

            const y4 = Math.round(yScale(y4Value));
            const h4 = y3 - y4;

            const y5 = Math.round(yScale(y5Value));
            const h5 = y4 - y5;

            const y6 = Math.round(yScale(y6Value));
            const h6 = y5 - y6;

            const y7 = Math.round(yScale(y7Value));
            const h7 = y6 - y7;

            const y8 = Math.round(yScale(y8Value));
            const h8 = y7 - y8;

            const x = Math.round(xScale(r.year));
            return (
              <StackedBar
                onMouseEnter={hightlightBar}
                onMouseLeave={unHightlightBar}
                styles={styles[r.year] ? styles[r.year] : styles.all}
                household={household}
                key={r.year}
                row={r}
                event={r.event}
                x={x}
                height={height}
                barWidth={barWidth}
                bars={[
                  {
                    name: "assets",
                    label: "RMDs",
                    y: y8,
                    h: h8,
                    fill: legendColors.assets,
                  },
                  {
                    name: "reload",
                    label: "Projected income",
                    y: y7,
                    h: h7,
                    fill: legendColors.projectedPaychecks,
                  },
                  {
                    name: "initial",
                    label: "Funded income",
                    y: y6,
                    h: h6,
                    fill: legendColors.fundedPaychecks,
                  },
                  {
                    name: "income",
                    label: "Salary",
                    y: y5,
                    h: h5,
                    fill: legendColors.income,
                  },
                  {
                    name: "ss",
                    label: "Social Security",
                    y: y4,
                    h: h4,
                    fill: legendColors.ss,
                  },
                  {
                    name: "pension",
                    label: "Pension",
                    y: y3,
                    h: h3,
                    fill: legendColors.pension,
                  },
                  {
                    name: "annuity",
                    label: "Annuity",
                    y: y2,
                    h: h2,
                    fill: legendColors.annuity,
                  },
                  {
                    name: "other",
                    label: "Other",
                    y: y1,
                    h: h1,
                    fill: legendColors.other,
                  },
                ]}
              />
            );
          })}
        </motion.g>
      </g>
    </svg>
  );
}

export default Chart;
