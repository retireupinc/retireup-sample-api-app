import _ from "lodash";
import { displayInitials } from "../../../utils/formatters";
import EachLegend from "./EachLegend";

const hasName = (person, owner) =>
  !_.isEmpty(person.firstName) || person.lastName.toLowerCase() !== owner;

const typeText = (type) => {
  if (type === "ss") {
    return "social security";
  } else if (type === "retire") {
    return "retires";
  } else {
    return "end";
  }
};

function TooltipRowEvent(props) {
  const { event, row, household } = props;
  const { type, owner } = event;
  const initials = hasName(household[owner], owner)
    ? `(${displayInitials(household[owner])})`
    : "";

  return (
    <div className="d-flex justify-content-between">
      <EachLegend
        fill="white"
        label={`${owner}${initials} ${typeText(type)}`}
        letter={type.charAt(0)}
      />
      <div className="pl-4">Age {row.age[owner]}</div>
    </div>
  );
}

export default TooltipRowEvent;
