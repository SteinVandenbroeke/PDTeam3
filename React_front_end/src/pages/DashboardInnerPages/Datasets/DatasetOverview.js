import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button, Text} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import SmallInformationCard from "../../../components/smallInformationCard"
import {Link} from "react-router-dom";
import ItemCard from "../../../components/itemCard"
import PersonCard from "../../../components/personCard"

const DataSetOverview = () => {
    return (
        <div>
            <div style={{paddingTop: 20}}>
                Lijst van product card's<br/>
                Product card's bevat alle product informatie + knop om item te bekijken binnen een ab test met een bepaald algoritme
                <ItemCard />
                <PersonCard />
            </div>
        </div>
    );
};

export default DataSetOverview;
