import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect} from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import BackButton from "../../../components/backButton"
import ItemCard from "../../../components/itemCard";
import LogicTable from "../../../components/logicTable";

const ABTestItems = (props) => {
     const dataItems =[{"itemid": "9999", "name": "Sweater", "desc": "Long sleeved, hooded sweater"},
                      {"itemid": "8572", "name": "Leather Boot", "desc": "Black waterproof leather boot"}];

    const [itemData, setItemData] = React.useState([])
    function loadData(){
        setItemData([{name:"test1"},{}])
        const itemData = dataItems.map((d) => <ItemCard name={d.name} desc={d.desc} id={d.itemid}/>);
    }
    useEffect(()=>{loadData()}, [])


    return (
        <div className="App">
            <BackButton/>
            <header>
                <h1>AB tests</h1>

                <LogicTable  data={[["e"], [2]]}/>

                <ItemCard name={"item"} desc={"Representation of item"}/>
            </header>
            <Outlet/>
        </div>
    );
};

export default ABTestItems;
