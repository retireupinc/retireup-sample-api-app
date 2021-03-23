import React, { useContext } from "react";
import styled from "styled-components";
import _ from "lodash";
import { ticks, tickStep } from "d3-array";
import { scaleLinear } from "d3-scale";
import useResizeObserver from "../../../hooks/useResizeObserver";
import { calcIncomeRows } from "../../../utils";
import DashboardContext from "../DashboardContext";
import Legend from "./Legend";
import Chart from "./Chart";
import YAxis from "./YAxis";
import { MARGIN } from "./constants";

const GContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const GraphContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

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

function IncomeGraph(props) {
  const ref = React.useRef();
  const size = useResizeObserver(ref);
  const { toolbarOptions, household, plan } = useContext(DashboardContext);

  const rows = calcIncomeRows(household, plan, toolbarOptions.yearType);

  const chartMin = 0;
  let chartYScale = 0;
  let chartYAxisTicks = [];
  if (size) {
    const height = size.height - MARGIN.top - MARGIN.bottom;
    let chartMax = _.maxBy(rows, (d) => d.total).total;
    chartYAxisTicks = ticks(chartMin, chartMax, 5);
    const distance = tickStep(chartMin, chartMax, 5);

    if (chartMax > _.last(chartYAxisTicks)) {
      chartMax = _.last(chartYAxisTicks) + distance;
      chartYAxisTicks.push(chartMax);
    }

    chartYScale = scaleLinear([chartMin, chartMax], [height, 0]);
  }

  return (
    <GContainer>
      <GraphContainer ref={ref}>
        {size && (
          <ChartContainer className="d-flex position-absolute">
            <YAxis
              size={size}
              yScale={chartYScale}
              yAxisTicks={chartYAxisTicks.slice(1)}
            />
            <ChartAreaContainer>
              <Chart
                household={household}
                size={size}
                rows={rows}
                min={chartMin}
                yScale={chartYScale}
                yAxisTicks={chartYAxisTicks}
              />
            </ChartAreaContainer>
          </ChartContainer>
        )}
      </GraphContainer>
      <Legend rows={rows} />
    </GContainer>
  );
}

export default IncomeGraph;
