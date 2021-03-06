import { useContext } from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  Button,
  ToggleButton,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import styled from "styled-components";
import DashboardContext from "./DashboardContext";

const examples = [
  { name: "Boomer With Cash", value: "BOOMER_W_CASH" },
  { name: "CEO Ready To Retire", value: "CEO_READY_TO_RETIRE" },
  { name: "Just Enough To Retire", value: "JUST_ENOUGH_TO_RETIRE" },
  { name: "Ready To Retire", value: "READY_TO_RETIRE" },
];

const viewTypeOptions = [
  { name: "Graph", value: "graph" },
  { name: "Table", value: "table" },
];

const yearTypeOptions = [
  { name: "All Years", value: "allYears" },
  { name: "Transition Years", value: "real" },
];

export const StyledButtonGroup = styled(ButtonGroup)`
  width: 100%;
`;

const isToolBarResetDisabled = ({ defaults, viewType, yearType }) =>
  defaults.viewType === viewType && defaults.yearType === yearType;

function Toolbar(props) {
  const { toolbarOptions, setToolbarOptions } = useContext(DashboardContext);
  const { example, viewType, yearType } = toolbarOptions;
  const currentExample = examples.find((e) => e.value === example);

  return (
    <ButtonToolbar
      aria-label="Toolbar with button groups"
      className="d-flex flex-column flex-sm-row"
    >
      <ButtonGroup toggle className="mb-2 ml-2 flex-grow-1">
        <DropdownButton
          as={StyledButtonGroup}
          title={currentExample.name}
          onSelect={(value) => {
            setToolbarOptions({
              ...toolbarOptions,
              example: value,
            });
          }}
        >
          {examples.map((option, idx) => (
            <Dropdown.Item
              key={idx}
              eventKey={option.value}
              active={example === option.value}
            >
              {option.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      </ButtonGroup>
      <ButtonGroup toggle className="mb-2 ml-2 flex-grow-1">
        {viewTypeOptions.map((option, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="outline-primary"
            name="viewType"
            value={option.value}
            checked={viewType === option.value}
            onChange={(e) =>
              setToolbarOptions({
                ...toolbarOptions,
                viewType: e.currentTarget.value,
              })
            }
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <ButtonGroup toggle className="mb-2 ml-2 flex-grow-1">
        {yearTypeOptions.map((option, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="outline-primary"
            name="yearType"
            value={option.value}
            checked={yearType === option.value}
            onChange={(e) =>
              setToolbarOptions({
                ...toolbarOptions,
                yearType: e.currentTarget.value,
              })
            }
          >
            {option.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      <ButtonGroup toggle className="mb-2 ml-2 flex-grow-1">
        <Button
          type="button"
          variant="secondary"
          disabled={isToolBarResetDisabled(toolbarOptions)}
          onClick={(e) =>
            setToolbarOptions({
              ...toolbarOptions,
              ...toolbarOptions.defaults,
              example: toolbarOptions.example,
            })
          }
        >
          Reset
        </Button>
      </ButtonGroup>
    </ButtonToolbar>
  );
}

export default Toolbar;
