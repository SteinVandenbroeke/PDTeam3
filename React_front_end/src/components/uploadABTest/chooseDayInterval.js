import {Button, Form} from "react-bootstrap";
import LogicTable from "../logicTable";
import React from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";


const ChooseDayInterval = (props) => {
    function confirmDayInterval(){
        props.setCurrentStep(props.currentStep + 1);
        console.log(value)
        props.setDayInterval(value);
    }
    const [value, setValue] = React.useState([1]);
    return (
        <div>
            <Form.Label>{props.title}</Form.Label>
            <Slider max={20} min={0} step={1} values={value} setValues={setValue} />
            <Button onClick={()=>confirmDayInterval()}>Next</Button>
        </div>

    )
}


export default ChooseDayInterval;