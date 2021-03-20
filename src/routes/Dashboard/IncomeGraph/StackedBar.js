import React from "react";
import { Popover, OverlayTrigger } from "react-bootstrap";
import _ from "lodash";
import { motion } from "framer-motion";
import { displayType } from "../../../utils";
import { moneyFormatter } from "../../../utils/formatters";
import { screen } from "../../../utils/styles";
import { StyledPopover, PopupTitle } from "../../../components";
import TooltipRow from "./TooltipRow";
import TooltipRowEvent from "./TooltipRowEvent";
import Event from "./Event";

const item = {
  visible: {
    opacity: 1,
  },
  enter: {
    opacity: 0,
  },
};

const placement = () =>
  window.matchMedia(screen.sm.replace("@media ", "")).matches ? "left" : "top";

function StackedBar(props) {
  const { row, household } = props;
  const {
    x,
    height,
    barWidth,
    styles,
    bars,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const event = row.event;
  const cx = barWidth / 2;
  const ageTooltip =
    `Age ${row.age.client}` + (row.age.spouse ? ` / ${row.age.spouse}` : "");

  return (
    <OverlayTrigger
      trigger={["hover", "focus"]}
      placement={placement()}
      onEnter={() => {
        onMouseEnter(row.year);
      }}
      onExit={() => {
        onMouseLeave();
      }}
      overlay={
        <StyledPopover id="popover-positioned">
          <Popover.Content>
            <PopupTitle>
              <div className="d-flex justify-content-between">
                <div>Income</div>
                <div className="d-flex pl-4">
                  <div>{row.year}</div>
                  <div className="px-1">/</div>
                  <div>{ageTooltip}</div>
                </div>
              </div>
            </PopupTitle>
            <div>
              {bars.map((b) => {
                return (
                  <TooltipRow
                    key={b.name}
                    fill={b.fill}
                    label={b.label}
                    value={row[b.name]}
                  />
                );
              })}
              <div className="d-flex justify-content-between">
                <b className="mr-2">Pre-tax income</b>
                <span className="pl-4">
                  {moneyFormatter.format(_.round(row.tax + row.net))}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <b className="mr-2">Total taxes paid</b>
                <span className="pl-4">
                  {moneyFormatter.format(
                    _.round(row.tax) === 0 ? 0 : _.round(row.tax * -1)
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between">
                <b className="mr-2">Post-tax income</b>
                <span className="pl-4">
                  {moneyFormatter.format(_.round(row.net))}
                </span>
              </div>
              {event.length > 0 &&
                _.orderBy(
                  event,
                  [(d) => d.type, (d) => d.owner],
                  ["asc", "asc"]
                ).map((e, i) => (
                  <TooltipRowEvent
                    key={i}
                    household={household}
                    event={e}
                    row={row}
                  />
                ))}
            </div>
          </Popover.Content>
        </StyledPopover>
      }
    >
      <motion.g transform={`translate(${x}, 0)`} variants={item} style={styles}>
        {bars.map((b) => {
          if (b.h > 0) {
            return (
              <rect
                key={b.name}
                y={b.y}
                width={barWidth}
                height={b.h}
                fill={b.fill}
              />
            );
          }
          return null;
        })}
        {event.length !== 0 &&
          event.map((e, i) => (
            <g
              transform={`translate(${cx - 8},${height - 25 * (i + 1)})`}
              key={i}
            >
              {!e.lastEnd && <Event text={displayType(e.type)} />}
            </g>
          ))}
      </motion.g>
    </OverlayTrigger>
  );
}

export default StackedBar;
