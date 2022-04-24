import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Link, Outlet, Route, Router, useNavigate, useParams} from "react-router-dom";
import BackButton from "../../../components/backButton"
import LogicTable from "../../../components/logicTable";
import Slider from "../../../components/slider";

const ABTestPersons = (props) => {
    const {abTestId} = useParams()
    const navigation = useNavigate();
    function openUser(id){
        navigation("/dashboard/dataSets/overview/"+ abTestId + "/person/"+ id);
    }

    //<Slider labels={abTestData.points} max={abTestData.points.length - 1} min={0} step={1} values={values} setValues={setValues} />

    const exampleUsers = [{"userId": 2, "userName": "userTest1", "Purchases": 9, "CTR": 32},
        {"userId": 9, "userName": "userTest2", "Purchases": 1, "CTR": 34}]

    const data1 = [["User Id", "User Name","Purchase Amount", "CTR"]]

    for(var i = 0; i < exampleUsers.length; i++){
        const temp = []
        for (const [key, value] of Object.entries(exampleUsers[i])) {
  		    temp.push(value)
	    }
        data1.push(temp)
    }

    return (
        <div className="App">
            <BackButton/>
            <LogicTable action={openUser} data={data1}/>
        </div>
    );
};

export default ABTestPersons;
