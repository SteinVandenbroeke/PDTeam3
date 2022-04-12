import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState} from 'react';
import CSVUploadSettings from "../../../components/uploadDataSet/CSVUploadSettings"
import UploadCVS from "../../../components/uploadDataSet/uploadCVS"
import UploadDatasetToServer from "../../../components/uploadDataSet/uploadDatasetToServer"
import {Col, Row, Table, Button, Form, ProgressBar, Card} from "react-bootstrap";

const AddDataset = () => {
    let [currentStep , setCurrentStep] = useState(0);

    let [interactionCSV , setInteractionCSV] = useState(null);
    let [csvInteractionDbConnections, setInteractionCsvDbConnections] = useState({"database": ["timestamp", "user_id", "item_id", "parameter"], "csv": [], "connections": {}})

    let [usersCSV , setUsersCSV] = useState(null);
    let [csvUsersDbConnections, setUsersCsvDbConnections] = useState({"database": ["id", "extra info (int)", "extra info (varchar)", "extra info (datetime)"], "csv": [], "connections": {}})

    let [itemsCSV , setItemsCSV] = useState(null);
    let [csvItemsDbConnections, setItemsCsvDbConnections] = useState({"database": ["id", "title", "description", "extra info (int)", "extra info (varchar)", "extra info (datetime)", "extra info (image)"], "csv": [], "connections": {}})


    return (
        <div style={{textAlign: "left"}}>
            <ProgressBar now={currentStep * 14.29} />
            {
                currentStep === 0 && (<UploadCVS title={"Upload the csv with the interactions between users and items"} setCSV={setInteractionCSV} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
            }
            {
                currentStep === 1 && (<CSVUploadSettings currentStep={currentStep} csvDbConnections={csvInteractionDbConnections} setCsvDbConnections={setInteractionCsvDbConnections} csv={interactionCSV} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 2 && (<UploadCVS title={"Upload the csv with metadata for the users"} setCSV={setUsersCSV} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
            }
            {
                currentStep === 3 && (<CSVUploadSettings currentStep={currentStep} csvDbConnections={csvUsersDbConnections} setCsvDbConnections={setUsersCsvDbConnections} csv={usersCSV} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 4 && (<UploadCVS title={"Upload the csv with metadata for the items"} setCSV={setItemsCSV} setCurrentStep={setCurrentStep} currentStep={currentStep} />)
            }
            {
                currentStep === 5 && (<CSVUploadSettings currentStep={currentStep} csvDbConnections={csvItemsDbConnections} setCsvDbConnections={setItemsCsvDbConnections} csv={itemsCSV} setCurrentStep={setCurrentStep} />)
            }
            {
                currentStep === 6 && (<UploadDatasetToServer files={[interactionCSV, usersCSV, itemsCSV]}
                                                             interactionCSV={interactionCSV}
                                                             usersCSV={usersCSV}
                                                             itemsCSV={itemsCSV}
                                                             interactionConnections={csvInteractionDbConnections}
                                                             UsersConnections={csvUsersDbConnections}
                                                             itemsConnections={csvItemsDbConnections}
                                                             currentStep={currentStep}
                                                             setCurrentStep={setCurrentStep}/>)
            }
        </div>
    );
};

export default AddDataset;
