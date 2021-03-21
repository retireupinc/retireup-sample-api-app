import { useContext, useEffect } from "react";
import {
  ButtonToolbar,
  ButtonGroup,
  ToggleButton,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import DashboardContext from "./DashboardContext";

const examples = [
  { name: "Boomer With Cash", value: "BOOMER_W_CASH" },
  { name: "CEO Ready To Retire", value: "CEO_READY_TO_RETIRE" },
  { name: "Just Enough To Retire", value: "JUST_ENOUGH_TO_RETIRE" },
  { name: "Ready To Retire", value: "READY_TO_RETIRE" },
];

const yearTypeOptions = [
  { name: "All Years", value: "allYears" },
  { name: "Transition Years", value: "real" },
];

function Toolbar(props) {
  const { toolbarOptions, setToolbarOptions, fetchPlan } = useContext(
    DashboardContext
  );
  const { example, yearType } = toolbarOptions;

  useEffect(() => {
    fetchPlan(example);
  }, [example, fetchPlan]);

  const currentExample = examples.find((e) => e.value === example);

  return (
    <ButtonToolbar aria-label="Toolbar with button groups">
      <ButtonGroup toggle className="mr-4">
        <DropdownButton
          as={ButtonGroup}
          size="md"
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
      <ButtonGroup toggle>
        {yearTypeOptions.map((option, idx) => (
          <ToggleButton
            key={idx}
            type="radio"
            variant="outline-primary"
            name="radio"
            size="md"
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
    </ButtonToolbar>
  );
}

export default Toolbar;
