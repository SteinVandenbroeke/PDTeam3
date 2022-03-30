import {Button, Form} from "react-bootstrap";
import LogicTable from "../logicTable";
import React from "react";


const ChooseDataset = (props) => {
    function clickDataset(id){
        props.setCurrentStep(props.currentStep + 1);
        props.setDataset(id);
    }

    return (
        <div>
           <Form.Label>{props.title}</Form.Label>
            <LogicTable action={clickDataset} data={[["id", "Dataset name", "Created by", "Creation date"], ["1", "H&M test dataset 1", "Stein Vandenbroeke", "09/03/2022"],["2", "H&M test dataset 2", "Stein Vandenbroeke", "09/03/2022"]]}/>
        </div>
    )
}


export default ChooseDataset;