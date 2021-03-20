import React from "react";
import styled from "styled-components";
import _ from "lodash";
import { ticks, tickStep } from "d3-array";
import { scaleLinear } from "d3-scale";
import Chart from "./Chart";
import YAxis from "./YAxis";
import { margin } from "./variables";

const ChartContainer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ChartAreaContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex-grow: 1;
  height: 101.5%;
`;

const IncomeBar = React.memo(function IncomeBar(props) {
  const { household, size, rows } = props;
  const height = size.height - margin.top - margin.bottom;

  let max = _.maxBy(rows, (d) => d.total).total;
  const min = 0;

  const yAxisTicks = ticks(min, max, 5);
  const distance = tickStep(min, max, 5);

  if (max > _.last(yAxisTicks)) {
    max = _.last(yAxisTicks) + distance;
    yAxisTicks.push(max);
  }

  const yScale = scaleLinear([min, max], [height, 0]);

  return (
    <ChartContainer className="d-flex position-absolute">
      <YAxis size={size} yScale={yScale} yAxisTicks={yAxisTicks.slice(1)} />
      <ChartAreaContainer>
        <Chart
          household={household}
          size={size}
          rows={rows}
          min={min}
          yScale={yScale}
          yAxisTicks={yAxisTicks}
        />
      </ChartAreaContainer>
    </ChartContainer>
  );
});

export default IncomeBar;
