import _ from "lodash";

export const displayName = (firstName, lastName) => {
  if (_.isEmpty(firstName)) {
    return lastName;
  }

  return `${firstName} ${lastName}`;
};

export const displayNamePossesive = (o) => {
  const heading = _.isEmpty(o.firstName) ? o.lastName : `${o.firstName}`;
  return `${heading}'s`;
};

export const displayInitials = (o) => {
  if (_.isEmpty(o.firstName)) {
    return o.lastName.charAt(0).toUpperCase();
  }

  return (o.firstName.charAt(0) + o.lastName.charAt(0)).toUpperCase();
};

export const displayNameFromPerson = (person) => {
  if (_.isEmpty(person.firstName)) {
    return person.lastName;
  }

  return `${person.firstName} ${person.lastName}`;
};

export const displayType = (type) => {
  switch (type) {
    case "retire": {
      return "R";
    }
    case "ss": {
      return "S";
    }
    case "end": {
      return "E";
    }
    default:
      return "N/A";
  }
};

export const calcTransitionRows = (allRows) => {
  let start;
  let end;
  for (let i = 0; i < allRows.length; i++) {
    if (allRows[i].event.length > 0 && allRows[i].event[0].type !== "end") {
      if (typeof start === "undefined") {
        start = Math.max(0, i - 1);
      }
      end = i + 2; // add +1 buffer for end year
    }
  }

  if (end - start < 7) {
    end = Math.min(allRows.length, start + 7);
  }

  if (end - start < 7) {
    // this can only happen if end was allRows.length (and start was < 7 of end)
    start = end - 7;
  }

  return allRows.slice(start, end);
};

export const calcIncomeRows = (household, plan, yearType = "allYears") => {
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

  return yearType === "allYears" ? allrows : calcTransitionRows(allrows);
};
