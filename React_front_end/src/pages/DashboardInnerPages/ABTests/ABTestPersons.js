import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Link, Outlet, Route, Router, useNavigate} from "react-router-dom";
import BackButton from "../../../components/backButton"
import LogicTable from "../../../components/logicTable";

const ABTestPersons = (props) => {
    const navigation = useNavigate();
    function openUser(){
        navigation("/dashboard/abTests/");
    }


    const exampleUsers = [{"userName": "userTest1", "userId": 2, "aankopen": 9, "CTR": 32},
        {"userName": "userTest2", "userId": 9, "aankopen": 1, "CTR": 34}]

    const data1 = [["User Name", "User Id","Aantal Aankopen", "CTR"]]

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
            <header>
                <h1>AB tests</h1>
            </header>
            <Outlet/>

            <LogicTable action={openUser} data={data1}/>

        </div>
    );
};

export default ABTestPersons;
