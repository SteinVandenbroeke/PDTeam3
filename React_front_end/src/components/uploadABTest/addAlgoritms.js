import {Button, Card, Col, Container, Form, ListGroup, Row} from "react-bootstrap";
import LogicTable from "../logicTable";
import React, {useEffect, useState} from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";
import ConnectComponent from "../ConnectComponent";
import {valueOrDefault} from "chart.js/helpers";
import {ToastContainer} from "react-toastify";
import Login from "../../pages/Login";
import { toast } from 'react-toastify';

const AddAlgoritms = (props) => {
    const [trainingIntervalvalue, setTrainingIntervalvalue] = React.useState([1]);
    const [valueSelect, setValueSelect] = React.useState("0");
    const [algorithms,setAlgorithms] = React.useState([[]]);


    function finish(){
        if(algorithms.length === 1){
            toast.error("You need to add at least one algorithm.");
            return
        }
        props.setCurrentStep(props.currentStep + 1)
        props.setAlgorithms(algorithms)
    }
    function checkExistingCombination(){
        for (var i = 1; i < algorithms.length; i++) {
            if(algorithms[i][0] === valueSelect && parseInt(algorithms[i][1]) === parseInt(trainingIntervalvalue)){
                return true;
            }
        }
        return false;
    }

    function addAlgorithm(){
        if(valueSelect === "0"){
            toast.error("You need to select an algorithm.");
            return
        }
        if(checkExistingCombination()){
            toast.error("You cannot add an algorithm with the same parameters twice.");
            return
        }
        setAlgorithms(algorithms => [...algorithms, [valueSelect,trainingIntervalvalue]]);
        setValueSelect("0")
        setTrainingIntervalvalue([1])
    }
    function setAlgo(id){
        setValueSelect(id)
        console.log({id})
    }

    return (
        <div style={{textAlign: "left"}}>
            <Row>
                 <Form.Label>Choose your algorithms to run.</Form.Label>
            </Row>
            <Row  style={{paddingTop: 20, paddingBottom: 20}}>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:10}}>Algorithms:</Form.Label>
                    <Form.Select onChange={(e)=>setAlgo(e.target.value)} value={valueSelect}>
                      <option className={"disabled"}> empty Alogithm</option>
                      <option value="Popularity">Popularity</option>
                      <option value="Recency">Recency</option>
                      <option value="ItemKNN">ItemKNN</option>
                    </Form.Select>
                </Col>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:20}}>Training interval:</Form.Label>
                    <Slider max={20} min={0} step={1} setValues={setTrainingIntervalvalue} values={trainingIntervalvalue}/>
                </Col>
                <Col xs lg="2" style={{ textAlign:"center", paddingTop:30}}>
                    <Button variant="success" onClick={()=>addAlgorithm()}>Add</Button>
                </Col>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:10}}>Added algorithms:</Form.Label>
                    <Card className={"shadow-lg"}>
                      <Card.Body>
                          <LogicTable data={[["Algoriths","Training interval"]].concat(algorithms)}/>
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