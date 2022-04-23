import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"
import Accordion from "../../../components/Accordion"
import {Link, useParams} from "react-router-dom";
import {Button, Row, Col, Card, Spinner} from "react-bootstrap";
import Icon from "react-eva-icons";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";

const DataSetOverview = () => {

    const {setid} = useParams()

    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [people, setPeople] = useState([]);

    const listItems = items.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid} setid={setid} />);
    const listPeople = people.map((d) => <PersonCard id={d.personid} setid={setid}/>);
    const [itemOffset, setItemOffset] = useState(0);
    const [peopleOffset, setPeopleOffset] = useState(0);

    function loadItems(){
        setLoading(true);
        let request = new ServerRequest();
        let getData = {
            "dataSet": setid,
            "offset": itemOffset
        }
        request.sendGet("getItemList",getData).then(requestData => {setItems(items.concat(requestData)); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
        setItemOffset(itemOffset+10);
    }

    function loadPeople(){
        setLoading(true);
        let request = new ServerRequest();
        let getData = {
            "dataSet": setid,
            "offset": peopleOffset
        }
        request.sendGet("getPeopleList",getData).then(requestData => {setPeople(people.concat(requestData)); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
        setPeopleOffset(peopleOffset+10);
    }

    function deleteDataset(){
        setLoading(true);
        let request = new ServerRequest();
        let getData = {
            "dataSet": setid,
        }
        request.sendGet("deleteDataset",getData).then(message => {toast.success(message.message); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    useEffect(() => {
        loadItems()
        loadPeople()
    },[]);

    return (
        <div>
             <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                 <Link to={"/dashboard/dataSets/overview/" + setid + "/edit"} class={"btn"}>
                     <Button variant="primary">Edit Dataset<Icon name="edit-outline"/></Button>
                 </Link>
                 <Link to={"/dashboard/dataSets"} class={"btn"}>
                    <Button onClick={()=>deleteDataset()} variant="danger">Delete Dataset</Button>
                 </Link>
            </div>
            <div>
                <h2> This is dataset {setid} </h2>
                <Row>
                    <Col>
                        <Card className={"shadow-lg"}  style={{paddingTop: 10}}>
                            <h3>Items</h3>
                            <Spinner
                                className={!loading? "visually-hidden": ""}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <div style={{height:500, overflowY:"auto"}}>{listItems} <Button variant="primary" onClick={()=>loadItems()}>Load More</Button> </div>
                        </Card>
                    </Col>
                    <Col>
                        <Card className={"shadow-lg"} style={{paddingTop: 10}}>
                            <h3>People</h3>
                            <Spinner
                                className={!loading? "visually-hidden": ""}
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <div style={{height:500, overflowY:"auto"}}> {listPeople} <Button variant="primary" onClick={()=>loadPeople()}>Load More</Button></div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default DataSetOverview;
