import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import BackButton from "../../../components/backButton"
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider"
import {Row,Col} from "react-bootstrap";

const ABTestItems = (props) => {
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
             {Title: "titel1", itemId: 1, buyRate: 5, reccomendRate: 9, price: 13},
                 {Title: "titel2", itemId: 2, buyRate: 6, reccomendRate: 10, price: 14}]
         },
         "recency":{items: [
             {Title: "titel3", itemId: 3, buyRate: 7, reccomendRate: 11, price: 15},
                 {Title: "titel4", itemId: 4, buyRate: 8, reccomendRate: 12, price: 16}]}}

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

            <ItemCard name={"item"} desc={"Representation of item"}/>

            <div className="container">
                <Row>
                    {dataItems.map((item, index) => {
                        return(
                        <Col>
                            <LogicTable data={[["d"], [2]]}/>
                        </Col>
                        )}
                    )}
                </Row>

            </div>

        </div>
    );
};

export default ABTestItems;
