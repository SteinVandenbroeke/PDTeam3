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
    const [itemData, setItemData] = useState({});
    const [datasetId, setDatasetId] = useState(null)

    const {abTestId, startDate, endDate} = useParams()
    const navigation = useNavigate();

    const dataItems = {
        "popularityid1":
            [
                {itemId: 1, Title: "titel1", recommendRate: 9, buyRate: 5},
                {itemId: 2, Title: "titel2", recommendRate: 10, buyRate: 6}
            ],
        "recencyid1":
            [
                {itemId: 1, Title: "titel1", recommendRate: 9, buyRate: 7},
                {itemId: 2, Title: "titel2", recommendRate: 10, buyRate: 8},
                {itemId: 3, Title: "titel1", recommendRate: 4, buyRate: 7},
                {itemId: 6, Title: "titel2", recommendRate: 0, buyRate: 100}
            ],
        "popularityid2":
            [
                {itemId: 1, Title: "titel1", recommendRate: 9, buyRate: 5},
                {itemId: 2, Title: "titel2", recommendRate: 10, buyRate: 6},
                {itemId: 81, Title: "titel1", recommendRate: 9, buyRate: 7},
                {itemId: 6, Title: "titel2", recommendRate: 0, buyRate: 0}
            ]
    }


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


    function loadItems(){
        //setLoading(true);
        let getData = {
            "abTestId": abTestId,
            "startDate": startDate,
            "endDate": endDate,
        }
        let request = new ServerRequest();
        //request.sendGet("getItemsFromABTest",getData).then(requestData => {setItemData(requestData[0]); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
        setItemData(dataItems)
    }



    useEffect(() => {
        getDataSetId()
        loadItems()
    },[]);

    return (
        <div className="App">
            <BackButton/>
            {/*<Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />*/}
            <div className="container">
                <Row>
                    {Object.entries(itemData).map(([key, value]) => {
                        const algoKey = key
                        const data1 = [['Item Id', 'Title', 'Recommend Rate', 'Buy Rate']]
                        for(const x of value){
                            const tempArray = Object.values(x)
                            data1.push(tempArray)
                        }
                        return(
                        <Col>
                            <header><h1>{algoKey}</h1></header>
                            <LogicTable action={openItem} data={data1}/>
                        </Col>
                        )}
                    )}
                </Row>

            </div>

        </div>
    );
};

export default ABTestItems;
