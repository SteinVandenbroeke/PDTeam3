import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Col, Row, Table, Button, Form, Card, Container, Badge, Tabs, Tab, Spinner } from "react-bootstrap";
import { ServerRequest } from '../../logic/ServerCommunication';
import { toast } from 'react-toastify';
import LogicTable from "../logicTable";

const UploadABTestToServer = (props) => {
    let [uploading, setUploading] = useState(0);

    function upload(abTestName, dataSetId, periodValues, topKValues, stepSizeValue, algorithms){
        setUploading(1);
        let request = new ServerRequest();
        var formData = new FormData();
        /*
        console.log(dataSetId)
        console.log(JSON.stringify(periodValues))
        console.log(topKValues[0])
        console.log(stepSizeValue[0])
        console.log(JSON.stringify(algorithms))*/
        console.log(algorithms)
        formData.append("abTestName", abTestName)
        formData.append("dataSetId", dataSetId);
        formData.append("periodValues", JSON.stringify(periodValues));
        formData.append("topKValues", topKValues);
        formData.append('stepSizeValue', stepSizeValue);
        formData.append('algorithms', JSON.stringify(algorithms));
        request.sendPost("createAbTest",formData, true).then(message => {toast.success(message.message); setUploading(2)}).catch(error => {toast.error(error.message); setUploading(3)});
    }

    return (
        <div>
            <Row style={{ paddingTop: 20 }}>
                <Col xs={2} sm={12} md={7} style={{ padding: 40 }}>
                    <Card className={"shadow-lg"}>
                        {uploading === 0 &&
                            <Card.Body >
                                <h5>Upload AB Test to server</h5>
                                <div style={{ paddingBottom: 20 }}>
                                    <Card className={"shadow-lg"}>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={4}>
                                                    <h6>AB-test Name:{props.abTestName}</h6>
                                                    <h6>Dataset ID: {props.dataSetId}</h6>
                                                    <h6>Period: {props.periodValues[0]} - {props.periodValues[1]}</h6>
                                                    <h6>TopK: {props.topKValues}</h6>
                                                    <h6>Stepsize: {props.stepSizeValue}</h6>
                                                </Col>
                                                <Col sm={8}>
                                                    <LogicTable data={[["Algorithms", "Training interval", "k"]].concat(props.algorithms)} />
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </div>
                                <Button variant="primary" onClick={() => upload(props.abTestName,props.dataSetId, props.periodValues, props.topKValues, props.stepSizeValue, props.algorithms)}>Upload</Button>{' '}
                            </Card.Body>
                        }
                        {uploading === 1 &&
                            <Card.Body>
                                <h5>Upload to server</h5>
                                <div style={{ paddingRight: "50%", paddingTop: 20, paddingBottom: 20 }}>
                                    <h1>Bestanden uploaden</h1>
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </div>
                            </Card.Body>
                        }
                        {uploading === 2 &&
                            <Card.Body>
                                <h5>Upload to server</h5>
                                <div style={{ paddingRight: "50%", paddingTop: 20, paddingBottom: 20 }}>
                                    <h1>Bestanden zijn succesvol geupload, u vindt de A/B test onder 'A/B Tests'</h1>
                                </div>
                            </Card.Body>
                        }

                        {uploading === 3 &&
                            <Card.Body>
                                <h5>Upload to server</h5>
                                <div style={{ paddingRight: "50%", paddingTop: 20, paddingBottom: 20 }}>
                                    <h1>Er ging iets fout bij het uploaden</h1>
                                    <Button variant="primary" onClick={() => upload(props.abTestName,props.dataSetId, props.periodValues, props.topKValues, props.stepSizeValue, props.algorithms)}>Upload</Button>{' '}
                                </div>
                            </Card.Body>
                        }
                    </Card>
                </Col>
                <Col xs={0} sm={0} md={5}>
                    <img src={"/svg/upload1.svg"} style={{ width: "90%" }} xs={0} />
                </Col>
            </Row>
        </div>
    )
};

export default UploadABTestToServer;