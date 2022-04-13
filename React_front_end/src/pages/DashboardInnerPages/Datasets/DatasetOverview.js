import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"
import Accordion from "../../../components/Accordion"
import {useParams} from "react-router-dom";

const DataSetOverview = () => {
    const {setid} = useParams()

    const dataItems =[{"itemid": "8572", "name": "Leather Boot", "desc": "Black waterproof leather boot"},
        {"itemid": "1245", "name": "T-shirt", "desc": "White T-shirt"},
        {"itemid": "1246", "name": "Leather Jacket", "desc": "Brown leather jacket"},
        {"itemid": "1247", "name": "Green Sunglasses", "desc": "Jade green aviator sunglasses"},
        {"itemid": "1248", "name": "Jeans", "desc": "Blue denim jeans"}];
    const dataPeople =[{"personid": "4758", "name": "Jhon Deer"},
        {"personid": "1121", "name": "Eric Tea"},
        {"personid": "1542", "name": "Eric Coffee"},
        {"personid": "4872", "name": "Denzo Key"}];
    const listItems = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid} setid={setid}/>);
    const listPeople = dataPeople.map((d) => <PersonCard id={d.personid} setid={setid}/>);

    return (
        <div>
            <div style={{paddingTop: 20}}>
                This is dataset {setid}
                <Accordion title="Items" data={listItems} />
                <Accordion title="People" data={listPeople} />
            </div>
        </div>
    );
};

export default DataSetOverview;
