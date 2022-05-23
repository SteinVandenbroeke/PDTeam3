import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect} from 'react';
import {Button, Spinner} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {ServerRequest} from "../../../logic/ServerCommunication";
import TabelSkeleton from "../../../components/loadingSkeletons/tabelSkeleton";
import ServerError from "../../../components/serverError";

const DataSetsList = () => {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const [datasets, setDatasets] = useState([[]]);
    const [serverError, setServerError] = useState(false);
    function openDataSet(id){
        navigation("/dashboard/dataSets/overview/" + id);
    }

    function loadDatasets(){
        setDatasets([[]])
        setLoading(true);
        let request = new ServerRequest();
        request.sendGet("getDatasets").then(requestData => {setDatasets([["id", "Created by", "Creation date"]].concat(requestData)); setLoading(false);}).catch(error => {toast.error(error.message); setLoading(false); setServerError(true)});
    }

    useEffect(() => {
        loadDatasets()
    },[]);

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/dashboard/dataSets/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <TabelSkeleton loading={loading}><LogicTable action={openDataSet} data={datasets}/></TabelSkeleton>
            <ServerError error={serverError}/>
        </div>
    );
};

export default DataSetsList;
