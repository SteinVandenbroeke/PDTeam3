import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import {Form, ProgressBar} from "react-bootstrap";
import ChooseDataset from "../../../components/uploadABTest/chooseDataset";
import ChooseDayInterval from "../../../components/uploadABTest/chooseDayInterval";




const AddABTest = () => {
    let [currentStep , setCurrentStep] = useState(0);
    let [dataSetId , setDatasetId] = useState(null);
    let [dayInterval , setDayInterval] = useState(null);
    return (
        <div style={{textAlign: "left"}}>
            <chooseDataset title={"Choose the required database"}  currentStep={currentStep} setCurrentStep={setCurrentStep} />
            <ProgressBar now={currentStep * 50} />
            {
                currentStep === 0 && (<ChooseDataset title={"Choose the required database."} setDataset={setDatasetId}  currentStep={currentStep} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 1 && (<ChooseDayInterval title={"Choose your day-interval."} setDayInterval={setDayInterval}  currentStep={currentStep} setCurrentStep={setCurrentStep} />)
            }

        </div>
    );
};

export default AddABTest;

