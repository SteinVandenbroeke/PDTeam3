import {Button, Card, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import LogicTable from "../logicTable";
import React, {useEffect, useState} from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";
import ConnectComponent from "../ConnectComponent";
import {valueOrDefault} from "chart.js/helpers";
import {ToastContainer} from "react-toastify";
import Login from "../../pages/Login";
import {ServerRequest} from "../../logic/ServerCommunication";
import { toast } from 'react-toastify';

const AddAlgoritms = (props) => {
    const [trainingIntervalvalue, setTrainingIntervalvalue] = React.useState([1]);
    const [valueSelect, setValueSelect] = React.useState(0);
    const [algorithms,setAlgorithms] = React.useState([[]]);
    const [k, setK] = React.useState([1]);
    const [maxK, setMaxK] = useState([1])
    const [loading, setLoading] = useState(false);
    const [periodSlider, setPeriodSlider] = React.useState([1, 10, 2,2,3,74,56,5,5,4,45,4545,45,45,5,445,74]);

    function loadPeriod(){
        setLoading(true)
        let request = new ServerRequest();
        let getData = {
            "id": props.datasetId
        }
        request.sendGet("getTimeStampList",getData).then(requestData => {setPeriodSlider(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function loadCustomerCount(){
        setLoading(true)
        let request = new ServerRequest();
        let getData = {
            "id": props.datasetId
        }
        request.sendGet("getCustomerCount",getData).then(requestData => {setMaxK(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function finish(){
        if(algorithms.length === 1){
            toast.error("You need to add at least one algorithm.");
            return
        }
        props.setCurrentStep(props.currentStep + 1)
        props.setAlgorithms(algorithms.slice(1))
    }
    function checkExistingCombination(tempK){
        for (var i = 1; i < algorithms.length; i++) {
            console.log(algorithms[i][0]  , valueSelect , parseInt(algorithms[i][1]) , parseInt(trainingIntervalvalue) , parseInt(algorithms[i][2]) ,  tempK)
            if(algorithms[i][0] === valueSelect && parseInt(algorithms[i][1]) === parseInt(trainingIntervalvalue) && parseInt(algorithms[i][2]) ===  tempK){
                return true;
            }
        }
        return false;
    }

    function addAlgorithm(){
        let tempK = k[0];
        if(valueSelect != 3){
            tempK = 0;
        }
        if(valueSelect == "0"){
            toast.error("You need to select an algorithm.");
            return
        }
        if(checkExistingCombination(tempK)){
            toast.error("You cannot add an algorithm with the same parameters twice.");
            return
        }

        setAlgorithms(algorithms => [...algorithms, [valueSelect,trainingIntervalvalue, tempK]]);
        setValueSelect("0")
        setK([1])
        setTrainingIntervalvalue([1])
    }
    function setAlgo(id){
        setValueSelect(id)
    }

    useEffect(() => {
        if(props.datasetId != null){
            loadCustomerCount()
            loadPeriod()
        }
    },[props.datasetId]);


    return (
        <div style={{textAlign: "left"}}>
            <Row>
                 <Form.Label>Choose your algorithms to run.</Form.Label>
            </Row>
            <Row  style={{paddingTop: 20, paddingBottom: 20}}>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:10}}>Algorithms:</Form.Label>
                    <Form.Select onChange={(e)=>setAlgo(e.target.value)} value={valueSelect}>
                      <option value="0" className={"disabled"}> empty Alogithm</option>
                      <option value="1">Popularity</option>
                      <option value="2">Recency</option>
                      <option value="3">ItemKNN</option>
                    </Form.Select>
                    {valueSelect == 3 && (
                        <div>
                            <Form.Label style={{paddingBottom:20}}>K:</Form.Label>
                            <Slider max={maxK-1} min={1} step={1} setValues={setK} values={k}/>
                        </div>
                    )}
                </Col>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:20}}>Training interval:</Form.Label>
                    <Slider max={periodSlider.length - 1} min={0} step={1} setValues={setTrainingIntervalvalue} values={trainingIntervalvalue}/>
                </Col>
                <Col xs lg="2" style={{ textAlign:"center", paddingTop:30}}>
                    <Button variant="success" onClick={()=>addAlgorithm()}>Add</Button>
                </Col>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:10}}>Added algorithms:</Form.Label>
                    <Card className={"shadow-lg"}>
                      <Card.Body>
                          <LogicTable data={[["Algoriths","Training interval","k"]].concat(algorithms)}/>
                      </Card.Body>
                    </Card>
                </Col>
            </Row >
                <Button variant="secondary" onClick={()=>props.setCurrentStep(props.currentStep - 1)}>Previous</Button>{' '}
                <Button variant="primary" onClick={()=>finish()}>Next</Button>
        </div>
    )
}

export default AddAlgoritms;