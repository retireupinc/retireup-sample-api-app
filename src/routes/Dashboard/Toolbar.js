import { useContext } from "react";
import {
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
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
    <div className="d-flex justify-content-center">
      <UncontrolledDropdown className="me-1" direction="down">
        <DropdownToggle caret color="primary">
          {currentExample.name}
        </DropdownToggle>
        <DropdownMenu>
          {examples.map((option, idx) => (
            <DropdownItem
              key={idx}
              eventKey={option.value}
              active={example === option.value}
              onClick={() => {
                setToolbarOptions({
                  ...toolbarOptions,
                  example: option.value,
                });
              }}
            >
              {option.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="me-1" direction="down">
        <DropdownToggle caret color="primary">
          {currentExample.name}
        </DropdownToggle>
        <DropdownMenu>
          {viewTypeOptions.map((option, idx) => (
            <DropdownItem
              key={idx}
              eventKey={option.value}
              active={viewType === option.value}
              onClick={() => {
                setToolbarOptions({
                  ...toolbarOptions,
                  viewType: option.value,
                });
              }}
            >
              {option.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <UncontrolledDropdown className="me-1" direction="down">
        <DropdownToggle caret color="primary">
          {currentExample.name}
        </DropdownToggle>
        <DropdownMenu>
          {yearTypeOptions.map((option, idx) => (
            <DropdownItem
              key={idx}
              active={yearType === option.value}
              onClick={() => {
                setToolbarOptions({
                  ...toolbarOptions,
                  yearType: option.value,
                });
              }}
            >
              {option.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>

      <div className="me-1 dropdown">
        <Button
          type="button"
          color="secondary"
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
      </div>
    </div>
  );
}

export default Toolbar;
