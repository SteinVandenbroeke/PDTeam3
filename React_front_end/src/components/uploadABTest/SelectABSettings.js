import {Button, Col, Form, Row} from "react-bootstrap";
import LogicTable from "../logicTable";
import React from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";


const SelectABSettings = (props) => {
    const [topKValue, setTopKValue] = React.useState([1]);
    const [periodValues, setPeriodValues] = React.useState([1, 10]);
    const [stepSizeValue, setStepSizeValue] = React.useState([1]);

    function confirmDayInterval(){
        props.setCurrentStep(props.currentStep + 1);
        props.setTopKValue(topKValue);
        props.setPeriodValues(periodValues);
        props.setStepSizeValue(stepSizeValue);
    }

    return (
        <div>
            <Form.Label>Choose your day-interval.</Form.Label>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} sm={12} md={5} style={{padding: 40}}>
                    <Form.Label style={{paddingBottom:20}}>Select the amount of top-K items. These items will be shown to the users as recommended items.</Form.Label>
                    <Slider max={20} min={0} step={1} setValues={setTopKValue} values={topKValue}/>
                    <Form.Label style={{paddingBottom:20}}>Select the start and end date of this ABTest. </Form.Label>
                    <Slider max={20} min={0} step={1} setValues={setPeriodValues} values={periodValues}/>
                    <Form.Label style={{paddingBottom:20}}>Select the step size. This will determine when to update the top-K items</Form.Label>
                    <Slider max={20} min={0} step={1} setValues={setStepSizeValue}  values={stepSizeValue}/>

                    <Button variant="secondary" onClick={()=>props.setCurrentStep(props.currentStep - 1)}>Previous </Button>{' '}
                    <Button variant="primary" onClick={()=>confirmDayInterval()}>Next</Button>
                </Col>
                <Col xs={0} sm={0} md={7}>
                    <img src={"/svg/Steps.svg"} style={{width: "90%"}} xs={0}/>
                </Col>
            </Row>

        </div>
    )
}


export default SelectABSettings;