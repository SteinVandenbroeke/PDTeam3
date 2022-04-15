import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"
import Accordion from "../../../components/Accordion"
import {Link, useParams} from "react-router-dom";
import {Button} from "react-bootstrap";
import Icon from "react-eva-icons";

const DataSetOverview = () => {
    const {setid} = useParams()

    const dataItems =[{"itemid": "9999", "name": "Sweater", "desc": "Long sleeved, hooded sweater"},
                      {"itemid": "8572", "name": "Leather Boot", "desc": "Black waterproof leather boot"}];
    const dataPeople =[{"personid": "4758", "name": "Jhon Deer"},
                       {"personid": "1121", "name": "Eric Tea"}];
    const listItems = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid} setid={setid}/>);
    const listPeople = dataPeople.map((d) => <PersonCard id={d.personid} setid={setid}/>);

    return (
        <div>
             <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to={"/dashboard/dataSets/overview/" + setid + "/edit"} class={"btn"}>
                    <Button variant="primary">Edit <Icon name="edit-outline"/></Button>
                </Link>
            </div>
            <div>
                This is dataset {setid}
                <Accordion title="Items" data={listItems} />
                <Accordion title="People" data={listPeople} />
            </div>
        </div>
    );
};

export default DataSetOverview;
