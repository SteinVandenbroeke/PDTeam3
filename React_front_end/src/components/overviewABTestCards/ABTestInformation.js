import {Button, Card, Col, Modal, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import LogicTable from "../logicTable";

const ABTestInformation = (props) => {
    const navigation = useNavigate();

    let data = [["Algorithms","Training interval"]].concat(getAlgorithms())

    function getAlgorithms(){
        let a = []
        for(let key in props.algorithms){
            a.push([key,props.algorithms[key].trainingInterval])
        }
        return a
    }

    return (
            <LargeInformationCard title={"ABTest Information"} tooltip={"Information about this ABTest"}>
              <Row>
                  <Col sm={4}>
                      <h6>Dataset ID: {props.parameters.datasetId}</h6>
                      <h6>TopK: {props.parameters.topK}</h6>
                      <h6>Stepsize: {props.parameters.stepSize}</h6>
                  </Col>
                  <Col sm={8}>
                      <LogicTable data={data}/>
                  </Col>
              </Row>
            </LargeInformationCard>
        )
};

export default ABTestInformation;
