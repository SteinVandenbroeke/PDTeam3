import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Link, Outlet, Route, Router, useNavigate, useParams} from "react-router-dom";
import BackButton from "../../../components/backButton"
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {toast} from "react-toastify";
import {Button, Card, Form, Modal, Spinner} from "react-bootstrap";
import TabelSkeleton from "../../../components/loadingSkeletons/tabelSkeleton";

const ABTestPersons = (props) => {
    const [loading, setLoading] = useState(false);
    const [datasetId, setDatasetId] = useState(null)
    const [data1,setData1] = useState([["User Id","Purchase Amount", "Total Purchases", "Purchases In Range", "Total CTR", "CTR In Range"]])
    let {abTestId, startDate, endDate} = useParams()
    const navigation = useNavigate();
    // const [modal, setModal] = useState(false);
    // const [personID, setPersonID] = useState(-1);
    const [abTestData, setAbTestData] = React.useState({});
    const [loadusers, setloadusers] = useState(false);

    function openUser(id){
        navigation("/dashboard/dataSets/overview/"+ datasetId + "/person/"+ id);
    }

    // function openModal(id){
    //     setModal(true);
    //     setPersonID(id);
    // }

    function getDataSetId(){
        setDatasetId(null);
        setLoading(true);
        let getData = {
            "abTestId": abTestId,
        };
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

    function loadUsers(){
        setLoading(true);
        let begin = parseInt(startDate);
        let end = parseInt(endDate);
        let getData = {
            "abTestId": abTestId,
            "startDate": abTestData.points[begin],
            "endDate": abTestData.points[end],
        };
        let request = new ServerRequest();
        request.sendGet("getUsersFromABTest",getData).then(requestData => {setData1(oldData=>[...oldData,...requestData[0]]); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
    }

    useEffect(()=> {
        if (loadusers){
            loadUsers();
        }
    }, [abTestData])



    useEffect(() => {
        getDataSetId();
        loadABData();
    },[]);

    return (
        <div className="App">
            <BackButton/>
            {/*<Modal show={modal} fullscreen={true}>*/}
            {/*    <Modal.Header closeButton onClick={()=>setModal(false)}>*/}
            {/*      <Modal.Title>Person Metrics for Person {personID}</Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <div style={{paddingTop: 20}}>*/}
            {/*            <Card className={"shadow"} style={{textAlign: "left", maxHeight: "80vh", borderWidth: 0}}>*/}
            {/*                <Card.Body style={{height: "100%"}}>*/}
            {/*                    {props.loading === true && <Spinner style={{position: "absolute", right: 0, margin: 10, top: 0}} animation="grow" size="sm" />}*/}
            {/*                    TEST*/}
            {/*                </Card.Body>*/}
            {/*                <Button variant="primary" onClick={()=>openUser(personID)} style={{borderWidth: 0}}>Person Page</Button>*/}
            {/*            </Card>*/}
            {/*        </div>*/}
            {/*    </Modal.Body>*/}
            {/*</Modal>*/}
            {/*<Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />*/}
            <TabelSkeleton loading={loading}><LogicTable action={openUser} data={data1}/></TabelSkeleton>
        </div>
    );
};

export default ABTestPersons;
