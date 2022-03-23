import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Col, Row, Table, Button, Form, Card, Container} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {Link} from "react-router-dom";
import ConnectComponent from "../ConnectComponent"
import LogicTable from "../logicTable"
import { UploadDataSet } from '../../logic/UploadDataSet';

const UploadCVS = (props) => {
    function fileUpload(e){
        props.setCurrentStep(1);
        props.setInteractionCSV(e.target.files[0]);
        /*
        let request = new UploadDataSet(e.target.files[0], setTabelPreview, setCsvDbConnections);
        request.readFileText();*/
    }

    return (
        <div>
            <Container fluid="md">
                <Row style={{paddingTop: 20}}>
                    <Col xs={12} sm={12} md={5} style={{padding: 40}}>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Upload interactie cvs</Form.Label>
                            <Form.Control type="file" onChange={fileUpload} />
                        </Form.Group>
                    </Col>
                    <Col xs={0} sm={0} md={7}>
                        <img src={"/svg/upload.svg"} style={{width: "90%"}} xs={0}/>
                    </Col>
                </Row>
            </Container>
        </div>
        )
};

export default UploadCVS;
