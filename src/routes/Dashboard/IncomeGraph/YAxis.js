import styled from "styled-components";
import { yTickFormatter } from "../../../utils/formatters";
import { YAXIS_WIDTH, margin } from "./variables";

const YAxisContainer = styled.div`
  width: ${YAXIS_WIDTH}px;
  height: 100%;
  flex-shrink: 0;
`;

function YAxis(props) {
  const { size, yScale, yAxisTicks } = props;

  return (
    <YAxisContainer>
      <svg width={YAXIS_WIDTH} height={size.height}>
        <g transform={`translate(0.5, ${margin.top + 0.5})`}>
          {yAxisTicks.map((y, idx) => {
            return (
              <g key={idx}>
                <text
                  x={YAXIS_WIDTH - 2}
                  y={Math.round(yScale(y))}
                  fontSize={13}
                  textAnchor="end"
                  alignmentBaseline="middle"
                >
                  {yTickFormatter.format(y)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </YAxisContainer>
  );
}

export default YAxis;
