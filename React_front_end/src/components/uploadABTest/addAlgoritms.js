import {Button, Card, Col, Form, ListGroup, Row} from "react-bootstrap";
import LogicTable from "../logicTable";
import React, {useEffect, useState} from "react";
import Slider from "../slider";
import Icon from "react-eva-icons";
import ConnectComponent from "../ConnectComponent";
import {valueOrDefault} from "chart.js/helpers";


const AddAlgoritms = (props) => {
    const [trainingIntervalvalue, setTrainingIntervalvalue] = React.useState([1]);
    const [algorithms,setAlgorithms] = React.useState([1]);

    function finish(){
         props.setCurrentStep(props.currentStep + 1)
    }
    function addAlgorithm(){
        /*
        let tempAlg = algorithms
        tempAlg.push(trainingIntervalvalue[0])*/
        setAlgorithms(algorithms => [...algorithms, trainingIntervalvalue[0]])
        //alert("a")
    }

    return (
        <div style={{textAlign: "left"}}>
            <Row>
                 <Form.Label>{props.title}</Form.Label>
            </Row>
            <Row  style={{paddingTop: 20, paddingBottom: 20}}>
                <Col xs lg="3">
                    <Form.Label style={{paddingBottom:10}}>Algorithms:</Form.Label>
                    <Form.Select>
                      <option>empty Alogithm</option>
                      <option value="1">Popularity</option>
                      <option value="2">Recency</option>
                      <option value="3">ItemKNN</option>
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
                          {algorithms}
                      </Card.Body>
                    </Card>
                </Col>
            </Row >
                <Button variant="secondary" onClick={()=>props.setCurrentStep(props.currentStep - 1)}>Previous</Button>{' '}
                <Button variant="primary" onClick={()=>finish()}>Finish</Button>
        </div>
    )
}

export default AddAlgoritms;