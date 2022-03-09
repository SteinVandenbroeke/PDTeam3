import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table, Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link} from "react-router-dom";

const DataSetsList = () => {
    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/dashboard/dataSets/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable data={[["id", "Dataset name", "Created by", "Creation date"], ["test data", "lalal", "jsdjksd", "kkhkljk"]]}/>
        </div>
    );
};

export default DataSetsList;
