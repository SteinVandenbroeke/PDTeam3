import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Link, Outlet, Route, Router, useNavigate, useParams} from "react-router-dom";
import BackButton from "../../../components/backButton"
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {toast} from "react-toastify";
import {Button} from "react-bootstrap";

const ABTestPersons = (props) => {
    const [loading, setLoading] = useState(false);
    const [personData, setPersonData] = useState([]);
    const [personOffset, setPersonOffset] = useState(0);
    const [values, setValues] = useState([0, 1]);
    const [datasetId, setDatasetId] = useState(null)
    const data1 = [["User Id","Purchase Amount", "CTR"]]
    const {abTestId} = useParams()
    const navigation = useNavigate();

    //static
    const [abTestData, setAbTestData] = React.useState({
        "algorithms": [],
        "points": [0,10],
        "parameters": {
            "topK": null,
            "stepSize": null,
            "datasetId": null
        },
        "NotAlgDependent":[]
    });


    function openUser(id){
        navigation("/dashboard/dataSets/overview/"+ datasetId + "/person/"+ id);
    }

    function getDataSetId(){
        setDatasetId(null)
        setLoading(true)
        let getData = {
            "abTestId": abTestId,
        }
        let request = new ServerRequest();
        request.sendGet("getDatasetIdFromABTest",getData).then(requestData => {setDatasetId(requestData); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    function loadUsers(){
        setPersonData([])
        setLoading(true);
        let getData = {
            "abTestId": abTestId,
            "offset": personOffset,
        }
        let request = new ServerRequest();
        request.sendGet("getUsersFromABTest",getData).then(requestData => {setPersonData(personData.concat(requestData)); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
        setPersonOffset(personOffset+40)
    }



    for(var i = 0; i < personData.length; i++){
        const temp = []
        for (const [key, value] of Object.entries(personData[i])) {
  		    temp.push(value)
	    }
        data1.push(temp)
    }

    useEffect(() => {
        getDataSetId()
        loadUsers()
    },[]);

    return (
        <div className="App">
            <BackButton/>

            <Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />

            <LogicTable action={openUser} data={data1}/>
            <Button variant="primary" onClick={()=>loadUsers()}>Load More</Button>
        </div>
    );
};

export default ABTestPersons;
