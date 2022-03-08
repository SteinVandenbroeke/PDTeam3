import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Col, Row, Table} from "react-bootstrap";
import {Button} from "react-bootstrap";
import DataSetsList from "./DatasetsList"
import BackButton from "../../../components/backButton"

const DatasetsIndex = () => {
    return (
        <div className="App">
            <BackButton/>
            <header>
                <h1>Datasets</h1>
            </header>
            <DataSetsList/>
        </div>
    );
};

export default DatasetsIndex;
