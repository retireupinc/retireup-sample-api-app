import React, { useContext } from "react";
import styled from "styled-components";
import _ from "lodash";
import { ticks, tickStep } from "d3-array";
import { scaleLinear } from "d3-scale";
import useResizeObserver from "../../../hooks/useResizeObserver";
import { calcTransitionRows } from "../../../utils";
import DashboardContext from "../DashboardContext";
import Legend from "./Legend";
import Chart from "./Chart";
import YAxis from "./YAxis";
import { margin } from "./variables";

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

  const { client, spouse } = household;
  const { outcome } = plan;

  const alreadyRetired = {
    client: client.age > plan.client.retire,
    spouse: spouse ? spouse?.age > plan.spouse?.retire : false,
  };

  const median = _.find(
    outcome.path,
    (d) => d.quantile === 0.5 && (!d.at || d.at === "end")
  );

  const currentYear = new Date().getFullYear();

  const clientEnd = {
    index: plan.client.end - client.age,
    type: "end",
    owner: "client",
    age: plan.client.end,
    lastEnd: !spouse
      ? true
      : plan.client.end - client.age >= plan.spouse?.end - spouse.age,
  };

  const spouseEnd = {
    index: spouse ? plan.spouse.end - spouse.age : 999,
    type: "end",
    owner: "spouse",
    age: plan.spouse?.end,
    lastEnd: plan.client.end - client.age <= plan.spouse?.end - spouse?.age,
  };

  const events = [...median.events, clientEnd, spouseEnd].filter(
    (event) =>
      event.type !== "retire" ||
      (event.type === "retire" && !alreadyRetired[event.owner])
  );

  const income = median.income.nominal;

  const _rows = _.zipWith(
    income.assets,
    income.pension,
    income.annuity,
    income.salary,
    income.ss,
    income.other,
    income.net,
    income.tax,
    (assets, pension, annuity, salary, ss, other, net, tax) => {
      return {
        income: salary,
        other,
        ss,
        pension,
        annuity,
        assets,
        net,
        tax,
      };
    }
  );

  const allrows = _rows.map((d, idx) => {
    const sources = Object.keys(d);
    sources.forEach((s) => {
      if (d[s] < 1 && d[s] !== 0) {
        d[s] = 0;
      }
    });

    const clientAge = client.age + idx > clientEnd.age ? "-" : client.age + idx;
    let spouseAge;
    if (spouse != null) {
      spouseAge = spouse.age + idx > spouseEnd.age ? "-" : spouse.age + idx;
    }

    const event = _.filter(events, (d) => d.index === idx);

    const total =
      (d.income || 0) +
      (d.other || 0) +
      (d.ss || 0) +
      (d.pension || 0) +
      (d.annuity || 0) +
      (d.assets || 0);

    return {
      year: currentYear + idx,
      age: {
        client: clientAge,
        spouse: spouseAge,
      },
      ...d,
      total,
      event,
    };
  });

  const rows =
    toolbarOptions.yearType === "allYears"
      ? allrows
      : calcTransitionRows(allrows);

  const chartMin = 0;
  let chartYScale = 0;
  let chartYAxisTicks = [];
  if (size) {
    const height = size.height - margin.top - margin.bottom;

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
