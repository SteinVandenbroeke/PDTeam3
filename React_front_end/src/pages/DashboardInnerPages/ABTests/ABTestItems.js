import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Link, Outlet, Route, Router, useNavigate} from "react-router-dom";
import BackButton from "../../../components/backButton"
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider"
import {Row,Col} from "react-bootstrap";

const ABTestItems = (props) => {
    const navigation = useNavigate();
    function openUser(id){
        navigation("/dashboard/dataSets/overview/"+ abTestId + "/item/"+ id);
    }

    const [values, setValues] = React.useState([0, 1]);
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
             {itemId: 1, Title: "titel1", price: 13, recommendRate: 9, buyRate: 5},
                 {itemId: 2, Title: "titel2" , price: 14, recommendRate: 10,buyRate: 6}]
         },
         "recency":{items: [
             {itemId: 1, Title: "titel1", price: 13, recommendRate: 9, buyRate: 7},
                 {itemId: 2, Title: "titel2",  price: 14, recommendRate: 10, buyRate: 8}]}}

    //const [itemData, setItemData] = React.useState([])
    //function loadData(){
    //    setItemData([{name:"test1"},{}])
    //    const itemData = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid}/>);
    //}
    //useEffect(()=>{loadData()}, [])


    return (
        <div className="App">
            <BackButton/>
            <Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />
            <div className="container">
                <Row>
                    {Object.entries(dataItems).map(([key, value]) => {
                        const algoKey = key
                        const data1 = [['Item Id', 'Title', 'Price', 'Recommend Rate', 'Buy Rate']]
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
