import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import BackButton from "../../../components/backButton"
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider"

const ABTestItems = (props) => {
     const dataItems = {
         "popularity":{items: [
             {Title: "titel1", itemId: 1, buyRate: 5, reccomendRate: 9, price: 13},
                 {Title: "titel2", itemId: 2, buyRate: 6, reccomendRate: 10, price: 14}]
         },
         "recency":{items: [
             {Title: "titel3", itemId: 3, buyRate: 7, reccomendRate: 11, price: 15},
                 {Title: "titel4", itemId: 4, buyRate: 8, reccomendRate: 12, price: 16}]}}
    var l = dataItems.length
    //const [itemData, setItemData] = React.useState([])
    //function loadData(){
    //    setItemData([{name:"test1"},{}])
    //    const itemData = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid}/>);
    //}
    //useEffect(()=>{loadData()}, [])


    return (
        <div className="App">
            <BackButton/>
            <header>
                <h1>AB tests</h1>
            </header>

            <ItemCard name={"item"} desc={"Representation of item"}/>

            <div className="container">
                <div className="row">
                    {dataItems.map((item, index) => {
                        return(
                        <div className="col">
                            <LogicTable data={[["d"], [2]]}/>
                        </div>
                        )}
                    )}
                </div>

            </div>



        </div>
    );
};

export default ABTestItems;
