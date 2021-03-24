import _ from "lodash";

export const numberFormatter = new Intl.NumberFormat("en-US", {});

export const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumSignificantDigits: 20,
});

export const yTickFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  compactDisplay: "short",
});

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
