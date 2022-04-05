import {Button, Card, Col, Row} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {useNavigate } from "react-router-dom";
import React, {useEffect} from "react";
import LargeInformationCard from "../largeInformationCard";
import LogicTable from "../logicTable";

const ABTestInformation = (props) => {
    const navigation = useNavigate();
    console.log(props.algorithms)


    return (
        <LargeInformationCard title={"ABTest Information"}>
              <Row>
                  <Col sm={4}>
                      <h6>Dataset ID: {props.parameters.datasetId}</h6>
                      <h6>TopK: {props.parameters.topK}</h6>
                      <h6>Stepsize: {props.parameters.stepSize}</h6>
                  </Col>
                  <Col sm={8}>
                  </Col>
              </Row>
        </LargeInformationCard>
        )
};

export default ABTestInformation;
