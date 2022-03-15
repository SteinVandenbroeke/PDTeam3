import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import {Link, Outlet, Route, Router} from "react-router-dom";
import BackButton from "../../../components/backButton"

const DatasetsIndex = () => {
    return (
        <div className="App">
            <BackButton/>
            <header>
                <h1>AB tests</h1>
            </header>
            <Outlet/>
        </div>
    );
};

export default DatasetsIndex;
