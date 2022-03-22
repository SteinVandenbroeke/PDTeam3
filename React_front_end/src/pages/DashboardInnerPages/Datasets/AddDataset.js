import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import UploadFromToIds from "../../../components/uploadDataSet/uploadFromToIds"
import UploadCVS from "../../../components/uploadDataSet/uploadCVS"
import {Col, Row, Table, Button, Form, ProgressBar, Card} from "react-bootstrap";

const AddDataset = () => {
    let [currentStep , setCurrentStep] = useState(0);
    let [interactionCSV , setInteractionCSV] = useState(null);


    return (
        <div style={{textAlign: "left"}}>
            <ProgressBar now={currentStep * 10} />
            {
                currentStep == 0 && (<UploadCVS setInteractionCSV={setInteractionCSV} setCurrentStep={setCurrentStep}/>)
            }
            {
                currentStep == 1 && (<UploadFromToIds interactionCSV={interactionCSV} setCurrentStep={setCurrentStep} />)
            }
        </div>
    );
};

export default AddDataset;
