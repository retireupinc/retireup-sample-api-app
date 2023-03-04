import _ from "lodash";
import { moneyFormatter } from "../../../utils/formatters";
import EachLegend from "./EachLegend";

function TooltipRow(props) {
  const { fill, label, value } = props;
  if (!value || value <= 0) {
    return null;
  }

  return (
    <div className="d-flex justify-content-between">
      <EachLegend fill={fill} label={label} />
      <div className="ps-4">{moneyFormatter.format(_.round(value))}</div>
    </div>
  );
}

export default TooltipRow;
