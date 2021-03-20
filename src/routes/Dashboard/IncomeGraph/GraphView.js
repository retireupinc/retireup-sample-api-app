import React from "react";
import styled from "styled-components";
import useResizeObserver from "../../../hooks/useResizeObserver";
import IncomeBar from "./IncomeBar";
import Legend from "./Legend";

const GContainer = styled.div`
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const GraphContainer = styled.div`
  flex-grow: 1;
  position: relative;
`;

function GraphView(props) {
  const ref = React.useRef();
  const size = useResizeObserver(ref);
  const { household, rows } = props;

  return (
    <GContainer>
      <GraphContainer ref={ref}>
        {size && <IncomeBar household={household} size={size} rows={rows} />}
      </GraphContainer>
      <Legend rows={rows} />
    </GContainer>
  );
}

export default GraphView;
