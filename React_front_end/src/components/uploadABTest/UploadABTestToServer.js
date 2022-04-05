import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Col, Row, Table, Button, Form, Card, Container, Badge, Tabs, Tab, Spinner} from "react-bootstrap";
import { ServerRequest } from '../../logic/ServerCommunication';
import { toast } from 'react-toastify';
import LogicTable from "../logicTable";

const UploadABTestToServer = (props) => {
    let [uploading , setUploading] = useState(0);

    function upload(dataSetId, periodValues, topKValues, stepSizeValue, algorithms){
        setUploading(1);
        let request = new ServerRequest();
        var formData = new FormData();
        formData.append("dataSetId", dataSetId);
        formData.append("periodValues", periodValues);
        formData.append("topKValues", topKValues);
        formData.append('stepSizeValue', stepSizeValue);
        formData.append('algorithms', algorithms);
        request.sendPost("upload",formData, true).then(function(){}).catch(error => {toast.error(error.message); setUploading(3)});
        props.setCurrentStep(props.currentStep + 1)
    }

    return (
        <div>
            <Row style={{paddingTop: 20}}>
                <Col xs={2} sm={12} md={7} style={{padding: 40}}>
                    <Card className={"shadow-lg"}>
                          <Card.Body >
                              <h5>Upload AB Test to server</h5>
                              <div style={{paddingBottom: 20}}>
                                  <Card className={"shadow-lg"}>
                                      <Card.Body>
                                          <Row>
                                              <Col sm={4}>
                                                  <h6>Dataset ID: {props.dataSetId}</h6>
                                                  <h6>Period: {props.periodValues[0]} - {props.periodValues[1]}</h6>
                                                  <h6>TopK: {props.topKValues}</h6>
                                                  <h6>Stepsize: {props.stepSizeValue}</h6>
                                              </Col>
                                              <Col sm={8}>
                                                  <LogicTable data={[["Algorithms","Training interval"]].concat(props.algorithms)}/>
                                              </Col>
                                          </Row>
                                      </Card.Body>
                                  </Card>
                              </div>
                              <Button  variant="primary" onClick={() => upload(props.dataSetId, props.periodValues, props.topKValues, props.stepSizeValue, props.algorithms)}>Upload</Button>{' '}
                          </Card.Body>
                    </Card>
                </Col>
                <Col xs={0} sm={0} md={5}>
                    <img src={"/svg/upload1.svg"} style={{width: "90%"}} xs={0}/>
                </Col>
            </Row>
        </div>
    )
};

export default UploadABTestToServer;