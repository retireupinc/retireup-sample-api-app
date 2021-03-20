import { useState, useEffect } from "react";
// import styled from "styled-components";
import _ from "lodash";
import { fetchPlanByTagName } from "../../utils/ApiClient";
import { calcTransitionRows } from "../../utils";
import IncomeGraph from "./IncomeGraph";

const BOOMER_W_CASH = "BOOMER_W_CASH";

const settings = {
  dollarType: "nominal",
  yearType: "allYears",
};

function Dashboard(props) {
  const [household, setHousehold] = useState();
  const [plan, setPlan] = useState();

  useEffect(() => {
    fetchPlanByTagName(BOOMER_W_CASH).then(({ household, plan }) => {
      setHousehold(household);
      setPlan(plan);
    });
  }, []);

  if (!household || !plan || !plan?.outcome) {
    return (
      <>
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Timeline</h1>
        </div>
      </>
    );
  }

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

  const income = median.income[settings.dollarType];

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
      (d.assets || 0) +
      (d.initial || 0) +
      (d.reload || 0);

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
    settings.yearType === "allYears" ? allrows : calcTransitionRows(allrows);

  return (
    <>
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Timeline</h1>
      </div>
      <IncomeGraph household={household} rows={rows} />
    </>
  );
}

export default Dashboard;
