import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Col, Row, Table, Button, Form, Card, Container, Badge, Tabs, Tab, Spinner} from "react-bootstrap";
import { ServerRequest } from '../../logic/ServerCommunication';
import { toast } from 'react-toastify';

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
    }

    return (
        <div>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} sm={12} md={7} style={{padding: 40}}>
                    <Card className={"shadow-lg"}>
                          <Card.Body>
                              <h5>Upload to server</h5>
                              <Button variant="primary" onClick={() => upload(props.dataSetId, props.periodValues, props.topKValues, props.stepSizeValue, props.algorithms)}>Upload</Button>{' '}
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