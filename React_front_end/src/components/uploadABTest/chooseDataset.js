import {Button, Form, Spinner} from "react-bootstrap";
import LogicTable from "../logicTable";
import React, {useEffect, useState} from "react";
import {ServerRequest} from "../../logic/ServerCommunication";
import {toast} from "react-toastify";


const ChooseDataset = (props) => {
    const [loading, setLoading] = useState(false);
    const [datasets, setDatasets] = useState([[]]);

    function clickDataset(id){
        props.setCurrentStep(props.currentStep + 1);
        props.setDataset(id);
    }

    function loadDatasets(){
        setDatasets([[]])
        setLoading(true);
        let request = new ServerRequest();
        request.sendGet("getDatasets").then(requestData => {setDatasets([["id", "Created by", "Creation date"]].concat(requestData)); setLoading(false);}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    useEffect(() => {
        loadDatasets()
    },[]);

    return (
        <div>
           <Form.Label>Choose the required database.</Form.Label>
            <Spinner
                className={!loading? "visually-hidden": ""}
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
            />
            <LogicTable action={clickDataset} data={datasets}/>
        </div>
    )
}

export default ChooseDataset;