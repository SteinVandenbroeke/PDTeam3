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
    const {abTestId, startDate, endDate} = useParams()
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);
    const [itemData, setItemData] = useState([[]]);
    const [itemOffset, setItemOffset] = useState(0);
    const [values, setValues] = React.useState([0, 1]);
    const [datasetId, setDatasetId] = useState(null)


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
     const dataItems = {
         "popularity":{items: [
             {itemId: 1, Title: "titel1", recommendRate: 9, buyRate: 5},
                 {itemId: 2, Title: "titel2", recommendRate: 10,buyRate: 6}]
         },
         "recency":{items: [
             {itemId: 1, Title: "titel1", recommendRate: 9, buyRate: 7},
                 {itemId: 2, Title: "titel2", recommendRate: 10, buyRate: 8}]}}
    //const [itemData, setItemData] = React.useState([])
    //function loadData(){
    //    setItemData([{name:"test1"},{}])
    //    const itemData = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid}/>);
    //}
    //useEffect(()=>{loadData()}, [])


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
        setItemData([[]])
        setLoading(true);
        let getData = {
            "abTestId": abTestId,
            "offset": itemOffset,
            "startDate":startDate,
            "endDate": endDate
        }
        let request = new ServerRequest();
        request.sendGet("getItemsFromABTest",getData).then(requestData => {setItemData(itemData.concat(requestData)); setLoading(false)}).catch(error => {toast.error(error.message); setLoading(false)});
        setItemData(itemOffset+40)
    }

    function openUser(id){
        navigation("/dashboard/dataSets/overview/"+ abTestId + "/item/"+ id);
    }

    return (
        <div className="App">
            <BackButton/>
            {/*<Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />*/}
            <div className="container">
                <Row>
                    {Object.entries(itemData).map(([key, value]) => {
                        const algoKey = key
                        const data1 = [['Item Id', 'Title', 'Recommend Rate', 'Buy Rate']]
                        for(const x of value["items"]){
                            const tempArray = Object.values(x)
                            data1.push(tempArray)
                        }
                        return(
                        <Col>
                            <header><h1>{algoKey}</h1></header>
                            <LogicTable action={openUser} data={data1}/>
                        </Col>
                        )}
                    )}
                </Row>

            </div>

        </div>
    );
};

export default ABTestItems;
