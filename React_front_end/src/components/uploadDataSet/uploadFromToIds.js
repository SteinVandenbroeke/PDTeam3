import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import {Col, Row, Table, Button, Form, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {Link} from "react-router-dom";
import ConnectComponent from "../ConnectComponent"
import LogicTable from "../logicTable"
import { UploadDataSet } from '../../logic/UploadDataSet';

const UploadFromToIds = (props) => {

    let [tabelPreview , setTabelPreview] = useState([["Upload a csv"]]);
    let [csvDbConnections, setCsvDbConnections] = useState({"database": [], "csv": [], "connections": {"testItem": "1"}})

    useEffect(() => {
        fileUpload(props.interactionCSV);
    });

    function fileUpload(csv){
        let request = new UploadDataSet(csv, setTabelPreview, setCsvDbConnections);
        request.readFileText();
    }

    return (
        <div style={{textAlign: "left"}}>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} md={4}>
                    <Card className={"shadow-lg"}>
                      <Card.Body>
                          <h5>CSV to db conversion</h5>
                          <ConnectComponent data={csvDbConnections} dataSetFunction={setCsvDbConnections}></ConnectComponent>
                          <Button variant="secondary" onClick={()=>props.setCurrentStep(0)}>Vorige</Button>{' '}
                          <Button variant="primary" onClick={()=>props.setCurrentStep(2)}>Volgende</Button>
                      </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} md={8}>
                    <Card className={"shadow-lg"}>
                        <Card.Body>
                            <h5>Preview table</h5>
                            <LogicTable data={tabelPreview}/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
        )
};

export default UploadFromToIds;
