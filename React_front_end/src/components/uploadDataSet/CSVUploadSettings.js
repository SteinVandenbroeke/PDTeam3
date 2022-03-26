import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import {Col, Row, Table, Button, Form, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {Link} from "react-router-dom";
import ConnectComponent from "../ConnectComponent"
import LogicTable from "../logicTable"
import { UploadDataSet } from '../../logic/UploadDataSet';

const CSVUploadSettings = (props) => {

    let [tabelPreview , setTabelPreview] = useState([["Upload a csv"]]);

    useEffect(() => {
        fileUpload(props.csv);
    }, []);

    function fileUpload(csv){
        console.log(props.csvDbConnections);
        let request = new UploadDataSet(csv, setTabelPreview, props.setCsvDbConnections, props.csvDbConnections);
        request.readFileText();
    }

    return (
        <div style={{textAlign: "left"}}>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} md={4}>
                    <Card className={"shadow-lg"}>
                      <Card.Body>
                          <h5>CSV to db conversion</h5>
                          <ConnectComponent data={props.csvDbConnections} dataSetFunction={props.setCsvDbConnections}></ConnectComponent>
                          <Button variant="secondary" onClick={()=>props.setCurrentStep(props.currentStep - 1)}>Vorige</Button>{' '}
                          <Button variant="primary" onClick={()=>props.setCurrentStep(props.currentStep + 1)}>Volgende</Button>
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

export default CSVUploadSettings;
