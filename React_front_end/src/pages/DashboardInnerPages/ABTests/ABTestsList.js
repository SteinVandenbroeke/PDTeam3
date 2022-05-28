

import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from 'react';
import {Col, Row, Table, Button} from "react-bootstrap";
import Icon from 'react-eva-icons';
import LogicTable from "../../../components/logicTable"
import {Link, useNavigate} from "react-router-dom";
import {ServerRequest} from "../../../logic/ServerCommunication";
import {toast} from "react-toastify";
import TabelSkeleton from "../../../components/loadingSkeletons/tabelSkeleton";
import ServerError from "../../../components/serverError";

const ABTestsList = () => {
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(false);
    const [listData, setListData] = useState([[]]);
    function openAbTest(id){
        navigation("/dashboard/abTests/overview/" + id);
    }

    function handleRequestData(data){
        let list = ["Status","Name", "Dataset", "Stepsize"]
        let count = data.at(-1)
        for (let i=1; i < count + 1; i++) {
            list.push("algorithm" + i)
        }
        setListData([list])
        for(let i=0; i<data.length-1; i++) {
            let Status=(
                <div style={{verticalAlign:"middle"}}>
                    {data[i][0] === 0 && <Icon fill="#dc3545" name="close-outline"/>}
                    {data[i][0] === 1 && <Icon fill="#07AD19" name="checkmark-outline"/>}
                    {data[i][0] === 2 && <Icon fill="#FFA212" name="clock-outline"/>}
                </div>
            )
            data[i][0] = Status
            setListData(oldData=>[...oldData,data[i]])
            // header.push(data[i])
        }
    }

    function loadABtests(){
        setLoading(true);
        let request = new ServerRequest();
        request.sendGet("getABtests").then(requestData => {handleRequestData(requestData); setLoading(false);}).catch(error => {toast.error(error.message); setLoading(false); setServerError(true)});
    }

    useEffect(() => {
        loadABtests()
    },[]);

    return (
        <div>
            <div style={{width: "100%", textAlign: "right", paddingBottom: "10px"}}>
                <Link to="/dashboard/abTests/add" class={"btn"}>
                    <Button variant="primary">Add new <Icon name="plus-circle-outline"/></Button>
                </Link>
            </div>
            <TabelSkeleton loading={loading}><LogicTable action={openAbTest} data={listData} tableIndex={1}/></TabelSkeleton>
            <ServerError error={serverError}/>
        </div>
    );
};

export default ABTestsList;
