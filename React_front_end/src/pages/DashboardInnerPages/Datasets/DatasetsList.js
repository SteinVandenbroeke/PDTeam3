import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"

const DataSetsList = () => {
    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}><Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button></div>
            <LogicTable data={["id", "Dataset name", "Created by", "Creation date"]}/>
        </div>
    );
};

export default DataSetsList;
