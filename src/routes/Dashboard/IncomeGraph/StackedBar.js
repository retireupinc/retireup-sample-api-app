import { motion } from "framer-motion";
import React from "react";
import { displayType } from "../../../utils/formatters";
import { screen } from "../../../utils/styles";
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
  const { x, height, barWidth, styles, bars, onMouseEnter, onMouseLeave } =
    props;

  const event = row.event;
  const cx = barWidth / 2;
  const ageTooltip =
    `Age ${row.age.client}` + (row.age.spouse ? ` / ${row.age.spouse}` : "");

  return (
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
  );
}

export default StackedBar;
