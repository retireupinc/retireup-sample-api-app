import { colors } from "../../../utils/styles";

function Event(props) {
  const { text } = props;
  return (
    <g>
      <rect
        width={16}
        height={20}
        fill="white"
        stroke={colors.divider}
        rx={4}
        ry={4}
      />
      <line x1={8} x2={8} y1={5} y2={25} stroke="white" strokeWidth={3} />
      <text
        x={8}
        y={15}
        textAnchor="middle"
        alignmentBaseline="center"
        fontSize={14}
      >
        {text}
      </text>
    </g>
  );
}

export default Event;
