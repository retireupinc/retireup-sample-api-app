import { motion } from "framer-motion";
import _ from "lodash";
import React, { useCallback, useState } from "react";
import { PopoverBody } from "reactstrap";
import { PopupTitle, StyledPopover } from "../../../components/Styled";
import { displayType, moneyFormatter } from "../../../utils/formatters";
import { screen } from "../../../utils/styles";
import Event from "./Event";
import TooltipRow from "./TooltipRow";
import TooltipRowEvent from "./TooltipRowEvent";

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
  const { x, height, barWidth, styles, bars, onMouseEnter, onMouseLeave } =
    props;
  const { row, household } = props;

  const [popoverOpen, setPopoverOpen] = useState(false);

  const toggle = useCallback(() => {
    onMouseEnter(row.year);
    setPopoverOpen(!popoverOpen);
  }, [row.year, popoverOpen, onMouseEnter]);

  const onHover = useCallback(() => {
    onMouseEnter(row.year);
    setPopoverOpen(true);
  }, [row.year, onMouseEnter]);

  const onHoverLeave = useCallback(() => {
    onMouseLeave();
    setPopoverOpen(false);
  }, [onMouseLeave]);

  const event = row.event;
  const cx = barWidth / 2;
  const ageTooltip =
    `Age ${row.age.client}` + (row.age.spouse ? ` / ${row.age.spouse}` : "");

  return (
    <>
      <StyledPopover
        placement={placement()}
        isOpen={popoverOpen}
        target={`popover${row.year}`}
        toggle={toggle}
      >
        <PopoverBody>
          <PopupTitle>
            <div className="d-flex justify-content-between">
              <div>Income</div>
              <div className="d-flex ps-4">
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
              <b className="me-2">Pre-tax income</b>
              <span className="ps-4">
                {moneyFormatter.format(_.round(row.tax + row.net))}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <b className="me-2">Total taxes paid</b>
              <span className="ps-4">
                {moneyFormatter.format(
                  _.round(row.tax) === 0 ? 0 : _.round(row.tax * -1)
                )}
              </span>
            </div>
            <div className="d-flex justify-content-between">
              <b className="me-2">Post-tax income</b>
              <span className="ps-4">
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
        </PopoverBody>
      </StyledPopover>

      <motion.g
        id={`popover${row.year}`}
        transform={`translate(${x}, 0)`}
        variants={item}
        style={styles}
        onMouseEnter={onHover}
        onMouseLeave={onHoverLeave}
      >
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
    </>
  );
}

export default StackedBar;
