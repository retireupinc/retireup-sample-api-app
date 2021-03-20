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
