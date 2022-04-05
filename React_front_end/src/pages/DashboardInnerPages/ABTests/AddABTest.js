import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import {Form, ProgressBar} from "react-bootstrap";
import ChooseDataset from "../../../components/uploadABTest/chooseDataset";
import SelectABSettings from "../../../components/uploadABTest/SelectABSettings";
import AddAlgoritms from "../../../components/uploadABTest/addAlgoritms";
import UploadABTestToServer from "../../../components/uploadABTest/UploadABTestToServer";





const AddABTest = () => {
    let [currentStep , setCurrentStep] = useState(0);
    let [dataSetId , setDatasetId] = useState([]);
    let [periodValues , setPeriodValues] = useState([]);
    let [topKValue , setTopKValue] = useState([]);
    let [stepSizeValue , setStepSizeValue] = useState([]);
    let [algorithms , setAlgorithms] = useState([]);
    return (
        <div style={{textAlign: "left"}}>
            <chooseDataset title={"Choose the required database"}  currentStep={currentStep} setCurrentStep={setCurrentStep} />
            <ProgressBar now={currentStep * 25} />
            {
                currentStep === 0 && (<ChooseDataset setDataset={setDatasetId}  currentStep={currentStep} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 1 && (<SelectABSettings setPeriodValues={setPeriodValues} setTopKValue={setTopKValue} setStepSizeValue={setStepSizeValue} currentStep={currentStep} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 2 && (<AddAlgoritms currentStep={currentStep} setCurrentStep={setCurrentStep} setAlgorithms={setAlgorithms}/>)
            }
            {
                currentStep === 3 && (<UploadABTestToServer currentStep={currentStep}
                                                            setCurrentStep={setCurrentStep}
                                                            dataSetId={dataSetId}
                                                            periodValues={periodValues}
                                                            topKValues={topKValue}
                                                            stepSizeValue={stepSizeValue}
                                                            algorithms={algorithms}/>)
            }
            {
                currentStep === 4 && (
                    <h6 style={{paddingTop:20}}>Upload succesfull</h6>
                )
            }

        </div>
    );
};

export default AddABTest;

