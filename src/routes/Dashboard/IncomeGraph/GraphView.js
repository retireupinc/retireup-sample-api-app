import React, { useContext } from "react";
import styled from "styled-components";
import _ from "lodash";
import useResizeObserver from "../../../hooks/useResizeObserver";
import { calcTransitionRows } from "../../../utils";
import DashboardContext from "../DashboardContext";
import IncomeBar from "./IncomeBar";
import Legend from "./Legend";

const GContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const GraphContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

function GraphView(props) {
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

  const income = median.income[toolbarOptions.dollarType];

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

  return (
    <GContainer>
      <GraphContainer ref={ref}>
        {size && <IncomeBar household={household} size={size} rows={rows} />}
      </GraphContainer>
      <Legend rows={rows} />
    </GContainer>
  );
}

export default GraphView;
