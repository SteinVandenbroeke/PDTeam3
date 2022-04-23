import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import {Col, Row, Table, Button, Form, Card} from "react-bootstrap";
import Icon from 'react-eva-icons';
import {Link} from "react-router-dom";
import ConnectComponent from "../ConnectComponent"
import LogicTable from "../logicTable"
import { UploadDataSet } from '../../logic/UploadDataSet';
import {toast} from "react-toastify";

const CSVUploadSettings = (props) => {

    let [tabelPreview , setTabelPreview] = useState([["Upload a csv"]]);

    useEffect(() => {
        fileUpload(props.csv);
    }, []);

    function fileUpload(csv){
        let request = new UploadDataSet(csv, setTabelPreview, props.setCsvDbConnections, props.csvDbConnections);
        request.readFileText();
    }

    function nexStep(){

        console.log(props.csvDbConnections)
        if("article_id" in props.csvDbConnections.connections &&
           "customer_id" in props.csvDbConnections.connections &&
           "price" in props.csvDbConnections.connections &&
           "t_dat" in props.csvDbConnections.connections) {
            //interaction
            props.setCurrentStep(props.currentStep + 1);
        }
        else if(!("title" in props.csvDbConnections.database) &&
                !("description" in props.csvDbConnections.database) &&
                "customer_id" in props.csvDbConnections.connections){
            //users
             props.setCurrentStep(props.currentStep + 1);
        }
        else if("article_id" in props.csvDbConnections.connections &&
           "prod_name" in props.csvDbConnections.connections &&
           "product_type_name" in props.csvDbConnections.connections) {
            //articels
            props.setCurrentStep(props.currentStep + 1);
        }
        else{
            toast.warn("Niet alle nodige columen zijn verbonden!")
        }
    }

    return (
        <div style={{textAlign: "left"}}>
            <Row style={{paddingTop: 20}}>
                <Col xs={12} md={4}>
                    <Card className={"shadow-lg"}>
                      <Card.Body>
                          <h5>CSV to db conversion</h5>
                          <ConnectComponent data={props.csvDbConnections} dataSetFunction={props.setCsvDbConnections}></ConnectComponent>
                          <Button variant="secondary" onClick={()=>props.setCurrentStep(props.currentStep - 1)}>Previous</Button>{' '}
                          <Button variant="primary" onClick={()=>nexStep()}>Next</Button>
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
