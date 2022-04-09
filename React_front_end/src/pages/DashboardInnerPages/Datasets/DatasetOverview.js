import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"
import Accordion from "../../../components/Accordion"

const DataSetOverview = () => {
    const dataItems =[{"itemid": "9999", "name": "Sweater", "desc": "Long sleeved, hooded sweater"},
                      {"itemid": "8572", "name": "Leather Boot", "desc": "Black waterproof leather boot"}];
    const dataPeople =[{"personid": "4758", "name": "Jhon Deer"},
                       {"personid": "1121", "name": "Eric Tea"}];
    const listItems = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid}/>);
    const listPeople = dataPeople.map((d) => <PersonCard id={d.personid} />);

    return (
        <div>
            <div style={{paddingTop: 20}}>
                <Accordion title="Items" data={listItems} />
                <Accordion title="People" data={listPeople} />
            </div>
        </div>
    );
};

export default DataSetOverview;
