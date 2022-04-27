import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import LogicTable from "../logicTable";
import React, {useEffect, useState} from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";
import {ServerRequest} from "../../logic/ServerCommunication";
import {toast} from "react-toastify";


const SelectABSettings = (props) => {
    const [topKValue, setTopKValue] = React.useState([1]);
    const [maxTopK, setMaxTopK] = useState([1])
    const [periodValues, setPeriodValues] = React.useState([0, 1]);
    const [stepSizeValue, setStepSizeValue] = React.useState([1]);
    const [periodSlider, setPeriodSlider] = React.useState([1, 10, 2,2,3,74,56,5,5,4,45,4545,45,45,5,445,74]);
    const [loading, setLoading] = useState(false);
    const [abTestName, setAbTestname] = useState("");

    function loadPeriod(){
        setLoading(true)
        let request = new ServerRequest();
        let getData = {
            "id": props.datasetId
        }
        request.sendGet("getTimeStampList",getData).then(requestData => {setPeriodSlider(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function loadArticleCount(){
        setLoading(true)
        let request = new ServerRequest();
        let getData = {
            "id": props.datasetId
        }
        request.sendGet("getArticleCount",getData).then(requestData => {setMaxTopK(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function confirmDayInterval(){
        if(abTestName === ""){
            toast.error("You need to give your AB-test a name.");
            return
        }
        props.setCurrentStep(props.currentStep + 1);
        props.setTopKValue(topKValue);
        props.setPeriodValues([periodSlider[periodValues[0]], periodSlider[periodValues[1]]]);
        props.setStepSizeValue(stepSizeValue);
        props.setAbTestName(abTestName);
    }

    useEffect(() => {
        if(props.datasetId != null){
            loadPeriod()
            loadArticleCount()
        }
    },[props.datasetId]);

    return (
        <div>
            <Form.Label>Choose your day-interval.</Form.Label>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} sm={12} md={5} style={{padding: 40}}>
                    <Form.Label>Enter a name for your AB-test.</Form.Label>
                    <Form.Control placeholder="AB-test name" onChange={(e)=>setAbTestname(e.target.value) } />
                    <Form.Label style={{paddingBottom:20, paddingTop:20}}>Select the amount of top-K items. These items will be shown to the users as recommended items.</Form.Label>
                    <Slider max={maxTopK} min={0} step={1} setValues={setTopKValue} values={topKValue}/>
                    <Form.Label style={{paddingBottom:20}}>Select the start and end date of this ABTest. </Form.Label>
                    <Spinner
                        className={!loading? "visually-hidden": ""}
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    <Slider max={periodSlider.length - 1} labels={periodSlider} min={0} step={1} setValues={setPeriodValues} values={periodValues}/>
                    <Form.Label style={{paddingBottom:20}}>Select the step size. This will determine when to update the top-K items</Form.Label>
                    <Slider max={periodSlider.length - 1} min={1} step={1} setValues={setStepSizeValue}  values={stepSizeValue}/>

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