import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button, Form, ProgressBar, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link} from "react-router-dom";
import ConnectComponent from "../../../components/ConnectComponent"

const AddDataset = () => {
    return (
        <div style={{textAlign: "left"}}>
            <ProgressBar now={0} />
            <Row style={{paddingTop: 20}}>
                <Col>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Upload interactie cvs</Form.Label>
                        <Form.Control type="file" />
                    </Form.Group>
                </Col>
                <Col>
                    <Card className={"shadow-lg"} style={{height: 500}} >
                      <Card.Body><ConnectComponent></ConnectComponent></Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AddDataset;
