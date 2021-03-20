import { colors } from "../../../utils/styles";

function EachLegend(props) {
  const { fill, label, letter } = props;
  return (
    <div className="d-flex align-items-center mr-1">
      <svg
        style={{ overflow: "visible" }}
        height={15}
        width={12}
        className="mr-2"
      >
        {letter ? (
          <>
            <rect
              height={15}
              width={12}
              rx={3}
              ry={3}
              stroke={colors.divider}
              fill="white"
            />
            <text
              x={6}
              y={12}
              textAnchor="middle"
              alignmentBaseline="center"
              fontSize={14}
            >
              {letter.toUpperCase()}
            </text>
          </>
        ) : (
          <rect height={15} width={12} rx={3} ry={3} fill={fill} />
        )}
      </svg>
      <div>{label}</div>
    </div>
  );
}

export default EachLegend;
