import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link, useNavigate} from "react-router-dom";

const DataSetsList = () => {
    const navigation = useNavigate();
    function openDataSet(id){
        navigation("/dashboard/dataSets/overview/" + id);
    }

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/dashboard/dataSets/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <LogicTable action={openDataSet} data={[["id", "Dataset name", "Created by", "Creation date"], ["h_m_dataset", "H&M test dataset 1", "Stein Vandenbroeke", "09/03/2022"],["2", "H&M test dataset 2", "Stein Vandenbroeke", "09/03/2022"]]}/>
        </div>
    );
};

export default DataSetsList;
