import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"
import Accordion from "../../../components/Accordion"
import {Link, Outlet, useParams} from "react-router-dom";
import {Button, Card, Col, FormText, Row, Form, Spinner} from "react-bootstrap";
import Icon from "react-eva-icons";
import LogicTable from "../../../components/logicTable";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";

const DataSetEdit = () => {
    const [itemsDB, setItemsDB] = React.useState([{dbName: "Title", dbValue: "dit is de title"},{dbName: "Description", dbValue: "dit is de beschrijving"},{dbName: "Price", dbValue: "€10"}]);
    const [currentItemId, setCurrentItemId] = React.useState(0);
    const [currentTable, setCurrentTable] = React.useState("Items");
    const [loading, setLoading] = useState(false);
    const {setid} = useParams()

    function loadId(itemId, tabel){
        setItemsDB([])
        setLoading(true);
        let getData = {
            "id": itemId,
            "table": tabel,
            "dataSet": setid
        }
        let request = new ServerRequest();
        request.sendGet("getRecordById",getData).then(requestData => {setItemsDB(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function safeValue(event){
        event.preventDefault()
        setLoading(true);
        const formData = new FormData(event.target);
        formData.append("id", currentItemId)
        formData.append("table", currentTable)
        formData.append("dataSet", setid)
        let request = new ServerRequest();
        request.sendPost("changeDataset",formData).then(message => {toast.success(message.message); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    return (
        <div>
            <div>
                <h3>Edit</h3>
                <Row>
                    <Col xs={12} md={4}>
                        <Card className={"shadow"} style={{padding: 30}}>
                            <h4>Search item</h4>
                            <Form.Select onChange={(e)=>setCurrentTable(e.target.value)}>
                                <option>Default select</option>
                                <option>articles</option>
                                <option>customers</option>
                            </Form.Select>
                            <br/>
                            <Form.Control type="number" placeholder="id" onChange={(e)=>setCurrentItemId(e.target.value)} />
                            <br/>
                            <Button onClick={()=>loadId(currentItemId, currentTable)}>Zoeken</Button>
                        </Card>
                    </Col>
                    <Col xs={12} md={8}>
                        <Card className={"shadow"} style={{padding: 30}}>
                            <h4>Edit item</h4>
                            <Row>
                                {itemsDB.map((item, index) => {
                                    return (<Col xs={12} md={6} style={{textAlign: "left", padding: 10}}>
                                                <form onSubmit={(event) => safeValue(event)}>
                                                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                      <Form.Label>{item.dbName}</Form.Label>
                                                      <Row>
                                                        <Col xs={10} style={{paddingRight: 0}}>
                                                            <Form.Control type="text" name="colmName" defaultValue={item.dbName} style={{borderTopRightRadius: 0, borderBottomRightRadius: 0, display: "none"}} />
                                                            <Form.Control type="text" name="value" defaultValue={item.dbValue} style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}} />
                                                        </Col>
                                                        <Col xs={2} style={{paddingLeft: 0}}>
                                                          <Button variant="primary" type="submit" style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}>
                                                            <Icon name="checkmark-outline"/>
                                                            <Spinner
                                                                    className={!loading? "visually-hidden": ""}
                                                                    as="span"
                                                                    animation="border"
                                                                    size="sm"
                                                                    role="status"
                                                                    aria-hidden="true"
                                                                />
                                                          </Button>
                                                        </Col>
                                                      </Row>
                                                  </Form.Group>
                                                </form>
                                        </Col>)
                                })}
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DataSetEdit;
