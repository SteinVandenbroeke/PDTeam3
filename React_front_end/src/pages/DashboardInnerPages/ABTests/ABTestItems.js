import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Link, Outlet, Route, Router, useNavigate, useParams} from "react-router-dom";
import BackButton from "../../../components/backButton"
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider"
import {Row,Col} from "react-bootstrap";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {toast} from "react-toastify";

const ABTestItems = (props) => {
    const [loading, setLoading] = useState(false);
    const [data1,setData1] = useState([['Item Id', 'Title', 'Total Buy Rate', 'Buy Rate In Range', 'Total Recommend Rate', 'Recommend Rate In Range']])
    const [datasetId, setDatasetId] = useState(null)
    const {abTestId, startDate, endDate} = useParams()
    const [abTestData, setAbTestData] = React.useState({});
    const [loadusers, setloadusers] = useState(false);
    const navigation = useNavigate();


    function openItem(id){
        navigation("/dashboard/dataSets/overview/"+ datasetId + "/item/"+ id);
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


    function loadABData(){
        setLoading(true);
        let getData = {
            "abTestName": abTestId
        };
        let request = new ServerRequest();
        request.sendGet("ABTestOverview", getData).then(requestData => {setAbTestData(requestData); setLoading(false)}).catch(error => {toast.error(error.message); /*setLoading(false)*/});
        setloadusers(true)
    }

    function loadItems(){
        setLoading(true);
        let begin = parseInt(startDate);
        let end = parseInt(endDate);
        let getData = {
            "abTestId": abTestId,
            "startDate": abTestData.points[begin],
            "endDate": abTestData.points[end],
        }
        let request = new ServerRequest();
        request.sendGet("getItemsFromABTest",getData).then(requestData => {setData1(oldData=>[...oldData,...requestData]); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }


    useEffect(()=> {
        if (loadusers){
            loadItems();
        }
    }, [abTestData])

    useEffect(() => {
        getDataSetId()
        loadABData()
    },[]);

    return (
        <div className="App">
            <BackButton/>
            {/*<Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />*/}
            <div className="container">
                <Row>
                    <LogicTable action={openItem} data={data1}/>
                </Row>

            </div>

        </div>
    );
};

export default ABTestItems;
